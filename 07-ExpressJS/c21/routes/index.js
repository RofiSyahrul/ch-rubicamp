const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const moment = require('moment');

// new method for string object to convert string to number or string with double quotes
String.prototype.convert = function() {
  if (this=='undefined' || this=='') return `''`
  if (Number(this).toString() !== "NaN") return Number(this);
  return `'${this}'`;
};

function getConditional(content = {}, checked = []) {
  if (checked == undefined) return "";
  if (checked.length === 0) return "";
  const columns = ["ID", "Integer", "Float", "Boolean"];
  const colPg = ["id", "intgr", "flt", "bl"];
  let arrConditional = columns.map((col, i) => {
    return checked.includes(col) && content[col].trim().length > 0
      ? `${colPg[i]} = ${content[col].convert()}`
      : "";
  });
  // string and date conditional
  let date = "", str = "";
  if (checked.includes("String") && content.String.length > 0) {
    str += `str LIKE '%${content.String}%'`;
  }
  if (
    checked.includes("Date") &&
    content.startDate.length > 0 &&
    content.endDate.length > 0
  ) {
    date += `dt BETWEEN ${content.startDate.convert()} AND ${content.endDate.convert()}`;
  } else if (checked.includes("Date") && content.startDate.length > 0) {
    date += `dt >= ${content.startDate.convert()}`;
  } else if (checked.includes("Date") && content.endDate.length > 0) {
    date += `dt <= ${content.endDate.convert()}`;
  }
  arrConditional.splice(0, 0, str, date);
  // delete the empty string from arrConditional
  arrConditional = arrConditional.filter(value => value.length > 0);
  if (arrConditional.length == 0) return "";
  return `WHERE ${arrConditional.join(" AND ")}`;
}

function countPages(pool, conditional = "", limit = 3) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT COUNT(*) AS nums FROM types ${conditional};`;
    pool.query(sql, (err, res) => {
      if (err) reject(err);
      else{resolve(Math.ceil(res.rows ? res.rows[0].nums/limit : 0));}
    });
  });
}

function parseDate(date) {
  if (date.length === 0 || date=='Infinity') return "kosong";
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  date = new Date(date);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "crud",
  password: "12345",
  port: 5432
});

const title = "BREAD - PostgreSQL by: Rofi";
const colNames = ["ID", "String", "Integer", "Float", "Date", "Boolean"];
const colPg = ["id", "str", "intgr", "flt", "dt", "bl"];
const funcs = [parseInt, str => str, parseInt, parseFloat, parseDate, bl => bl];
const limit = 2;

/* GET home page. */
router.get("/", (req, res) => {
  const query = req.query;
  const checked = query.checkBox;
  const conditional = getConditional(query, checked);
  const current = query.page ? parseInt(query.page) : 1; // if query.page undefined, the current page is 1
  const pageNumbers = countPages(pool, conditional, limit);
  pageNumbers.then(numOfPages => {
    const offset = current>1 ? `OFFSET ${(current-1)*limit}` : '';
    const sql = `SELECT * FROM types ${conditional} ORDER BY id LIMIT ${limit} ${offset}`;
    pool.query(sql, (e,result) => {
      if (e) res.render('error',{message:'ERROR', error: e});
      else{
        const renderedVar = {
          title, colNames, colPg, query, checked, numOfPages, current, funcs,
          url: req.url,
          data: result.rows,
          forms: colNames.slice(0,colNames.length-2),
          formTypes: ['number', 'text', 'number', 'number']
        }
        res.render('index', renderedVar);
      }
    });
  }).catch(e => res.render('error',{message:'ERROR', error: e}));
});

// get page of localhost:3000/add
router.get('/add', (req,res) => {
  let renderedVar = {
      colPg, title,
      forms: colNames.slice(1,colNames.length-2), // String, Integer, Float
      formTypes: ['text','number','number']
  };
  res.render('add', renderedVar);
});

/* post form from localhost:3000/add, insert the added data to types table in database,
and redirect to last table page in homepage */
router.post('/add', (req,res) => {
  const addedData = colPg.slice(1,colPg.length).map(col => req.body[col]);
  const values = addedData.map((val,i) => {
    if(colPg[i+1]=='dt' && (''+val).convert()=="''") return `'infinity'`;
    return (''+val).convert();
  }).join(', ');
  // insert the record to types table
  const sql = `INSERT INTO types (${colPg.slice(1,colPg.length).join(', ')}) VALUES (${values});`;
  pool.query(sql, (e,r) => {
    if(e) res.render('error',{message:'ERROR', error: e});
    else{
      const pageNumbers = countPages(pool,'',limit);
      pageNumbers.then(lastPage => {
        res.redirect(`/?page=${lastPage}`);
      });
    }
  });
});

/* GET 'edit' page based on id */
router.get('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // select the record where ID=id and render it to /edit/:id page
  pool.query(`SELECT * FROM types WHERE id=${id};`, (e, result) => {
    if (e) res.render('error',{message:'ERROR', error: e});
    else{
      const renderedVar = {
        title, id, colPg,
        forms: colNames.slice(1,colNames.length-2),
        formTypes: ['text','number','number'],
        values: result.rows[0],
        dateVal: moment(result.rows[0].dt).format("Y-MM-DD").toString()
      };
      res.render('edit', renderedVar);
    }
  });
});

/* post the edited record from localhost:3000/edit/:id, update types table in database,
and redirect to the table page where the edited data is located */
router.post('/edit/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const editedData = colPg.slice(1,colPg.length).map(col => req.body[col]);
  const values = editedData.map((val,i) => {
    if(colPg[i+1]=='dt' && (''+val).convert()=="''") return `${colPg[i+1]} = 'infinity'`;
    return `${colPg[i+1]} = ${(''+val).convert()}`;
  }).join(', ');
  // update the edited record
  pool.query(`UPDATE types SET ${values} WHERE id=${id};`, (e, r) => {
    if(e) res.render('error',{message:'ERROR', error: e});
    else{
      const pageNumber = countPages(pool, `WHERE id<=${id}`, limit);
      pageNumber.then(num => {
        res.redirect(`/?page=${num}`);
      });
    }
  });
});

// delete a record where ID=id from types table in database 
// and redirect to the table page where the deleted data is located or to the last table page
router.get('/delete/:id', (req,res) => {
  const id = parseInt(req.params.id);
  pool.query(`DELETE FROM types WHERE id=${id}`, (e,r) => {
    // get page number of id
    if (e) res.render('error', {message:'ERROR', error: e});
    else{
      const pageNum = countPages(pool, `WHERE id<=${id}`, limit);
      const getLastPage = countPages(pool,'',limit);
      Promise.all([pageNum,getLastPage]).then(pages => {
        const num = pages[0], lastPage = pages[1];
        res.redirect(`/?page=${num<=lastPage ? num : lastPage}`)
      }).catch(e => res.render('error', {message:'ERROR', error: e}));
    }
  });
});

module.exports = router;
