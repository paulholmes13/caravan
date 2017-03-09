var express = require('express');
var router = express.Router();
var db = require('../models/db');


router.use(function(req, res, next) {
    db.connect({type:'select', action:'SELECT * FROM availability' }, function(result) {
        if (typeof result != 'undefined' && result.length) {
            var dataSet = [];
            var dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var dayNameAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri","Sat"];
            var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            var oldMonth;
            var firstDayInMonth = 0;
            var lastDayInMonth;

            for (var i=0; i<result.length; i++) {

                if ( oldMonth != monthNames[result[i]["arrival_date"].getMonth()] ) {
                    oldMonth = monthNames[result[i]["arrival_date"].getMonth()];
                    firstDayInMonth = 1;
                    lastDayInMonth = new Date(result[i]["arrival_date"].getFullYear(), result[i]["arrival_date"].getMonth() + 1, 0).getDate();
                }
                else {
                    firstDayInMonth = 0;
                }

                var tempVariable = {
                    year: result[i]["arrival_date"].getFullYear(),
                    month: monthNames[result[i]["arrival_date"].getMonth()],
                    dayName: dayNameAbbr[result[i]["arrival_date"].getDay()],
                    day: result[i]["arrival_date"].getDate(),
                    available: (result[i].status == '') ? 1:0,
                    pending:(result[i].status == 'P') ? 1:0, 
                    booked: (result[i].status == 'B') ? 1:0,
                    closed: (result[i].status == 'C') ? 1:0,
                    firstDayInMonth: firstDayInMonth,
                    lastDayInMonth: (result[i]["arrival_date"].getDate() == lastDayInMonth) ? 1:0
                };
                dataSet.push(tempVariable);
            }
            
            req.dataSet = dataSet;
        }
    next();
    });
});

/* availability page */
router.get('/', function(req, res) {
        res.render('availability', {data: req.dataSet});
});

module.exports = router;

