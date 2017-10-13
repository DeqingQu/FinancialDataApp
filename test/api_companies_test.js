const chai = require('chai');
const expect = chai.expect;
const superagent = require('superagent')

var BASE_URL = 'http://localhost:3000/api';
var exist_company_id = 5;
var no_exist_company_id = 1;

var testItem = {'company_name':'test_name', 'company_category':'test_category'};

describe("test site with superagent", () => {
    it("test GET /url/api/companies", (done) => {
        superagent.get(BASE_URL + '/companies')
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.text).to.exist;

                var companies = JSON.parse(res.text);
                expect(companies).to.be.an.instanceof(Array);
                
                done();
            });
    });

    it("test GET /url/api/companies/{id} with existed Id", (done) => {
        superagent.get(BASE_URL + '/companies/' + exist_company_id)
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                expect(company).to.have.property('company_id');
                expect(company).to.have.property('company_name');
                expect(company).to.have.property('company_category');

                done();
            });
    });

    it("test GET /url/api/companies/{id} with non-existed Id", (done) => {
        superagent.get(BASE_URL + '/companies/' + no_exist_company_id)
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                expect(company).to.be.an('object').that.is.empty;

                done();
            });
    });

    it("test Create company API", (done) => {
        superagent.post(BASE_URL + '/companies/')
            .type('form')
            .send(testItem)
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                testItem['company_id'] = company['company_id'];
                expect(company).to.be.an('object').that.is.not.empty;

                done();
            });
    });

    it("test Get the company just created", (done) => {
        superagent.get(BASE_URL + '/companies/' + testItem['company_id'])
            .end(function(err, res) {
                expect(err).to.not.exist;
                expect(res).to.exist;
                expect(res.status).to.equal(200);
                expect(res.text).to.exist;

                var company = JSON.parse(res.text);
                expect(company['company_id']).to.equal(testItem['company_id']);
                expect(company['company_name']).to.equal(testItem['company_name']);
                expect(company['company_category']).to.equal(testItem['company_category']);

                done();
            });
    });
});
