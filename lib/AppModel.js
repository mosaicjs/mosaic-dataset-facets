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
 * <li>"openItems" data set giving access to open/activated items. It
 * automatically updates position in the "paginatedDataSet" - it focus the page
 * with the first open item.</li>
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
            indexFields[indexKey] = DataType.indexFields;
            that.suggestionIndexes[indexKey] = that._newSuggestionIndex({
                DataType,
                indexFields: DataType.suggestionFields
            });
        });
        that.searchIndex = that.dataSet.newAdapter(SearchableDataSet, {
            indexFields
        });
        that.searchIndex.options.cluster = true;
        
        // Paginated data set for search results
        that.paginatedDataSet = that.searchIndex.getAdapter(DataSetPaginated);
        that.paginatedDataSet.pageSize = 20;

        // Open items
        that.openItems = that.dataSet.getAdapter(DataSetSelection);
        that.openItems.addListener('update', function(intent){
            intent.then(function(){
                const item = that.openItems.get(0);
                if (item) {
                    const pos = that.searchIndex.pos(item) || 0;
                    that.paginatedDataSet.focusPos(pos);
                }
            });
        });

        // Bind event listeners to this object
        that._onDataSetUpdate = that._onDataSetUpdate.bind(that);
        that._runSearch = that._runSearch.bind(that);
    }
    
    // ------------------------------------------------------------------------

    open(options){
        options = options || {};
        const that = this;
        return Promise.resolve().then(function(){
            that.dataSet.addListener('update', that._onDataSetUpdate);
            that.searchCriteria.addListener('update', that._runSearch);
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
            that.searchCriteria.removeListener('update', that._runSearch);
            that.dataSet.removeListener('update', that._onDataSetUpdate);
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
            promises.push(set.search(query, maxNumber));
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
    
    search(query) {
        return this.searchIndex.search(query);
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
            values = Array.isArray(values) ? values : [values];
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
    
    serializeOpenItems() {
        return this.openItems.items.map(function(item){
            return item.id;
        });
    }
    
    deserializeOpenItems(ids){
        if (!Array.isArray(ids)) {
            ids = !!ids ? [ids] : [];
        }
        const that = this;
        const items = [];
        ids.forEach(function(id){
            const item = that.dataSet.byId(id);
            if (item) {
                items.push(item);
            }
        });
        return this.openItems.setItems(items);
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

    _onDataSetUpdate(intent){
        const that = this;
        intent.then(function(){
            return Promise.resolve().then(function(){
                const promises = [];
                // Automatically extracts all fields marked with the "suggest"
                // flag
                Object.keys(that.suggestionIndexes).forEach(function(indexKey){
                    const set = that.suggestionIndexes[indexKey];
                    const indexFields = set.DataType.indexFields; 
                    Object.keys(indexFields).forEach(function(fieldName) {
                        const field = indexFields[fieldName]; 
                        if (!field.suggest) return ;
                        const values = that._extractFieldValues(fieldName);
                        promises.push(set.setItems(values));
                    });
                });
                promises.push(that.search(that.searchCriteria));
                return Promise.all(promises);
            });
        });
    }
    
    _extractFieldValues(path){
        const index = {};
        this.dataSet.forEach(function(r){
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
                    values : []
                };
                if (obj.values.indexOf(val) < 0) {
                    obj.values.push(val);
                    obj.values.sort();
                }
            });
        });
        return Object.keys(index).sort().map(function(key) {
            return index[key];
        });
    }

    _runSearch(intent){
        const that = this;
        const before = that.serializeSearchCriteria();
        return intent.then(function(){
            const after = that.serializeSearchCriteria();
            if (JSON.stringify(before) == JSON.stringify(after))
                return ;
            return that.search(that.searchCriteria);
        });
    }
    
}
