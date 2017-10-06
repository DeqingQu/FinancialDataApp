var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('users');
});

router.get('/', function(req, res) {
  console.log('param : ' + req.query['age']);
  console.log("param : " + req.query['name']);
  res.end("get user params 'age': " + req.query['age'] + ", name : " + req.query['name']);
});

module.exports = router;
