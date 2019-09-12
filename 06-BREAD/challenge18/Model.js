// adapted from https://alexatnet.com/model-view-controller-mvc-in-javascript/
import {EventEmitter} from './EventEmitter';
import {Query} from './queries';
export class Model extends EventEmitter {
    constructor(database) {
        super();
        this.db = database;
        this.query = new Query(this.db);
    }

    readData(table=''){
        this.promise = new Promise((resolve,reject)=>{
            this.db.serialize(()=>{
                this.query[table.toLowerCase()](resolve);
            })
        });
        this.emit('tableLoaded',table);
    }

    searchData(table='',id=''){
        this.promise = new Promise((resolve,reject)=>{
            this.db.serialize(()=>{
                this.query[table.toLowerCase()](resolve,'search',id);
            })
        })
        this.emit('recordFound',table);
    }
}