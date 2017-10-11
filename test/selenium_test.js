var selenium = require('selenium-webdriver');
var By = selenium.By;
var test = require('selenium-webdriver/testing'); // nb: selenium is not quite compatible with mocha, and this bridge will cover the differences
const expect = require('chai').expect;

var browser;

test.before(function () {
  this.timeout(10000); // timeout for running the tests
  browser = new selenium.Builder()
    .withCapabilities(selenium.Capabilities.chrome())
    .build();
});

test.after(function () {
  browser.quit();
});

test.describe("testing site with selenium", function () {
  test.it("should access homepage", function (done) {
    browser.get('http://localhost:3000/companies');

    // findElement already throws an exception if element not found
    var lnkToSee = browser.findElement(selenium.By.partialLinkText('Add company'));
    lnkToSee.click();
    done();
  });
});
