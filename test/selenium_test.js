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

            var lnkAddCompany = browser.findElement(selenium.By.partialLinkText('Add company'));
            lnkAddCompany.click();
            done();
      });

      test.it("should let us fill in the form", function (done) {
          // taking us to the form, where we put in a random test string about Mario's favorite villain
          browser.findElement(selenium.By.name("company_name")).sendKeys("Monster");
          browser.findElement(selenium.By.name("company_category")).sendKeys("FMCG");
          browser.findElement(selenium.By.name("save")).click();
          done();
      });

      test.it("should take us to the list page, including our new element", function (done) {
          // ok, we should now be back at the list page... can we find our new Bowser link?
          // findElement already throws an exception if element not found
          var isMonster = false;
          browser.findElements(selenium.By.tagName("li")).then(function(elements){
              elements.forEach(function (element) {
                  element.getText().then(function(text){
                      if (text.inclues("Monster")) {
                          isMonster = true;
                      }
                  });
              });
              expect(isMonster).to.equal(true);
          });

          done();
      });
});
