// adapted from https://alexatnet.com/model-view-controller-mvc-in-javascript/
import {EventEmitter} from './EventEmitter';
export class View extends EventEmitter {
    constructor(model,rl) {
        super();
        this.model = model;
        this.model.on('tableLoaded',table=>this.loadTable(table))
        .on('recordFound',table=>this.showRecord(table))
        .on('recordAdded',table=>this.addRecord(table))
        .on('recordDeleted', (table,id) => this.deleteRecord(table,id));
        this.rl = rl;
        // this.rl.on('line',answer=>{
        //     this.emit('showMenu',answer);
        // });
        this.decorator = '='.repeat(75);
        this.main = ['Mahasiswa','Jurusan','Dosen','Matakuliah','Kontrak','Keluar'];
        this.mainMenu = this.main.map((x,id)=>`[${id+1}] ${x}`);
        this.bread = ['Daftar','Cari','Tambah','Hapus','Kembali'];
        // create 'breadMenu' object that has properties/keys Mahasiswa, Jurusan, ..., Kontrak
        this.breadMenu = this.main.slice(0,this.main.length-1).reduce((obj,key)=>{
            obj[key] = this.bread.map((x,id)=> id<(this.bread.length-1) ? `[${id+1}] ${x} ${key}`:`[${id+1}] ${x}` );
            return obj;
        },{});
    }

    showMenu(key){
        const menu = Object.keys(this.breadMenu);
        if (parseInt(key).toString()!=='NaN') {
            // convert 'key' from number to Mahasiswa, Jurusan, ..., Kontrak
            key = parseInt(key);
            if (key>this.main.length || key<=0){
                console.log(`Nomor ${key} tidak ada pada opsi.`);
                this.rl.prompt();
            }else{
                key = this.main[key-1];
            }
        }
        if (parseInt(key).toString()==='NaN'){
            // key is not number
            if (''+key!=='undefined' && !this.main.includes(key)){
                console.log(`Tidak ada menu ${key}.`);
                this.rl.prompt();
            }else if (key==='Keluar'){
                console.log(this.decorator);
                console.log('Kamu telah keluar.');
                this.model.db.close();
                process.exit();
            }else{
                console.log(this.decorator);
                console.log('Silakan pilih opsi di bawah ini');
                console.log(menu.includes(key) ? this.breadMenu[key].join('\n') : this.mainMenu.join('\n'));
                console.log(this.decorator);
                if (key){
                    // BREAD menu for Mahasiswa, Jurusan, etc
                    this.rl.question('Masukkan salah satu nomor dari opsi di atas: ',answer=>{
                        answer = parseInt(answer);
                        switch(answer){
                            case 1: this.emit('showData',key); break;
                            case 2: 
                                console.log(this.decorator); this.emit('getData', key); 
                                break;
                            case 3:
                                console.log(this.decorator);
                                console.log('Lengkapi data di bawah ini:');
                                this.emit('addData', key);
                                break;
                            case 4:
                                console.log(this.decorator);
                                this.emit('deleteData', key);
                                break;
                            case 5: this.emit('showMenu'); break; // back to main menu
                            default: console.log('Masukan salah.'); this.emit('showMenu',key);
                        }
                    });
                }else{
                    // main menu
                    this.rl.question('Masukkan salah satu nomor dari opsi di atas: ',answer=>this.showMenu(answer));
                }
            }
        }
    }

    loadTable(table=''){
        this.model.promise.then((tbl)=>{
            console.log(this.decorator);
            console.log(tbl);
            this.emit('showMenu',table);
        });
    }

    showRecord(table=''){
        this.model.promise.then((str)=>{
            console.log(str);
            if (str.match('tidak ditemukan')){
                console.log(this.decorator);
                this.emit('getData', table);
            }else{
                this.emit('showMenu',table);
            }
        });
    }

    addRecord(table=''){
        this.model.promise.then((obj)=>{
            if (obj.toString()==='[object Database]'){
                // Record was added to 'table' in database and 'obj' is a database object.
                // So, it's time to update 'db' property of model with 'obj'
                this.model.db = obj;
                // and then show new table
                this.emit('showData',table);
            }else{
                // Record doesn't meet the conditions.
                // So, 'obj' is a string object, instead of a database object.
                console.log(obj);
                // Consequently, this app asks again to the user to input added record.
                console.log('Lengkapi data di bawah ini:');
                this.emit('addData',table);
            }
        });
    }

    deleteRecord(table='', id=''){
        this.model.promise.then(obj => {
            if (obj.toString()==='[object Database]'){
                // Record was deleted from 'table' in database and 'obj' is a database object.
                // So, it's time to update 'db' property of model with 'obj'
                this.model.db = obj;
                const idKey = ((tbl)=>{
                    switch(tbl){
                        case 'Mahasiswa': return 'NIM';
                        case 'Jurusan': return 'Kode';
                        default: return 'ID';
                    }
                })(table);
                console.log(`${table} dengan ${idKey} ${id} telah dihapus.`)
                // and then show new table
                this.emit('showData',table);
            }else{
                // Record doesn't meet the conditions.
                // So, 'obj' is a string object, instead of a database object.
                console.log(obj);
                // Consequently, this app asks again to the user to input deleted record.
                console.log(this.decorator);
                this.emit('deleteData', table);
            }
        })
    }
}