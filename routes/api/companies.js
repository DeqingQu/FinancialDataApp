var express = require('express');
var router = express.Router();
var companies_models = require('../../models/companies');
var dbcfg = require('../../config/db.json');

//
router.get('/', function(req, res) {
    // make sure we end with a slash, so that relative links point *into* this router
    if (req.originalUrl.slice(-1) != '/') {
      console.log("Output originalUrl" + req.originalUrl);
      return res.redirect(req.originalUrl + '/');
    }
    companies_models.listAllCompanies(dbcfg, function(err, results) {
        res.end(JSON.stringify(results));
    });
    
    // var company_id = req.query['company_id'];
    // if (company_id) {
    //     companies_models.listOneCompany(dbcfg, company_id, function(err, results) {
    //         res.end(JSON.stringify(results));
    //     });
    // }
    // else {
    //     companies_models.listAllCompanies(dbcfg, function(err, results) {
    //         res.end(JSON.stringify(results));
    //     });
    // }
});

module.exports = router;
