const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

// new method for string object to convert string to number or string with double quotes
String.prototype.convert = function() {
  if (this=='undefined' || this=='') return ''
  if (Number(this).toString() !== "NaN") return Number(this);
  return this=='true' ? true : this=='false' ? false : this.toString();
};

function getConditional(content = {}, checked = []) {
  if (checked == undefined) return {};
  if (checked.length === 0) return {};
  
  const fields = ["Integer", "Float", "Boolean"];
  let result = fields.reduce((obj, field) => {
    if (checked.includes(field) && content[field].trim().length>0){
      obj[field] = content[field].convert();
    }
    return obj;
  }, {});

  // string and date conditional
  if (checked.includes("String") && content.String.length > 0) {
    result.String = {$regex:content.String,$options:"$i"};
  }
  if (
    checked.includes("Date") && 
    content.startDate.length > 0 && 
    content.endDate.length > 0
  ) {
    result.Date = {$gte: content.startDate, $lte: content.endDate};
  } else if ( checked.includes("Date") && content.startDate.length>0){
    result.Date = {$gte: content.startDate};
  } else if (checked.includes('Date') && content.endDate.length>0) {
    result.Date = {$lte: content.endDate};
  }
  
  return result
}

function countPages(collection, conditional = {}, limit = 3) {
  return new Promise((resolve, reject) => {
    collection.countDocuments(conditional).then(count => {
      resolve(Math.ceil(count/limit));
    }).catch(e => {reject(e)});
  });
}

function getNum(collection, conditional={}){
  return new Promise((resolve,reject) => {
    collection.find(conditional,{projection: {'Number': 1}}).sort('Number',-1)
    .limit(1).toArray().then(result => {
      resolve(result[0].Number)}).catch(e=>reject(e));
  });
}

function parseDate(date) {
  if (date.length === 0) return "kosong";
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  date = new Date(date);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

module.exports = (db, limit=2) => {
  const title = 'BREAD - MongoDB by: Rofi';
  const collection = db.collection('types');
  const fields = ['String', 'Integer', 'Float', 'Date', 'Boolean'];
  const funcs = [str => str, parseInt, parseFloat, parseDate, bl => bl.toString()]
  
  /* GET home page. */
  router.get('/', (req, res) => {
    const query = req.query;
    const checked = query.checkBox;
    const conditional = getConditional(query, checked);
    const current = parseInt(query.page || 1); //if query.page undefined, the current page is 1
    const options = {limit, skip: (current-1)*limit};

    const pageNumbers = countPages(collection, conditional, limit);
    const docsDisplayed = collection.find(conditional,options).sort('Number',1).toArray();
    Promise.all([pageNumbers,docsDisplayed]).then(results => {
      const renderedVar = {
        title, fields, query, checked, current, funcs,
        numOfPages: results[0],
        url: req.url,
        data: results[1],
        forms: fields.slice(0,fields.length-2),
        formTypes: ['text', 'number', 'number']
      }
      res.render('index', renderedVar);
    }).catch(e => {res.render('error',{message:'ERROR', error: e})});
  });

  // get page of localhost:3000/add
  router.get('/add', (req,res) => {
    let renderedVar = {
        title,
        forms: fields.slice(0,fields.length-2), // String, Integer, Float
        formTypes: ['text','number','number']
    };
    res.render('add', renderedVar);
  });

  /* post form from localhost:3000/add, 
  insert the added document to types collection in database,
  and redirect to last table page in homepage */
  router.post('/add', (req,res) => {
    let addedData = fields.reduce((obj,field) => {
      obj[field] = (''+req.body[field]).convert();
      return obj;
    }, {});

    // insert the document to collection of types
    getNum(collection).then(maxNum => {
      addedData.Number = maxNum+1;
      collection.insertOne(addedData).then(r => {
        countPages(collection,{},limit).then(lastPage => {
          res.redirect(`/?page=${lastPage}`);
        }).catch(e => {res.render('error',{message:'ERROR', error: e})});
      }).catch(e => {res.render('error',{message:'ERROR', error: e})});
    }).catch(e => {res.render('error',{message:'ERROR', error: e})});
  });

  /* GET 'edit' page based on id */
  router.get('/edit/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    // select a document where _id=id and render it to /edit/:id page
    collection.find({_id: id}).toArray().then(results => {
      const renderedVar = {
        title,
        id: req.params.id, 
        forms: fields.slice(0,fields.length-2),
        formTypes: ['text','number','number'],
        values: results[0]
      }
      res.render('edit',renderedVar);
    }).catch(e => {res.render('error',{message:'ERROR', error: e})});
  });

  /* post the edited document from localhost:3000/edit/:id, 
  update types collection in database,
  and redirect to the table page where the edited document is located */
  router.post('/edit/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    const editedData = fields.reduce((obj,field) => {
      obj[field] = (''+req.body[field]).convert();
      return obj;
    }, {});
    console.log(`id: ${id}`);
    console.log('editedData');
    console.log(editedData);
    // update the edited document
    collection.updateOne({_id: id}, {$set: editedData}).then(r => {
      getNum(collection, {_id: id}).then(num => {
        countPages(collection, {Number: {$lte: num}}, limit).then(pageNum => {
          res.redirect(`/?page=${pageNum}`);
        }).catch(e => {res.render('error',{message:'ERROR', error: e})});
      }).catch(e => {res.render('error',{message:'ERROR', error: e})});
    }).catch(e => {res.render('error',{message:'ERROR', error: e})});
  });

  // delete a document where _id=id from types collection in database 
  // and redirect to the table page where the deleted data is located or to the last table page
  router.get('/delete/:id', (req,res) => {
    const id = ObjectId(req.params.id);
    getNum(collection, {_id: ObjectId(id)}).then(num => {
      const pageNum = countPages(collection, {Number: {$lte: num}}, limit);
      collection.deleteOne({_id: id}).then(r => {
        const getLastPage = countPages(collection,{},limit);
        Promise.all([pageNum, getLastPage]).then(pages => {
          const thisPage = pages[0], lastPage = pages[1];
          res.redirect(`/?page=${thisPage<=lastPage ? thisPage : lastPage}`);
        }).catch(e => res.render('error', {message:'ERROR', error: e}));
      }).catch(e => res.render('error', {message:'ERROR', error: e}));
    }).catch(e => res.render('error', {message:'ERROR', error: e}));
  });

  return router;
}