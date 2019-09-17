const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

function parseDate(date){
    if (date.length===0) return 'kosong';
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    date = new Date(date);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function parseBool(strBoolean){return strBoolean=='true'}

const app = express();
const port = 3000;

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let data = JSON.parse(fs.readFileSync('data.json','utf8'));
let keys = Object.keys(data[0]) ? Object.keys(data[0]) : ['String', 'Integer', 'Float', 'Date', 'Boolean'];

// get the homepage of localhost:3000
app.get('/', (req,res) => {
    let query = req.query;
    let checked = query.checkBox;
    let renderedVar = {
        data,
        keys,
        funcs: [str=>str, parseInt, parseFloat, parseDate, parseBool],
        colNames: ['ID',...keys,'Actions'],
        forms: ['ID',...keys.slice(0,keys.length-2)],
        formTypes: ['number','text','number','number'],
        query,
        checked
    };
    res.render('index', renderedVar);
});

// get page of localhost:3000/add
app.get('/add', (req,res) => {
    let renderedVar = {
        id: data.length+1,
        forms: keys.slice(0,keys.length-2), // String, Integer, Float
        formTypes: ['text','number','number']
    };
    res.render('add', renderedVar);
});

// post form from localhost:3000/add, push it to 'data.json', and redirect to homepage
app.post('/add', (req,res) => {
    data.push(keys.reduce((obj,key) => {
        obj[key] = req.body[key];
        return obj;
    }, {}));
    fs.writeFileSync('data.json', JSON.stringify(data), 'utf8');
    res.redirect('/');
});

// get page of localhost:3000/edit/0 or localhost:3000/edit/1 or etc
// to edit a record of data.json
app.get('/edit/:id', (req,res) => {
    const id = parseInt(req.params.id);
    let renderedVar = {
        id,
        forms: keys.slice(0,keys.length-2),
        formTypes: ['text','number','number'],
        values: data[id]
    };
    res.render('edit', renderedVar);
});

// post the edited data from localhost:3000/edit/:id, edit it in 'data.json', and redirect to homepage
app.post('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    data[id] = keys.reduce((obj,key) => {
        obj[key] = req.body[key];
        return obj;
    }, {});
    fs.writeFileSync('data.json', JSON.stringify(data), 'utf8');
    res.redirect('/');
});

// delete a record on 'id-th' index from data.json and redirect to homepage
app.get('/delete/:id', (req,res) => {
    const id = parseInt(req.params.id);
    data.splice(id,1);
    fs.writeFileSync('data.json', JSON.stringify(data), 'utf8');
    res.redirect('/');
})

app.listen(port, () => console.log(`Listen to port ${port}`));