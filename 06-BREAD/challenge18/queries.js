// create 'Query' class that contains methods based on main menu.
// every method runs sql query based on an action 
// and assigns resulted string to resolve function of Promise if necessary.
const Table = require('cli-table');
const decorator = entity => '='.repeat(75)+'\n'+entity+' details\n'+'='.repeat(75)+'\n';
export class Query {
    constructor(database){
        this.db = database;
    }
    
    mahasiswa(resolve,action='read',...args){
        switch(action){
            case 'read':
                this.db.all('SELECT * FROM mahasiswa ORDER BY nim;',(err,rows)=>{
                    if (err) throw err;
                    // instantiate table
                    let table = new Table({
                        head: ['NIM', 'Nama', 'Alamat', 'Jurusan']
                    });
                    // add table content based on result of query
                    table.push.apply(table,rows.map(row=>[row.nim,row.nama,row.alamat,row.id_jurusan]));
                    resolve(table.toString());
                });
                break;
            case 'search':
                this.db.all('SELECT * FROM mahasiswa WHERE nim=?',args[0],(err,rows)=>{
                    if (err) throw err;
                    if (rows.length==0){
                        resolve(`Mahasiswa dengan NIM ${args[0]} tidak ditemukan.`);
                    }else{
                        const arrStr = ['NIM','Nama','Alamat','Jurusan'];
                        const str = decorator('student') + Query.generateInfo(arrStr, rows);
                        resolve(str);
                    }
                });
                break;
            case 'add':
                break;
            case 'del':
                break;
        }
    }
    
    jurusan(resolve,action='read',...args){
        switch(action){
            case 'read':
                this.db.all('SELECT * FROM jurusan ORDER BY id_jurusan;',(err,rows)=>{
                    if (err) throw err;
                    // instantiate table
                    let table = new Table({
                        head: ['Kode','Jurusan']
                    });
                    // add table content based on result of query
                    table.push.apply(table,rows.map(row=>[row.id_jurusan,row.nama_jurusan]));
                    resolve(table.toString());
                });
                break;
            case 'search':
                this.db.all('SELECT * FROM jurusan WHERE id_jurusan=?',args[0],(err,rows)=>{
                    if (err) throw err;
                    if (rows.length==0){
                        resolve(`Jurusan dengan kode ${args[0]} tidak ditemukan.`);
                    }else{
                        const arrStr = ['Kode jurusan','Nama jurusan'];
                        const str = decorator('department') + Query.generateInfo(arrStr, rows);
                        resolve(str);
                    }
                });
                break;
            case 'add':
                break;
            case 'del':
                break;
        }
    }

    dosen(resolve,action='read',...args){
        switch(action){
            case 'read':
                this.db.all('SELECT * FROM dosen ORDER BY id_dosen;',(err,rows)=>{
                    if (err) throw err;
                    // instantiate table
                    let table = new Table({
                        head: ['ID', 'Nama']
                    });
                    // add table content based on result of query
                    table.push.apply(table,rows.map(row=>[row.id_dosen,row.nama]));
                    resolve(table.toString());
                });
                break;
            case 'search':
                this.db.all('SELECT * FROM dosen WHERE id_dosen=?',args[0],(err,rows)=>{
                    if (err) throw err;
                    if (rows.length==0){
                        resolve(`Dosen dengan ID ${args[0]} tidak ditemukan.`);
                    }else{
                        const arrStr = ['ID','Nama'];
                        const str = decorator('lecturer') + Query.generateInfo(arrStr, rows);
                        resolve(str);
                    }
                });
                break;
            case 'add':
                break;
            case 'del':
                break;
        }
    }
    
    matakuliah(resolve,action='read',...args){
        switch(action){
            case 'read':
                this.db.all('SELECT * FROM matakuliah ORDER BY id_matakuliah;',(err,rows)=>{
                    if (err) throw err;
                    // instantiate table
                    let table = new Table({
                        head: ['ID', 'Matakuliah', 'SKS']
                    });
                    // add table content based on result of query
                    table.push.apply(table,rows.map(row=>[row.id_matakuliah,row.nama,row.sks]));
                    resolve(table.toString());
                });
                break;
            case 'search':
                this.db.all('SELECT * FROM matakuliah WHERE id_matakuliah=?',args[0],(err,rows)=>{
                    if (err) throw err;
                    if (rows.length==0){
                        resolve(`Matakuliah dengan ID ${args[0]} tidak ditemukan.`);
                    }else{
                        const arrStr = ['ID', 'Matakuliah', 'SKS'];
                        const str = decorator('subject') + Query.generateInfo(arrStr, rows);
                        resolve(str);
                    }
                });
                break;
            case 'add':
                break;
            case 'del':
                break;
        }
    }
    
    kontrak(resolve,action='read',...args){
        switch(action){
            case 'read':
                this.db.all('SELECT * FROM kontrak ORDER BY id_kontrak;',(err,rows)=>{
                    if (err) throw err;
                    // instantiate table
                    let table = new Table({
                        head: ['ID', 'NIM', 'ID Matakuliah', 'ID Dosen', 'Nilai']
                    });
                    // add table content based on result of query
                    table.push.apply(table,rows.map(row=>[row.id_kontrak,row.nim,row.id_matakuliah,row.id_dosen,row.nilai]));
                    resolve(table.toString());
                });
                break;
            case 'search':
                this.db.all('SELECT * FROM kontrak WHERE id_kontrak=?',args[0],(err,rows)=>{
                    if (err) throw err;
                    if (rows.length==0){
                        resolve(`Kontrak dengan ID ${args[0]} tidak ditemukan.`);
                    }else{
                        const arrStr = ['ID', 'NIM', 'ID Matakuliah', 'ID Dosen', 'Nilai'];
                        const str = decorator('contract') + Query.generateInfo(arrStr, rows);
                        resolve(str);
                    }
                });
                break;
            case 'add':
                break;
            case 'del':
                break;
        }
    }

    static generateInfo(arrStr,rows){
        const strLen = arrStr.map(x=>x.length);
        const max = strLen.reduce((a,b)=>Math.max(a,b));
        const arrInfo = Object.keys(rows[0]).map(x=>rows[0][x]);
        const str = [...Array(arrInfo.length).keys()].map(x=>{
            return arrStr[x]+' '.repeat(max-strLen[x]+1)+': '+arrInfo[x];
        }).join('\n');
        return str;
    }
}