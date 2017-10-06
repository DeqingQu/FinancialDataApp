var express = require('express');
var router = express.Router();
var models = require('../models');
var dbcfg = require('../config/db.json');

models.init(dbcfg, (err, results) => {
  if (err) throw err;
});

/* GET home page. */
// router.get('/', function(req, res) {
//   console.log('param : ' + req.query['age']);
//   console.log("param : " + req.query['name']);
//   res.end("get books params 'Name': " + req.query['name'] + ", Category : " + req.query['category']);
// });

router.get('/', function(req, res) {
  // make sure we end with a slash, so that relative links point *into* this router
  if (req.originalUrl.slice(-1) != '/') {
    console.log("Output originalUrl" + req.originalUrl);
    return res.redirect(req.originalUrl + '/');
  }
  models.list(dbcfg, function (err, result) {
    console.log(result.length);
    var pre_output_str = "<html><a href='edit'>Add New Book</a><br>";
    var suf_output_str = "</html>";
    var output_str = pre_output_str;
    for (var i = 0; i < result.length; i++) {
      output_str = output_str + result[i].book_name + " / " + result[i].book_category + "<br>";
    }
    output_str = output_str + suf_output_str;
    res.end(output_str);
  });
});

router.get('/edit', function(req, res) {
  res.end("<html><form method='post'>Name<input type='text' name='book_name'><br>Category<input type='text' name='book_category'><br><input type='submit' value='Submit'></form></html>");
});

router.post('/edit', function(req, res) {

  book_name = req.body.book_name;
  book_category = req.body.book_category;

  if (book_name == null || book_category == null) {
    res.end("insert fail");
    return;
  }

  models.insert(dbcfg, req.body, function (err, results){
    return res.redirect('./');
  });
});

module.exports = router;
