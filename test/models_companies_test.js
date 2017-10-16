var companies_models = require('../models/companies');
const expect = require('chai').expect;
var dbcfg = require('../config/db.json');

var testObject = { "company_name": "OSU", "ticker_symbol": "NASDAQ: OSU", "company_category": "University" };
var modifyObject = { "company_name": "Amazon", "ticker_symbol": "NASDAQ: AMZN", "company_category": "ElectricalBusiness" };

describe("flushing test data through database", function () {

    it("should be able to create schema", function (done) {
        companies_models.init(dbcfg, (err) => {
            expect(err).not.to.exist;
            done();
        });
    });

    it("should be able to insert a company", function (done) {
        companies_models.insert(dbcfg, testObject, (err, result) => {
            expect(err).not.to.exist;
            if (!result) throw new Error("No item id returned");
            if (typeof(result['company_id']) != "number" || !Number.isInteger(result['company_id']))
                throw new Error("Non-Integer returned on insertation");
            testObject["company_id"] = result["company_id"];
            modifyObject['company_id'] = result['company_id'];
            done();
        });
    });

    it("should be able to list a company with company_id", function (done){
        companies_models.listOneCompany(dbcfg, testObject["company_id"], (err, result) => {
            expect(err).not.to.exist;
            if (!result) throw new Error("No company found");
            if (result['company_id'] != testObject['company_id'] || result['company_name'] != testObject["company_name"])
                throw new Error("id or name is not match when list");
            done();
        });
    });

    it("should be able to update a company", function (done) {
        companies_models.modify(dbcfg, modifyObject, (err, result) => {
            expect(err).not.to.exist;
            if (!result) throw new Error("No item id returned");
            if (typeof(result['company_id']) != "number" || !Number.isInteger(result['company_id']))
                    throw new Error("Non-Integer returned on insertation");
            done();
        });
    });

    it("should be able to check the modified company", function (done){
        companies_models.listOneCompany(dbcfg, testObject["company_id"], (err, result) => {
            expect(err).not.to.exist;
            if (!result) throw new Error("No company found");
            if (result['company_id'] != testObject['company_id'] || result['company_name'] != modifyObject["company_name"] || result['company_category'] != modifyObject['company_category'])
                throw new Error("id, name or category is not match after modification");
            done();
        });
    });

    it("should be able to update a company with one attribution", function (done) {
        delete modifyObject['company_category'];
        modifyObject['company_name'] = "Facebook";
        companies_models.modify(dbcfg, modifyObject, (err, result) => {
            expect(err).not.to.exist;
            if (!result) throw new Error("No item id returned");
            if (typeof(result['company_id']) != "number" || !Number.isInteger(result['company_id']))
                    throw new Error("Non-Integer returned on insertation");
            done();
        });
    });

    it("should be able to check the modified company with one attribution", function (done){
        companies_models.listOneCompany(dbcfg, testObject["company_id"], (err, result) => {
            expect(err).not.to.exist;
            if (!result) throw new Error("No company found");
            if (result['company_id'] != testObject['company_id'] || result['company_name'] != modifyObject["company_name"])
                throw new Error("id, name or category is not match after modification");
            done();
        });
    });

    it("should be able to delete a company", function (done) {
        companies_models.del(dbcfg, testObject["company_id"], (err, results) => {
            expect(err).not.to.exist;
            done();
        });
    });
});
