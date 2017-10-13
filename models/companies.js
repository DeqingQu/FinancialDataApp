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

//
//  description: insert a company to DB
//  param: company is an object, has attributes 'company_name' and 'company_category'
//  return callback(err, result), where result is an object, containing 'company_id', 'company_name' and 'company_category'
//
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

//  description: modify the company with specified company_id
//  param: company is an object, must has attribute 'company_id',  may has attributes of 'company_name' or 'company_category'
//  return callback(err, result), where result is an object, containing 'company_id', 'company_name' and 'company_category'
//
function modify(dbcfg, company, callback) {
    //  input param validation
    if(!('company_id' in company)) {
        return callback(new Error('No company_id'));
    }
    if(!('company_name' in company) && !('company_category' in company)) {
        return callback(new Error('No company_name and No company_category'));
    }
    //  construct sql
    var update_sql = "UPDATE companies SET ";
    if('company_name' in company)
        update_sql += "company_name='" + company['company_name'] + "',";
    if('company_category' in company)
        update_sql += "company_category='" + company['company_category'] + "',";
    update_sql = update_sql.slice(0, update_sql.length-1);
    update_sql += " WHERE company_id='" + company['company_id'] + "'";
    //  execute sql
    var stage = db.stage(dbcfg);
    stage.execute(update_sql);
    stage.finale((err, results) => {
        console.log("update results :" + JSON.stringify(results));
        if (err)
            return callback(err);
        else
            return callback(err, {
                "company_id": company['company_id'],
                "company_name": company['company_name'],
                "company_category": company['company_category']
            });
        });
}


//
//  description: list all companies in DB, and order by company_id
//
function listAllCompanies(dbcfg, callback) {
    /// issue a single query, then output the result to callback(err, results)
    db.stage(dbcfg).query("select * from companies order by company_id").finale(callback);
}

//
//  description: list the company with specified company_id
//  return callback(err, result), where result is a company object or NULL, not a array
//
function listOneCompany(dbcfg, company_id, callback) {
    /// issue a single query, then output the result to callback(err, results)
    var stage = db.stage(dbcfg);
    stage.query("select * from companies where company_id='" + company_id + "'")
    stage.finale((err, results) => {
        if (err)
            return callback(err);
        else if (results.length > 1)
            return callback(new Error("Internal error: incorrect number of results returned"));
        else if (results.length == 1)
            return callback(err, results[0]);
        else
            return callback(err, new Object());
    });
}

//
//  description: delete the company with specified company_id
//
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

function optional_validation() {
    return {
        "company_name": {
            optional: {
                notEmpty: true,
                errorMessage: "Please enter a valid name"
            }
        },
        "company_category": {
            optional: {
                notEmpty: true,
                errorMessage: "Please enter a valid category"
            }
        }
    };
}

module.exports = {
  init: init,
  insert: insert,
  modify: modify,
  listAllCompanies: listAllCompanies,
  listOneCompany: listOneCompany,
  del:del,
  validation: validation,
  optional_validation: optional_validation
};
