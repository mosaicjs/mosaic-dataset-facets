import { DataSet } from 'mosaic-dataset';
import { DataSetIndex } from 'mosaic-dataset-index';

/**
 * Instances of this type are used as containers for enumerated values for
 * searching. This class exposes two utility methods used to search in the
 * enumeration. To define search indexes the constructor for this class should
 * contain the "indexFields" option or the DataType for this enumeration should
 * contain a static "indexFields" field. This parameter defines how enumerated
 * objects should be indexed.
 * 
 * <pre>
 * Example of the &quot;indexFields&quot; parameter defining 
 * the &quot;title&quot; and &quot;tags&quot; as fields used for search:
 * const indexFields = {
 *     &quot;title&quot; : {
 *         &quot;boost&quot; : 10,
 *         &quot;suggest&quot; : true
 *     },
 *     &quot;tags&quot; : {
 *         &quot;boost&quot; : 2
 *     }
 * };
 * </pre>
 */
export default class EnumeratedDataSet extends DataSet {
    
    constructor(...params){
        super(...params);
        const indexFields = 
            this.options.indexFields ||
            this.DataType.indexFields ||
            {};
        this.index = this.getAdapter(DataSetIndex, {
            fields: indexFields
        });
    }
    
    getSearchValues(criterion) {
        const key = criterion.key;
        return !!key ? [criterion.key] : [];
    }
    
    /** Returns an item corresponding to the specified value key. */
    getSearchCriterion(key, create) {
        const DataType = this.DataType;
        let id = key;
        if (typeof DataType.toId === 'function') {
            id = DataType.toId(key);
        } 
        let item = this.byId(id);
        if (!item && create) {
            item = this._wrap({
                id,
                key
            });
        }
        return item;
    }
    
    /**
     * Search a list of values from this enumerated data set using the specified
     * query.
     */
    search(query, maxNumber) {
        if (maxNumber === undefined){
            maxNumber = 1000;
        }
        const promise = this.index.search(query);
        return promise.then(function(dataSet){
            let promise;
            if (!!maxNumber && dataSet.length > maxNumber) {
                promise = dataSet.setItems(dataSet.items.splice(0, maxNumber));
            } else {
                promise = Promise.resolve();
            }
            return promise.then(function(){
                return dataSet;
            });
        });
    }
}