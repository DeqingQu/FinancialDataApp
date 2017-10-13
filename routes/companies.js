var express = require('express');
var router = express.Router();
var companies_models = require('../models/companies');
var dbcfg = require('../config/db.json');

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

    companies_models.listAllCompanies(dbcfg, function(err, results) {
        res.render('companies-list.pug', {companies: results});
    });
});

router.get('/edit', function(req, res){
    res.render('companies-form.pug', { company: {} });
});

router.post('/edit', function(req, res) {
    req.checkBody(companies_models.validation());
    req.getValidationResult().then((errs) => {
        if (errs.isEmpty()) {
            companies_models.insert(dbcfg, req.body, function(err, results) {
                res.redirect('./');
            });
        }
        else {
            console.log(errs.useFirstErrorOnly().array());
            res.render('companies-form.pug', { company: req.body, errs: errs.useFirstErrorOnly().array() });
        }
    })
    .catch((err) => {
        console.log(err);
        res.redirect('./');
    });
});

router.get('/delete', function(req, res) {
    companies_models.del(dbcfg, req.query["company_id"], function(err, results) {
        res.redirect('./');
    });
});

module.exports = router;
