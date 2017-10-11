const chai = require('chai');
const expect = chai.expect;

describe("sanity check", () => {
    it("does math ok", (done) => {
        expect(1 + 1).to.equal(2);
        expect(1 + 1).not.to.equal(1);
        done();
    });
    it("supports the usual JS objects", (done) => {
        expect(typeof "OSU").to.equal("string");
        expect("OSU".length).to.equal(3);
        done();
    });
});
