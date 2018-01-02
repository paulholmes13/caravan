var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {fbHeight: '490px'});
});

router.get('/facilities', function(req, res, next) {
  res.render('facilities', {fbHeight: '1485px'});
});


router.get('/contact', function(req, res, next) {
  res.render('contact', {fbHeight: '400px'});
});

module.exports = router;
