var express = require('express');
var router = express.Router();
var companies_models = require('../models/companies');
var dbcfg = require('../config/db.json');

//  TODO: add pug views to project

companies_models.init(dbcfg, (err, results) => {
  if (err) throw err;
});

/* GET home page. */
router.get('/', function(req, res, next) {
    // make sure we end with a slash, so that relative links point *into* this router
    if (req.originalUrl.slice(-1) != '/') {
      console.log("Output originalUrl" + req.originalUrl);
      return res.redirect(req.originalUrl + '/');
    }
    companies_models.list(dbcfg, function(err, results) {
        var pre_output_str = "<html><a href='edit'>Add New Company</a><br>";
        var suf_output_str = "</html>";
        var output_str = pre_output_str;
        for (var i = 0; i < results.length; i++) {
          output_str = output_str + results[i].company_name + " / " + results[i].company_category + "<br>";
        }
        output_str = output_str + suf_output_str;
        res.end(output_str);
    });
});

router.get('/edit', function(req, res){
    res.end("<html><form method='post'>Name<input type='text' name='company_name'><br>Category<input type='text' name='company_category'><br><input type='submit' value='Submit'></form></html>");
});

router.post('/edit', function(req, res) {
    var company_name = req.body.company_name;
    var company_category = req.body.company_category;

    if (company_name === '' || company_category === '') {
        return res.end("Insert Fail");
    }

    companies_models.insert(dbcfg, req.body, function(err, results) {
        return res.redirect('./');
    });
});

module.exports = router;
