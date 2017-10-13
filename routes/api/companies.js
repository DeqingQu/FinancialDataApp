var express = require('express');
var router = express.Router();
var companies_models = require('../../models/companies');
var dbcfg = require('../../config/db.json');

//  query all companies
//  return value is a JSON Array or empty Array
router.get('/', function(req, res) {
    // make sure we end with a slash, so that relative links point *into* this router
    if (req.originalUrl.slice(-1) != '/') {
      console.log("Output originalUrl" + req.originalUrl);
      return res.redirect(req.originalUrl + '/');
    }
    companies_models.listAllCompanies(dbcfg, function(err, results) {
        res.end(JSON.stringify(results));
    });
});

//  query one company with specified id
//  return value is a JSON Object or empty Object
router.get('/:company_id', function(req, res) {
    var company_id = parseInt(req.params['company_id']);
    companies_models.listOneCompany(dbcfg, company_id, function(err, result) {
        res.end(JSON.stringify(result));
    });
});

//  create a company
//  return value is a JSON Object
router.post('/', function(req, res) {
    // make sure we end with a slash, so that relative links point *into* this router
    if (req.originalUrl.slice(-1) != '/') {
        console.log("Output originalUrl" + req.originalUrl);
        return res.redirect(req.originalUrl + '/');
    }

    req.checkBody(companies_models.validation());
    req.getValidationResult().then((errs) => {
        if (errs.isEmpty()) {
            companies_models.insert(dbcfg, req.body, function(err, result) {
                res.status(201).end(JSON.stringify(result));
            });
        }
        else {
            res.status(400).end(errs);
        }
    })
    .catch((err) => {
        res.status(400).end(errs);
    });
});

//  delete a company
//  return value is empty
router.delete('/:company_id', function(req, res) {
    var company_id = parseInt(req.params['company_id']);
    companies_models.del(dbcfg, company_id, function (err, results) {
        res.status(204).end();
    });
});

module.exports = router;
