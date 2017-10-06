var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // make sure we end with a slash, so that relative links point *into* this router
  if (req.originalUrl.slice(-1) != '/') {
    console.log("Output originalUrl" + req.originalUrl);
    return res.redirect(req.originalUrl + '/');
  }
  res.end('Hello, Company');
});

module.exports = router;
