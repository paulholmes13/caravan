var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../models/db');
var booking = require('../../models/booking');

router.use(bodyParser.urlencoded({
        extended: true
}));

router.use('/', function(req, res, next) {
    booking.getAvailability({args:''}, function(result){
        req.dataSet = result;
        next();
    });
});

router.use('/menu/', function(req, res, next) {
    next();
});

router.use('/index/:id', function(req, res, next) {
    if (req.params.id) {
        booking.getBooking({bookingId:req.params.id}, function(result) {
            if ( result && result.length ) {
                var d = new Date(result[0]['arrival_date']);
                var leadP = result[0]['lead_passenger_id'];
                result[0]['arrival_date'] = d.getFullYear() + '-' + (d.getMonth()+1) +  '-' + d.getDate();

                req.bookingInfo = result;

                booking.getAllPassengers({bookingId:req.params.id}, function(result) {
                    req.passengerAllInfo = result;

                    booking.getPassengers({bookingId:req.params.id}, function(result) {

                        req.passengerInfo = result[0];

                        if ( req.passengerInfo && req.passengerInfo.length) {
                            for ( i=0; req.passengerInfo.length > i; i++ ) {
                                req.passengerInfo[i]['lead_passenger'] = (req.passengerInfo[i]['customer_id'] == leadP) ? 1 : 0;
                            }
                        }

                        booking.getPayments({bookingId:req.params.id}, function(result) {
                            if ( result && result.length ) {
                                var d = new Date(result[0]['payment_date']);
                                result[0]['payment_date'] = d.getFullYear() + '-' + (d.getMonth()+1) +  '-' + d.getDate();
                            }

                            req.paymentInfo = result;

                            booking.getAddress({customerId:leadP}, function(result) {
                                req.addressInfo = result;
                                next();
                            });
                        });
                    });
                });
            }
            else {
                req.bookingInfo = {};
                req.passengerAllInfo = {};
                req.passengerInfo = {};
                req.paymentInfo = {};
                req.addressInfo = {};
                next();
            }
        });
    }
});

router.use('/createbooking/', function(req, res, next) {
    var bookingId = null;
    var params = [req.body.arrivalDate, req.body.numberOfNights, req.body.cost, req.body.privPass, bookingId];

    booking.setBooking({inParams:params}, function(result) {
        req.bookingId = result[2][0]['@out_param'];
        next();
    });
});

router.use('/updatebooking/:id', function(req, res, next) {
    if (req.params.id) {
        var params = [req.body.arrivalDate, req.body.numberOfNights, req.body.cost, req.body.privPass, req.body.bookingId];
        booking.setBooking({inParams:params}, function(result) {
            next();
        });
    }
});

router.use('/createguest/', function(req, res, next) {
    var age = (typeof req.body.age === 'undefined' || req.body.age == '' ) ? 0 : req.body.age;
    var existingId = (typeof req.body.existingCustomerId === 'undefined' || req.body.existingCustomerId == '') ? null : req.body.existingCustomerId;
    var params = [req.body.bookingId, existingId, null, req.body.title, req.body.firstName, req.body.lastName, req.body.emailAddress, age, req.body.leadPassenger];
    booking.setGuest({inParams:params}, function(result) {
        req.bookingId = req.body.bookingId;
        next();
    });
});

router.use('/updateguest/:id', function(req, res, next) {
    if (req.body.bookingId) {
        var age = (typeof req.body.age === 'undefined' || req.body.age == '' ) ? 0 : req.body.age;
        var existingId = (typeof req.body.existingCustomerId === 'undefined' || req.body.existingCustomerId == '') ? null : req.body.existingCustomerId;
        var params = [req.body.bookingId, existingId, req.body.customer_id, req.body.title, req.body.firstName, req.body.lastName, req.body.emailAddress, age, req.body.leadPassenger];
        booking.setGuest({inParams:params}, function(result) {
            next();
        });
    }
});

router.use('/createaddress/', function(req, res, next) {
    var customerId = (typeof req.body.customerId == undefined) ? 0 : req.body.customerId;
    var addressId = (typeof req.body.addressId == undefined || req.body.addressId == '') ? null : req.body.addressId;
    var inParams = [addressId, customerId, req.body.address_type, req.body.address_1, req.body.address_2, req.body.address_3, req.body.address_4, req.body.postal_code, req.body.phone];

    db.connect({type:'proc', action:'create_address', params:inParams}, function(result) {
        req.bookingId = req.body.bookingId;
        next();
    });
});


router.use('/updateaddress/:id', function(req, res, next) {
    if (req.params.id) {
        next();
    }
});

router.use('/updatepayment/:id', function(req, res, next) {
    var paymentId = (typeof req.body.paymentId == undefined || req.body.paymentId == '') ? null : req.body.paymentId;
    var inParams = [req.body.bookingId, paymentId, req.body.paymentType, req.body.paymentAmount, req.body.paymentReference, req.body.paymentDate];

    db.connect({type:'proc', action:'create_payment', params:inParams}, function(result) {
        req.bookingId = req.body.bookingId;
        next();
    });
});




router.use('/createpayment/', function(req, res, next) {
    var paymentId = (typeof req.body.paymentId == undefined || req.body.paymentId == '') ? null : req.body.paymentId;
    var inParams = [req.body.bookingId, paymentId, req.body.paymentType, req.body.paymentAmount, req.body.paymentReference, req.body.paymentDate];

    db.connect({type:'proc', action:'create_payment', params:inParams}, function(result) {
        req.bookingId = req.body.bookingId;
        next();
    });
});

/*********ROUTES BELOW*************************/

/* availability page */
router.get('/', function(req, res) {
    res.render('admin/availability', {data: req.dataSet});
});

router.get('/menu/', function(req, res) {
    res.render('admin/menu', {});
});

router.get('/index/', function(req, res, next) {
    res.render('admin/index', {data:[{}]} );
});

/* GET home page. */
router.get('/index/:id', function(req, res, next) {
    res.render('admin/index', { data:[{bookingInfo:req.bookingInfo, allPassenger: req.passengerAllInfo, passengerInfo:req.passengerInfo, addressInfo:req.addressInfo, paymentInfo:req.paymentInfo}] });
});

router.post('/updatebooking/:id', function(req, res, next) {
    res.redirect('/admin/index/'+req.params.id);
});

router.post('/updateguest/:id', function(req, res, next) {
    res.redirect('/admin/index/'+req.body.bookingId);
});

router.post('/updatepayment/:id', function(req, res, next) {
    res.redirect('/admin/index/'+req.body.bookingId);
});

router.post('/updateaddress/:id', function(req, res, next) {
    res.redirect('/admin/index/'+req.body.bookingId);
});

router.post('/createbooking/', function(req, res, next) {
    res.redirect('/admin/index/'+req.bookingId);
});

router.post('/createguest/', function(req, res, next) {
    res.redirect('/admin/index/'+req.bookingId);
});

router.post('/createaddress/', function(req, res, next) {
    res.redirect('/admin/index/'+req.bookingId);
});

router.post('/createpayment/', function(req, res, next) {
    res.redirect('/admin/index/'+req.bookingId);
});

module.exports = router;
