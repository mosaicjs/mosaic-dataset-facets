import EntitySearchCriteria from './EntitySearchCriteria';

export default class TextSearchCriteria extends EntitySearchCriteria {
    
    static get indexKey(){ return 'q'; }
    static get indexFields(){
        return {
            "id" : {
                "boost" : 15
            },
            "title" : {
                "boost" : 10,
                "suggest" : true // Use names to suggest values
            },
            "tags" : {
                "boost" : 2
            }
        }
    }
    search(query) {
        return super.search(query, maxNumber).then(function(set){
            const items = set.items;
            if (query && query.length) {
                let key = (query ? '' + query : '');
                items.unshift({
                    key,
                    values : [ query ]
                });
            }
            return set.setItems(items);
        });
    }
}