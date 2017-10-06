var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var index = require('./routes/index');
var books = require('./routes/books');
var company = require('./routes/company')

app.use(function(req, res, next){
    console.log("In comes a " + req.method + " to " + req.url);
    next();
});

app.use('/', index);
app.use('/books', books);
app.use('/company', company);

app.use(express.static(__dirname + "/public"));

app.use(function(req, res) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 error!\n");
});

app.listen(3000);
