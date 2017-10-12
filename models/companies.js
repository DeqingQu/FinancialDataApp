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
    var stage = db.stage(dbcfg);
    stage.execute(
        "insert into companies(company_name, company_category) values(?,?)",
        [company['company_name'], company['company_category']]
    );
    stage.queryInt("select LAST_INSERT_ID()");
    stage.finale((err, results) => {
        console.log("output results :" + JSON.stringify(results));  //  insert op return 1, select op return id
        if (err)
            return callback(err);
        else if (results.length != 2)
            return callback(new Error("Internal error: incorrect number of results returned"));
        else
            return callback(err, {
                "company_id": results[1],
                "company_name": company['company_name'],
                "company_category": company['company_category']
            });
        });
}

function list(dbcfg, callback) {
    /// issue a single query, then output the result to callback(err, results)
    db.stage(dbcfg).query("select * from companies order by company_id").finale(callback);
}

function del(dbcfg, company_id, callback) {
    db.stage(dbcfg).execute(
        "delete from companies where company_id='" + company_id + "'").finale(callback);
}

function validation() {
    return {
        "company_name": {
            notEmpty: true,
            errorMessage: "Please enter a valid name"
        },
        "company_category": {
            notEmpty: true,
            errorMessage: "Please enter a valid category"
        }
    };
}

module.exports = {
  init: init,
  insert: insert,
  list: list,
  del:del,
  validation: validation
};
