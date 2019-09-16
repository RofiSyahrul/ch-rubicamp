// create 'Query' class that contains methods based on main menu.
// every method runs sql query based on an action 
// and assigns resulted string to resolve function of Promise if necessary.
const Table = require('cli-table');
const decorator = entity => '='.repeat(75)+'\n'+entity+' details\n'+'='.repeat(75)+'\n';
export class Query {
    constructor(database){
        this.db = database;
    }
    
    account(resolve,reject,username='',password=''){
        const getUsernames = new Promise((res,rej) => this.getId(res,rej,'username','account'));
        const getPasswords = new Promise((res,rej) => this.getId(res,rej,'passwd','account', ['username',username]));
        const getRoles = new Promise((res,rej) => this.getId(res, rej, 'role', 'account', ['username',username]));
        Promise.all([getUsernames, getPasswords, getRoles]).then(existing => {
            const usernames = existing[0].map(x=>x.toLowerCase());
            const checkUsername = usernames.includes(username.toLowerCase());
            if (!checkUsername) reject(`username ${username} tidak terdaftar.`);
            else{
                const passwords = existing[1];
                const role = existing[2][0].toUpperCase();
                const checkPassword = passwords.includes(password);
                if (!checkPassword) reject('password salah!!');
                else {
                    const result = {username: username, role: role};
                    resolve(result);
                }
            }
        }).catch(reason => {reject(reason);});
    }

    mahasiswa(resolve,reject,action='read',...args){
        switch(action){
            case 'read':
                this.getTable(resolve,reject,'nim','mahasiswa',['NIM','Nama','Alamat','Jurusan']);
                break;
            case 'search':
                this.getRecord(resolve, reject, 'nim', args[0], 'mahasiswa', ['NIM','Nama','Alamat','Jurusan'], 'Student');
                break;
            case 'add':
                let info = args[0];
                const nim = info[0], dept = info[3];
                // create promise to get existing id_jurusan from 'jurusan' table
                const getIdJurusan = new Promise((res,rej)=>this.getId(res,rej,'id_jurusan','jurusan'));
                // create promise to get existing nim from 'mahasiswa' table
                const getNim = new Promise((res,rej)=>this.getId(res,rej,'nim','mahasiswa'));
                // call all promises and add 'info' to 'mahasiswa' table if it meets the conditions.
                Promise.all([getIdJurusan,getNim]).then((arrays)=>{
                    const deptIds = arrays[0], nims = arrays[1];
                    if (!deptIds.includes(dept)) reject(`Tidak ada jurusan dengan ID ${dept}.`);
                    else if (nims.includes(nim)) reject(`NIM ${nim} sudah ada.`);
                    else {
                        info = info.join(', ');
                        this.db.run(`INSERT INTO mahasiswa VALUES (${info});`);
                        resolve(this.db);
                    }
                }).catch(reason => {reject(reason);});
                break;
            case 'del':
                this.removeRecord(resolve, reject, 'nim', args[0], 'mahasiswa', 'NIM');
                break;
        }
    }
    
    jurusan(resolve,reject,action='read',...args){
        switch(action){
            case 'read':
                this.getTable(resolve,reject,'id_jurusan','jurusan',['Kode','Jurusan']);
                break;
            case 'search':
                this.getRecord(resolve, reject, 'id_jurusan', args[0], 'jurusan', ['Kode','Nama jurusan'], 'Department');
                break;
            case 'add':
                let info = args[0];
                const dept = info[0];
                // create promise to get existing id_jurusan from 'jurusan' table
                const getIdJurusan = new Promise((res,rej)=>this.getId(res,rej,'id_jurusan','jurusan'));
                // call promise and add 'info' to 'jurusan' table if it meets the condition.
                getIdJurusan.then((deptIds)=>{
                    if (deptIds.includes(dept)) reject(`Jurusan dengan kode ${dept} sudah ada.`);
                    else {
                        info = info.join(', ');
                        this.db.run(`INSERT INTO jurusan VALUES (${info});`);
                        resolve(this.db);
                    }
                }).catch(reason => {reject(reason);});
                break;
            case 'del':
                this.removeRecord(resolve, reject, 'id_jurusan', args[0], 'jurusan', 'kode');
                break;
        }
    }

    dosen(resolve,reject,action='read',...args){
        switch(action){
            case 'read':
                this.getTable(resolve,reject,'id_dosen','dosen',['ID','Nama']);
                break;
            case 'search':
                this.getRecord(resolve, reject, 'id_dosen', args[0], 'dosen', ['ID','Nama'],'Lecturer');
                break;
            case 'add':
                let info = args[0];
                const lecturer = info[0];
                // create promise to get existing id_dosen from 'dosen' table
                const getIdDosen = new Promise((res,rej)=>this.getId(res,rej,'id_dosen','dosen'));
                // call promise and add 'info' to 'dosen' table if it meets the condition.
                getIdDosen.then((lectIds)=>{
                    if (lectIds.includes(lecturer)) reject(`Dosen dengan ID ${lecturer} sudah ada.`);
                    else {
                        info = info.join(', ');
                        this.db.run(`INSERT INTO dosen VALUES (${info});`);
                        resolve(this.db);
                    }
                }).catch(reason => {reject(reason);});
                break;
            case 'del':
                this.removeRecord(resolve, reject, 'id_dosen', args[0], 'dosen', 'ID');
                break;
        }
    }
    
    matakuliah(resolve,reject,action='read',...args){
        switch(action){
            case 'read':
                this.getTable(resolve,reject,'id_matakuliah','matakuliah',['ID', 'Matakuliah', 'SKS']);
                break;
            case 'search':
                this.getRecord(resolve, reject, 'id_matakuliah', args[0], 'matakuliah', ['ID', 'Matakuliah', 'SKS'], 'Subject');
                break;
            case 'add':
                let info = args[0];
                const subject = info[0];
                // create promise to get existing id_matakuiah from 'matakuliah' table
                const getIdSubject = new Promise((res,rej)=>this.getId(res,rej,'id_matakuliah','matakuliah'));
                // call promise and add 'info' to 'matakuliah' table if it meets the condition.
                getIdSubject.then((idSubjects)=>{
                    if (idSubjects.includes(subject)) reject(`Matakuliah dengan ID ${subject} sudah ada.`);
                    else {
                        info = info.join(', ');
                        this.db.run(`INSERT INTO matakuliah VALUES (${info});`);
                        resolve(this.db);
                    }
                }).catch(reason => {reject(reason);});
                break;
            case 'del':
                this.removeRecord(resolve, reject, 'id_matakuliah', args[0], 'matakuliah', 'ID');
                break;
        }
    }
    
    kontrak(resolve,reject,action='read',...args){
        switch(action){
            case 'read':
                this.getTable(resolve,reject,'id_kontrak','kontrak',['ID', 'NIM', 'ID Matakuliah', 'ID Dosen', 'Nilai']);
                break;
            case 'search':
                this.getRecord(resolve, reject, 'id_kontrak', args[0], 'kontrak', ['ID', 'NIM', 'ID Matakuliah', 'ID Dosen', 'Nilai'], 'Contract');
                break;
            case 'add':
                let info = args[0];
                const contract = info[0], nim = info[1], subject = info[2], lecturer = info[3];
                // create promise to get existing id_kontrak from 'kontrak' table
                const getIdContract = new Promise((res,rej)=>this.getId(res,rej,'id_kontrak','kontrak'));
                // create promise to get existing nim from 'mahasiswa' table
                const getNim = new Promise((res,rej)=>this.getId(res,rej,'nim','mahasiswa'));
                // create promise to get existing id_dosen from 'dosen' table
                const getIdDosen = new Promise((res,rej)=>this.getId(res,rej,'id_dosen','dosen'));
                // create promise to get existing id_matakuiah from 'matakuliah' table
                const getIdSubject = new Promise((res,rej)=>this.getId(res,rej,'id_matakuliah','matakuliah'));
                // call all promises and add 'info' to 'kontrak' table if it meets the conditions.
                Promise.all([getIdContract,getNim,getIdDosen,getIdSubject]).then((arrays)=>{
                    const idContracts = arrays[0], nims = arrays[1], idDosen = arrays[2], idSubjects = arrays[3];
                    if (idContracts.includes(contract)) reject(`Kontrak dengan ID ${contract} sudah ada.`);
                    else if (!nims.includes(nim)) reject(`Tidak ada mahasiswa dengan NIM ${nim}.`);
                    else if (!idDosen.includes(lecturer)) reject(`Tidak ada dosen dengan ID ${lecturer}.`);
                    else if (!idSubjects.includes(subject)) reject(`Tidak ada matakuliah dengan ID ${subject}.`);
                    else {
                        info = info.join(', ');
                        this.db.run(`INSERT INTO kontrak VALUES (${info});`);
                        resolve(this.db);
                    }
                }).catch(reason => {reject(reason);});
                break;
            case 'del':
                this.removeRecord(resolve, reject, 'id_kontrak', args[0], 'kontrak', 'ID');
                break;
        }
    }

    getTable(resolve=()=>{}, reject=()=>{}, id='', table='', header=[]){
        this.db.all(`SELECT * FROM ${table} ORDER BY ${id};`,(err,rows)=>{
            if (err) reject(err);
            // instantiate table
            let table = new Table({
                head: header
            });
            // add table content based on result of query
            table.push.apply(table,rows.map(row=>Object.keys(row).map(key=>row[key])));
            resolve(table.toString());
        });
    }

    getRecord(resolve=()=>{}, reject=()=>{}, id='', value='', table='', header=[], context=''){
        this.db.all(`SELECT * FROM ${table} WHERE ${id}=?`,value,(err,rows)=>{
            if (err) reject(err);
            if (rows.length==0){
                const tbl = table.replace(table[0],table[0].toUpperCase());
                reject(`${tbl} dengan ${header[0]} ${value} tidak ditemukan.`);
            }else{
                const str = decorator(context) + Query.generateInfo(header, rows);
                resolve(str);
            }
        });
    }

    getId(res=()=>{},rej=()=>{},id='',table='',cond=[]){
        if (cond.length===2){
            this.db.all(`SELECT ${id} FROM ${table} WHERE LOWER(${cond[0]})=?`, cond[1].toLowerCase(), (e,rows)=>{
                if (e) rej(e);
                res(rows.map(x=>Object.keys(x).map(key=>x[key])[0]));
            });
        }else{
            this.db.all(`SELECT ${id} FROM ${table} ;`, (e,rows)=>{
                if (e) rej(e);
                const ids = rows.map(x=>Object.keys(x).map(key=>x[key])[0]);
                res(ids);
            });
        }
    }

    removeRecord(resolve = ()=>{}, reject = ()=>{}, id='', value='', table='', idHead=''){
        // create promise to get existing id from the table
        const getIds = new Promise((res,rej)=>this.getId(res,rej,id,table));
        getIds.then(ids => {
            value = parseInt(value);
            if (!ids.includes(value)) reject(`Tidak ada ${table} dengan ${idHead} ${value}.`);
            else{
                this.db.run(`DELETE FROM ${table} WHERE ${id}=?`,value, e => {
                    if (e) reject(e);
                });
                resolve(this.db);
            }
        });
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