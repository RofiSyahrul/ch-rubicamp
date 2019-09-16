String.prototype.isNumber = function(){
    return Number(this).toString()!=='NaN';
};
String.prototype.convert = function(){
    if (this.isNumber()) return Number(this);
    return '"'+this+'"';
};
// adapted from https://alexatnet.com/model-view-controller-mvc-in-javascript/
export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.on('validate', (username,password) => this.validateAccount(username,password))
        .on('showMenu', table => this.view.showMenu(table))
        .on('showData', table => this.readData(table))
        .on('getData', table => this.searchData(table))
        .on('addData', table => this.addRecord(table))
        .on('deleteData', table => this.deleteRecord(table));
        this.rl = this.view.rl;
        this.rl.on('line',answer=>this.readLine(answer));
    }

    validateAccount (username='',password=''){
        this.model.validateAccount(username,password);
    }
    
    readData(table=''){
        this.model.readData(table);
    }

    searchData(table=''){
        const quest = ((tbl) => {
            switch(tbl){
                case 'Mahasiswa': return 'NIM';
                case 'Jurusan': return 'Kode jurusan';
                case 'Dosen': return 'ID dosen';
                case 'Matakuliah': return 'ID matakuliah';
                case 'Kontrak': return 'ID kontrak';
            }
        })(table);
        this.rl.question(`Masukkan ${quest}: `, answer=>{
            this.model.searchData(table,answer);
        });
    }

    readLine(line){
        this.answers.push(line);
        if (this.answers.length===1 && !line.isNumber()){
            // added record has non integer primary key
            console.log('Mohon masukkan angka.');
            this.answers.pop();
        }
        if (this.answers.length>=this.questions.length) {
            // stop inputting the entries
            // go to model
            this.answers = this.answers.map(x=>x.convert()); // convert each element of answers such that they can be assigned to sql statement
            this.model.addRecord(this.table,this.answers);
        }else{
            // input next entry
            this.rl.setPrompt(`${this.questions[this.answers.length]}: `);
            this.rl.prompt();
        }
    }
    
    addRecord(table=''){
        this.questions = (tbl=>{
            switch(tbl){
                case 'Mahasiswa': return ['NIM', 'Nama', 'Alamat', 'Jurusan'];
                case 'Jurusan': return ['Kode jurusan','Jurusan'];
                case 'Dosen': return ['ID dosen', 'Nama'];
                case 'Matakuliah': return ['ID matakuliah', 'Matakuliah', 'SKS'];
                case 'Kontrak': return ['ID', 'NIM', 'ID Matakuliah', 'ID Dosen', 'Nilai'];
            }
        })(table);
        this.table = table;
        this.answers = [];
        // input first entry of a record to be added
        this.rl.setPrompt(`${this.questions[this.answers.length]}: `);
        this.rl.prompt();
    }

    deleteRecord(table=''){
        const quest = (tbl=>{
            switch(tbl){
                case 'Mahasiswa': return 'NIM mahasiswa';
                case 'Jurusan': return 'Kode jurusan';
                case 'Dosen': return 'ID dosen';
                case 'Matakuliah': return 'ID matakuliah';
                case 'Kontrak': return 'ID kontrak';
            }
        })(table);
        this.rl.question(`Masukkan ${quest} yang akan dihapus: `, answer => {
            this.model.deleteRecord(table,answer);
        });
    }
}