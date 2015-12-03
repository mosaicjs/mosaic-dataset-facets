import { SearchCriteria } from 'mosaic-dataset-index';

export default class EntitySearchCriteria extends SearchCriteria {
    static get suggestionFields(){
        return {
            'values' : { boost : 1 }
        };
    }
    static toId(key) {
        return this.indexKey + ':' + JSON.stringify(key);
    }
    get indexKey(){ return this.constructor.indexKey; }
    get id(){ return this.constructor.toId(this.key); }
    get key(){ return this.get('key'); }
    get values(){
        let result = super.values;
        if (!result || !result.length) {
            const key = this.key;
            if (key) {
                result = Array.isArray(key) ? key : [key];
            }
        }
        return result;
    }
}