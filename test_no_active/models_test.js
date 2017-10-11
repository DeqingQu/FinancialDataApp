var companies_models = require('../models/companies');
const expect = require('chai').expect;
var dbcfg = require('../config/db.json');

var testObject = { "company_name": "OSU", "company_category": "University" };

describe("flushing test data through database", function () {

    it("should be able to create schema", function (done) {
        companies_models.init(dbcfg, (err) => {
            expect(err).not.to.exist;
            done();
        });
    });

    it("should be able to insert a company", function (done) {
        companies_models.insert(dbcfg, testObject, (err, results) => {
            expect(err).not.to.exist;
            done();
        });
    });

    // it("should be able to delete a company", function (done) {
    //     companies_models.del(dbcfg, testObject["company_name"], (err, results) => {
    //         expect(err).not.to.exist;
    //         done();
    //     });
    // });
});
