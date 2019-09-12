import {Model} from './Model';
import {View} from './View';
import {Controller} from './Controller';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('university.db');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Masukkan salah satu nomor dari opsi di atas: '
});

const model = new Model(db);
const view = new View(model,rl);
const controller = new Controller(model,view);
view.showMenu();
// view.show();