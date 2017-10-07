var db = require('mysql2-db');

// TODO: CRUD methods

function init(dbcfg, callback) {

    /// how to execute a single statement spanning multiple lines, then return to callback(err)
    db.stage(dbcfg).execute(`
            create table if not exists companies(
            company_id MEDIUMINT NOT NULL AUTO_INCREMENT,
            company_name VARCHAR(64) NOT NULL,
            company_category VARCHAR(64) NOT NULL,
            primary key(company_id))
        `).finale(callback);
}

function insert(dbcfg, company, callback) {
    db.stage(dbcfg).execute(
        "insert into companies(company_name, company_category) values(?,?)",
        [company.company_name, company.company_category]
    ).finale(callback);
}

function list(dbcfg, callback) {
    /// issue a single query, then output the result to callback(err, results)
    db.stage(dbcfg).query("select * from companies order by company_id").finale(callback);
}

function validation() {
    return {
        "name": {
            notEmpty: true,
            errorMessage: "Please enter a valid name"
        },
        "email": {
            notEmpty: true,
            errorMessage: "Please enter a valid category"
        }
    }
}

module.exports = {
  init: init,
  insert: insert,
  list: list,
  validation: validation
};
