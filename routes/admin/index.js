var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../models/db');
var booking = require('../../models/booking');

router.use(bodyParser.urlencoded({
        extended: true
}));

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

router.use('/index/:id', function(req, res, next) {
    console.log(req.params.id);
    if (req.params.id) {
        booking.getBooking({bookingId:req.params.id}, function(result) {
            req.bookingInfo = result;
            
            booking.getPassengers({bookingId:req.params.id}, function(result) {
                req.passengerInfo = result;

                booking.getPayments({bookingId:req.params.id}, function(result) {
                    req.paymentInfo = result;
                
                    booking.getAddress({bookingId:req.params.id}, function(result) {
                        req.addressInfo = result;
                        next();
                    });
                });
            });
        });
    }
});

router.use('/updatebooking/:id', function(req, res, next) {
    if (req.params.id) {
        var date = new Date(req.body.arrivalDate);
        var dateString = '"'+ date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()+'"';
        var sQuery = "UPDATE bookings SET arrival_date="+dateString+", no_of_nights="+req.body.numberOfNights+", cost="+req.body.cost+" WHERE booking_id="+req.params.id;

        db.connect({type:'update', action: sQuery}, function(result) {
            console.log(result);
            next();
        });
    }
});

router.use('/updatepayment/:id', function(req, res, next) {
    if (req.params.id) {
        console.log('Shouldnt be here.  OO errr');
        next();
    }
});

router.use('/updatepassenger/:id', function(req, res, next) {
    if (req.params.id) {
        console.log(req.body);
        var sQuery = "UPDATE customer SET first_name='"+req.body.firstName+"', last_name='"+req.body.lastName+"', title='"+req.body.title+"', email_address='"+req.body.emailAddress+"', age="+req.body.age+", lead_passenger="+req.body.leadPassenger+" WHERE customer_id="+req.body.customer_id;
        console.log(sQuery);
        db.connect({type:'update', action: sQuery}, function(result) {
            console.log(result);
            next();
        });
    }
});

router.use('/updateaddress/:id', function(req, res, next) {
    if (req.params.id) {
        console.log('Hello');
        next();
    }
});

router.use('/createbooking/', function(req, res, next) {
    var date = new Date(req.body.arrivalDate);
    var today = new Date();
    var dateString = '"'+ date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()+'"';
    var todayDateString = '"'+ today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate()+'"';
    var sQuery = "INSERT INTO bookings VALUES (null, "+dateString+", "+req.body.numberOfNights+", "+todayDateString+", "+todayDateString+", "+req.body.cost+", '', '"+req.body.privPass+"');";
    console.log(sQuery);

    db.connect({type:'insert', action: sQuery}, function(result) {
        console.log(result.insertId);
        req.bookingId = result.insertId;
        next();
    });
});



/*********ROUTES BELOW*************************/

/* availability page */
router.get('/', function(req, res) {
        res.render('admin/availability', {data: req.dataSet});
});

router.get('/index/', function(req, res, next) {
    res.render('admin/index', {data:[{}]} );
});

/* GET home page. */
router.get('/index/:id', function(req, res, next) {
    res.render('admin/index', { data:[{bookingInfo:req.bookingInfo, passengerInfo:req.passengerInfo, addressInfo:req.addressInfo, paymentInfo:req.paymentInfo}] });
});

router.post('/updatebooking/:id', function(req, res, next) {
    console.log('Goodbye');
    res.redirect('/admin/index/'+req.params.id);
});

router.post('/updatepassenger/:id', function(req, res, next) {
    res.redirect('/admin/index/'+req.params.id);
});

router.post('/updatepayment/:id', function(req, res, next) {
    res.redirect('/admin/index/'+req.params.id);
});

router.post('/updateaddress/:id', function(req, res, next) {
    res.redirect('/admin/index/'+req.params.id);
});

router.post('/createbooking/', function(req, res, next) {
    console.log(req);
    res.redirect('/admin/index/'+req.bookingId);
});

module.exports = router;
