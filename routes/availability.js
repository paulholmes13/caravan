var express = require('express');
var router = express.Router();
var db = require('../models/db');
var booking = require('../models/booking');


router.use(function(req, res, next) {
    booking.getAvailability({args:''}, function(result){
        req.dataSet = result;
        next();
    });
});

/* availability page */
router.get('/', function(req, res) {
        res.render('availability', {data: req.dataSet, fbHeight: '1210px'});
});

module.exports = router;

