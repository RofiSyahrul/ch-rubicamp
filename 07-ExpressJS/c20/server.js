const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// new method for string object to convert string to number or string with double quotes
String.prototype.convert = function(){
    if (Number(this).toString()!=='NaN') return Number(this);
    return '"'+this+'"';
};

function getConditional(content={},checked=[]){
    if (checked==undefined) return ''
    if (checked.length===0) return ''
    const columns = ['ID','Integer','Float','Boolean'];
    let arrConditional = columns.map(col => {
        return checked ? (checked.includes(col) && content[col].trim().length>0 ? `${col} = ${content[col].convert()}` : '' ) : '';
    });
    // string and date conditional
    let date = '', str = '';
    if (checked){
        if (checked.includes('String') && content.String.length>0){
            str+=`String LIKE ${('%'+content.String+'%').convert()}`;
        }
        if (checked.includes('Date') && content.startDate.length>0 && content.endDate.length>0){
            date += `_Date BETWEEN ${content.startDate.convert()} AND ${content.endDate.convert()}`;
        } else if (checked.includes('Date') && content.startDate.length>0){
            date += `_Date >= ${content.startDate.convert()}`;
        } else if (checked.includes('Date') && content.endDate.length>0){
            date += `_Date <= ${content.endDate.convert()}`
        }
    }
    arrConditional.splice(0,0,str,date);
    // delete the empty string from arrConditional
    arrConditional = arrConditional.filter(value => value.length>0);
    if (arrConditional.length==0) return '';
    return `WHERE ${arrConditional.join(' AND ')}`;
}

function getNumOfPages(database,conditional=''){
    return new Promise((resolve, reject) => {
        const sql = `SELECT COUNT(*) AS nums FROM data_type ${conditional}`;
        database.all(sql, (err,rows) => {
            if(err) reject(err);
            resolve(Math.ceil(rows[0].nums/3));
        });
    });
}

function parseDate(date){
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    date = new Date(date);
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let db = new sqlite3.Database('data.db');
const colNames = ['ID','String','Integer','Float','Date','Boolean'];

app.get('/', (req,res) => {
    const query = req.query;
    const checked = query.checkBox;
    const conditional = getConditional(query,checked);
    const current = query.page ? parseInt(query.page) : 1; // if query.page undefined, the current page is 1
    db.serialize(() => {
        const pageNumbers = getNumOfPages(db,conditional);
        pageNumbers.then(numOfPages => {
            const offset = current===1 ? '' : `OFFSET ${(current-1)*3}`;
            const sql = `SELECT ${colNames.join(', ')} FROM data_type ${conditional} LIMIT 3 ${offset}`;
            db.all(sql, (e, rows) => {
                if (e) throw e;
                const renderedVar = {
                    data: rows, colNames, query, checked, current, numOfPages,
                    forms: colNames.slice(0,colNames.length-2),
                    formTypes: ['number', 'text', 'number', 'number'],
                    url: req.url
                };
                res.render('index', renderedVar);
            });
        });
    });
});

// get page of localhost:3000/add
app.get('/add', (req,res) => {
    let renderedVar = {
        forms: colNames.slice(1,colNames.length-2), // String, Integer, Float
        formTypes: ['text','number','number']
    };
    res.render('add', renderedVar);
});

// post form from localhost:3000/add, insert the added data to data_type table in database,
// and redirect to last table page in homepage
app.post('/add', (req,res) => {
    const date = parseDate(req.body._Date); // parse date to <dd> <monthName> <yyyy>
    const addedData = [req.body.String, req.body.Integer, req.body.Float, date, req.body._Date, req.body.Boolean];
    // insert addedData to database
    db.serialize(() => {
        const sql = `INSERT INTO data_type (String, Integer,Float,Date,_Date,Boolean) VALUES (${addedData.map(value => value.toString().convert()).join(', ')});`;
        db.run(sql);
        const pageNumbers = getNumOfPages(db);
        pageNumbers.then(lastPage => {
            res.redirect(`/?page=${lastPage}`);
        });
    });
});

// get page of localhost:3000/edit/1 or localhost:3000/edit/2 or etc
// to edit a record where ID=id from data_type table in database
app.get('/edit/:id', (req,res) => {
    const id = parseInt(req.params.id);
    // select the record where ID=id and render it to /edit/:id page
    db.serialize(() => {
        const sql = 'SELECT * FROM data_type WHERE ID=?;';
        db.all(sql, id, (e,rows) => {
            if(e) throw e;
            const renderedVar = {
                id,
                forms: colNames.slice(1,colNames.length-2),
                formTypes: ['text','number','number'],
                values: rows[0]
            };
            res.render('edit', renderedVar);
        });
    });
});

// post the edited record from localhost:3000/edit/:id, update data_type table in database,
// and redirect to the table page where the edited data is located
app.post('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const date = parseDate(req.body._Date); // parse date to <dd> <monthName> <yyyy>
    const columns = ['String', 'Integer', 'Float', 'Date', '_Date', 'Boolean'];
    const editedData = [req.body.String, req.body.Integer, req.body.Float, date, req.body._Date, req.body.Boolean];
    db.serialize(() => {
        const values = editedData.map((val,index) => `${columns[index]} = ${val.toString().convert()}`).join(', ');
        const sql = `UPDATE data_type SET ${values} WHERE ID=?;`;
        db.run(sql, id);
        // get pageNumber of id
        const pageNumber = getNumOfPages(db,`WHERE ID<=${id}`);
        pageNumber.then(num => {
            res.redirect(`/?page=${num}`)
        });
    });
});

// delete a record where ID=id from data_type table in database 
// and redirect to the table page where the deleted data is located or to the last table page
app.get('/delete/:id', (req,res) => {
    const id = parseInt(req.params.id);
    db.serialize(() => {
        db.run('DELETE FROM data_type WHERE ID=?;', id);
        // get page number of id
        const pageNum = getNumOfPages(db,`WHERE ID<=${id}`);
        const pageNumbers = getNumOfPages(db);
        Promise.all([pageNum,pageNumbers]).then((num,lastPage) => {
            res.redirect(`/?page=${num<=lastPage ? num : lastPage}`);
        });
    });
})

app.listen(port, () => console.log(`Listen to port ${port}`));