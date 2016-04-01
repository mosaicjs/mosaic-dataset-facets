import { TypeKey } from 'mosaic-adapters';
import { Data } from 'mosaic-dataset';

const TypeKeyCache = {};
export default class Resource extends Data {
    static getTypeKey(){
        if (!this._typeKey){
            this._typeKey = TypeKey.for(this.name); 
        }
// console.log('TYPE KEY', this._typeKey);
        return this._typeKey;
    }
    getTypeKey(){
        if (!this._typeKey){
            let type;
            const data = this.data;
            if (data && data.properties) {
                const props = data.properties;   
                type = props.type || props.category || null;
            }
            if (type) {
                this._typeKey = TypeKeyCache[type];
            }
            if (!this._typeKey){
                const rootTypeKey = this.constructor.getTypeKey(); 
                if (type) {
                    const list = [].concat(rootTypeKey.segments);
                    list.push(type);
                    let str = list.join('/');
                    this._typeKey = TypeKeyCache[type] = TypeKey.for(str);
                } else {
                    this._typeKey = rootTypeKey;
                }
            }
        }
        return this._typeKey;
    }
    get id(){
        let id = this._id;
        if (id) {
            return id;
        }
        const data = this.data;
        id = data.id;
        if (id === undefined){
            id = (data.properties || {}).id;
            if (id === undefined){
                id = Resource.idCounter = (Resource.idCounter || 0) + 1; 
            }
        }
        this._id = '' + id;
        return id;
    }    
}