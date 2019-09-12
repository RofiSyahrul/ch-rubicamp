// adapted from https://alexatnet.com/model-view-controller-mvc-in-javascript/
export class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.on('showMenu', key => this.view.showMenu(key));
        this.view.on('showData', table => this.readData(table));
        this.view.on('getData', table=>this.searchData(table));
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
        this.view.rl.question(`Masukkan ${quest}: `, answer=>{
            this.model.searchData(table,answer);
        });
    }
}