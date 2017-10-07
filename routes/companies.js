var express = require('express');
var router = express.Router();
var companies_models = require('../models/companies');
var dbcfg = require('../config/db.json');

//  TODO: add validation module to project

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
        res.render('companies-list.pug', {companies: results});
    });
});

router.get('/edit', function(req, res){
    res.render('companies-form.pug', { company: {} });
});

router.post('/edit', function(req, res) {

    req.checkBody(companies_models.validation());
    req.getValidationResult().then((errs) => {
        console.log(errs);
        if (errs.isEmpty())
            res.redirect('./');
        else
            res.render('user-form.pug', { company: req.body, errs: errs.useFirstErrorOnly().array() });
    });
});

module.exports = router;
