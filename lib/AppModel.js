import { TypeKey } from 'mosaic-adapters';
import { Data, DataSet, DataSetPaginated, DataSetSelection } from 'mosaic-dataset';
import { DataSetIndex, SearchableDataSet, SearchCriteria, SearchCriteriaDataSet } from 'mosaic-dataset-index';
import Resource from './Resource';
import EnumeratedDataSet from './EnumeratedDataSet';
import TextSearchCriteria from './TextSearchCriteria';

/**
 * Application model contains the following features:
 * <ul>
 * <li>It contains a main data set with data</li>
 * <li>It contains a "searchIndex" data set with multiple full-text indexes for
 * the main dataset. The method "search" allows to update the content of this
 * index.</li>
 * <li>It contains the "searchCriteria" data set with instances of the
 * "EntitySearchCriteria" class. Changes in this data set automatically updates
 * the "searchIndex" set. </li>
 * <li>A "paginatedDataSet" gives access to a limited sub-set of found
 * elements. It implements pagination of search results</li>
 * <li>"focusedItems" data set giving access to focused items. It
 * automatically updates position in the "paginatedDataSet" - it focus the page
 * with the first open item.</li>
 * <li>"selectedItems" data set giving access to selected items. </li>
 * </ul>
 * Important methods of this class:
 * <ul>
 * <li>The "suggest" method allows to retrieve a list of search criteria
 * objects matching to the specified text mask</li>
 * <li>The "search" method allows to execute a search using a data set
 * containing search criteria objects</li>
 * </ul>
 */
export default class AppModel {

    constructor(options, ...params){
        options = options || {};
        const that = this;
        that.options = options;
        if (!that.options.DataType) {
            that.options.DataType = Resource;
        }
        
        that.dataSet = that._newDataSet(options, ...params);
        that.adapters = that.dataSet.adapters;
        
        // Search criteria
        that.searchCriteria = that._newSearchCriteria();
        
        // Search index and suggestion indexes
        const indexFields = {};
        that.suggestionIndexes = {}; 
        that.searchCriteriaTypes.forEach(function(DataType){
            const indexKey = DataType.indexKey;
            if (DataType.indexFields){
                indexFields[indexKey] = DataType.indexFields;
            }
            if (DataType.suggestionFields) {
                that.suggestionIndexes[indexKey] = that._newSuggestionIndex({
                    DataType,
                    indexFields: DataType.suggestionFields
                });
            }
        });
        that.searchIndex = that.dataSet.newAdapter(SearchableDataSet, {
            indexFields
        });
        that.searchIndex.options.cluster = true;
        
        // Paginated data set for search results
        that.paginatedDataSet = that.searchIndex.getAdapter(DataSetPaginated);
        that.paginatedDataSet.pageSize = 20;

        // Open items
        that.focusedItems = that.searchIndex.newAdapter(DataSetSelection);
        // @deprecated use the "focusedItems" field instead 
        that.openItems = that.focusedItems;

        // Selected items
        that.selectedItems = that.searchIndex.newAdapter(DataSetSelection);

        // Bind event listeners to this object
        that._onUpdateFocus = that._onUpdateFocus.bind(that);
        that._onDataSetUpdate = that._onDataSetUpdate.bind(that);
        that._onSuggestionSetUpdated = that._onSuggestionSetUpdated.bind(that);
        that._handleSearchIntent = that._handleSearchIntent.bind(that);
    }
    
    get _suggestionSet(){
        return this.options.useFacets ? this.searchIndex : this.dataSet;
    }
    
    // ------------------------------------------------------------------------

    open(options){
        options = options || {};
        const that = this;
        return Promise.resolve().then(function(){
            that.focusedItems.addListener('update', that._onUpdateFocus);
            that.dataSet.addListener('update', that._onDataSetUpdate);
            that._suggestionSet.addListener('update', that._onSuggestionSetUpdated);
            that.searchCriteria.addListener('update', that._handleSearchIntent);
        }).then(function(){
            // Set configuration parameters;
            // Initializes suggestion data sets
            return that.setSuggestions(options);
        }).then(function(){
            // Set the resources in the main dataset
            return that.dataSet.setItems(options.resources);
        }).then(function(){
            // Reset search criteria
            const searchCriteria = options.searchCriteria || [];
            return that.searchCriteria.setItems(searchCriteria);
        });
    }

    close(){
        const that = this;
        const result = super.close();
        return Promise.resolve().then(function(){
            that.focusedItems.removeListener('update', that._onUpdateFocus);
            that.searchCriteria.removeListener('update', that._handleSearchIntent);
            that.dataSet.removeListener('update', that._onDataSetUpdate);
            that._suggestionSet.removeListener('update', that._onSuggestionSetUpdated);
            return result;
        })
    }

    // ------------------------------------------------------------------------
    
    /**
     * Re-initializes suggestion indexes.
     */
    setSuggestions(options, reset){
        const that = this;
        const promises = [];
        Object.keys(that.suggestionIndexes).forEach(function(indexKey){
            let values = options[indexKey];
            if (values || !!reset) {
                values = values || [];
                const set = that.suggestionIndexes[indexKey];
                promises.push(set.setItems(values));
            }
        });
        if (reset){
            promises.push(this._updateSuggestionValues());
        }
        return Promise.all(promises);
    }

    // ------------------------------------------------------------------------
    
    /**
     * Returns a promise with SearchCriteria objects corresponding to the
     * specified query.
     */
    suggest(query){
        const that = this;
        let maxNumber = this.maxSuggestResults;
        const promises = [];
        promises.push(that.suggestTextQuery(query, maxNumber));
        Object.keys(that.suggestionIndexes).forEach(function(indexKey){
            const set = that.suggestionIndexes[indexKey];
            const intent = set.search(query, maxNumber);
            promises.push(intent);
        });
        const adapters = that.adapters;
        return Promise.all(promises).then(function(dataSets){
            let items = [];
            dataSets.forEach(function(dataSet){
                if (!dataSet || !dataSet.length)
                    return ;
                items = items.concat(dataSet.items);
            })
            return new SearchCriteriaDataSet({
                adapters,
                items
            });
        });
    }

    suggestTextQuery(query) {
        const that = this;
        const adapters = that.adapters;
        return Promise.resolve().then(function(){
            const items = [];
            if (query && query.length) {
                let key = (query ? '' + query : '');
                items.push({
                    key,
                    values : [ query ]
                });
            }
            const result = new DataSet({
                adapters,
                DataType : that.TextSearchCriteria
            });
            return result.setItems(items).then(function(){
                return result;
            });
        });
    }
    
    // ------------------------------------------------------------------------
    
    serializeSearchCriteria() {
        const that = this;
        const result = {};
        const searchCriteria = this.searchCriteria;
        searchCriteria.visit({
            before : function(criterion){
                const indexKey = criterion.indexKey;
                if (!indexKey) return;
                const set = that.suggestionIndexes[indexKey];
                const value = !!set ? set.getSearchValues(criterion) : undefined;
                let prev = result[indexKey] || [];
                result[indexKey] = prev.concat(value);
            }
        });
        Object.keys(that.suggestionIndexes).forEach(function(indexKey){
            if (indexKey in result) return ;
            result[indexKey] = null;
        });
        return result;
    }
    
    deserializeSearchCriteria(params) {
        params = params || {};
        const adapters = this.adapters;
        const items = [];
        const that = this;
        Object.keys(that.suggestionIndexes).forEach(function(indexKey){
            let values = params[indexKey];
            if (!values) return ;
            values = Array.isArray(values) ? values : values ? [values] : [];
            const set = that.suggestionIndexes[indexKey];
            if (!set || typeof set.getSearchCriterion !== 'function') return ;
            values.forEach(function(value){
                const item = set.getSearchCriterion(value, true);
                if (item){
                    items.push(item);
                }
            });
        });
        return this.searchCriteria.setItems(items);
    }

    // ------------------------------------------------------------------------

    // @deprecated use the serializeFocusedItems instead 
    serializeOpenItems() { return this.serializeFocusedItems(); }
    serializeFocusedItems(){ 
        return this.focusedItems.items.map(function(item){
            return item.id;
        });
    }
    
    // @deprecated use the deserializeFocusedItems instead 
    deserializeOpenItems(ids){ return this.deserializeFocusedItems(ids); }
    deserializeFocusedItems(ids){
     
        if (!Array.isArray(ids)) {
            if (typeof ids === 'string') {
                ids = ids.split(/[,;]/gim);                
            } else {
                ids = !!ids ? [ids] : [];
            }
        }
        const that = this;
        const items = [];
        ids.forEach(function(id){
            const item = that.dataSet.byId(id);
            if (item) {
                items.push(item);
            }
        });
        return this.focusedItems.setItems(items);
    }
    
    // ------------------------------------------------------------------------
    
    getSearchCriteria(indexKey, value) {
        const set = that.suggestionIndexes[indexKey];
        return set ? set.getItem(value, true) : null;
    }
    
    get maxSuggestResults(){
        return this.options.maxSuggestResults || 3;
    }

    // ------------------------------------------------------------------------

    get TextSearchCriteria(){
        const Type = this.options.TextSearchCriteria || TextSearchCriteria;
        return Type;
    }
    
    get searchCriteriaTypes(){
        if (!this._searchCriteriaTypes) {
            let types = this.options.searchCriteriaTypes || [];
            this._searchCriteriaTypes = types;
        }
        return this._searchCriteriaTypes;
    }
    
    // ------------------------------------------------------------------------

    _newSuggestionIndex(options){
        options.adapters = this.adapters;
        return new EnumeratedDataSet(options);
    }
    
    /** Creates and returns a new dataset */
    _newDataSet(...params){
        const Type = this.options.DataSetType || DataSet;
        return new Type(...params); 
    }
    
    _newSearchCriteria() {
        const adapters = this.adapters;
        return new SearchCriteriaDataSet({
            adapters,
            defaultIndexKey: 'q'
        });
    }

    _handleSearchIntent(intent){
        const that = this;
        return intent.then(function(){
            return that._runSearch();
        });
    }
    
    _onDataSetUpdate(intent){
        const that = this;
        intent.then(function(){
            return that._runSearch();
        });
    }
    
    _onUpdateFocus(intent){
        const that = this;
        intent.then(function(){
            that._updateFocus();
        });
    }
    
    _onSuggestionSetUpdated(intent){
        const that = this;
        intent.then(function(){
            return that._updateSuggestionValues();
        });
    }
    
    _updateSuggestionValues(){
        const that = this;
        return Promise.resolve().then(function(){
            const promises = [];
            // Automatically extracts all fields marked with the "suggest"
            // flag
            Object.keys(that.suggestionIndexes).forEach(function(indexKey){
                const set = that.suggestionIndexes[indexKey];
                const indexFields = set.DataType.indexFields;
                if (indexFields) {
                    Object.keys(indexFields).forEach(function(fieldName) {
                        const field = indexFields[fieldName];
                        if (!field.suggest) return ;
                        const values = that._extractFieldValues(fieldName);
                        promises.push(set.setItems(values));
                    });
                }
            });
            return Promise.all(promises).then(function(){
                that._updateFocus();
            });
        });
    }

    _updateFocus() {
        const item = this.focusedItems.get(0);
        const pos = Math.max(this.searchIndex.pos(item),  0);
        this.paginatedDataSet.focusPos(pos);        
    }
    
    _extractFieldValues(path){
        const index = {};
        this._suggestionSet.forEach(function(r){
            let values = r.get(path);
            if (!values)
                return ;
            if (!Array.isArray(values)) {
                values = [values];
            }
            values.forEach(function(val) {
                let key = val; // val.toLowerCase();
                let obj = index[key] = index[key] || {
                    key,
                    values : [],
                    counter : 0
                };
                if (obj.values.indexOf(val) < 0) {
                    obj.values.push(val);
                    obj.values.sort();
                }
                obj.counter++;
            });
        });
        return Object.keys(index).sort().map(function(key) {
            return index[key];
        });
    }

    _runSearch(){
        return this.searchIndex.search(this.searchCriteria);
    }
}
