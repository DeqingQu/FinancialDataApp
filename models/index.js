var db = require('mysql2-db');

// todo
function init(dbcfg, callback) {

    /// how to execute a single statement spanning multiple lines, then return to callback(err)
    db.stage(dbcfg).execute(`
            create table if not exists books(
            book_id MEDIUMINT NOT NULL AUTO_INCREMENT,
            book_name VARCHAR(64) NOT NULL,
            book_category VARCHAR(64) NOT NULL,
            primary key(book_id))
        `).finale(callback);
}

function insert(dbcfg, book, callback) {
    db.stage(dbcfg).execute(
        "insert into books(book_name, book_category) values(?,?)",
        [book.book_name, book.book_category]
    ).finale(callback);
}

function list(dbcfg, callback) {

  /// issue a single query, then output the result to callback(err, results)
  db.stage(dbcfg).query("select * from books order by book_id").finale(callback);
}

module.exports = {
    init: init,
    insert: insert,
    list: list
};
