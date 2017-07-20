var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../../../models/db');
var booking = require('../../../models/booking');

router.use('/index/:id', function(req, res, next) {
    if (req.params.id) {
        booking.getBooking({bookingId:req.params.id}, function(result) {
            if ( result && result.length ) {
                
                var d = new Date(result[0]['arrival_date']);
                var leadP = result[0]['lead_passenger_id'];
                result[0]['arrival_date'] = d.getFullYear() + '-' + (d.getMonth()+1) +  '-' + d.getDate();
                result[0]['arrival_date_display'] = d.getDate() + '-' + (d.getMonth()+1) +  '-' + d.getFullYear();
                
                req.bookingInfo = result;
                
                booking.getAllPassengers({bookingId:req.params.id}, function(result) {
                    if (!result) {
                        next();
                    }

                    req.passengerAllInfo = (result && result.length) ? result : {};

                    booking.getPassengers({bookingId:req.params.id}, function(result) {
                        if (!result) {
                            next();
                        }
                        
                        req.passengerInfo = (result && result.length) ? result[0] : {};

                        booking.getPayments({bookingId:req.params.id}, function(result) {
                            var holidayCost  = req.bookingInfo[0].cost;
                            var balance = holidayCost;
                            
                            if ( result && result.length ) {
                                for (var i=0; i < result.length; i++) {
                                    var d = new Date(result[i]['payment_date']);
                                    result[i]['payment_date'] = d.getDate() + '-' + (d.getMonth()+1) +  '-' + d.getFullYear();
                                    balance = balance - result[i]['amount'];
                                    result[i]['balance'] = balance;
                                }
                            }

                            req.paymentInfo = (result && result.length) ? result : {};
                            console.log(req.paymentInfo);                            
                            if (leadP != null) {
                                booking.getAddress({customerId:leadP}, function(result) {
                                    req.addressInfo = (result && result.length) ? result : {};
                                    next();
                                });
                            }
                            else {
                                next();
                            }
                        });
                    });
                });
            }
            else {
                //did not find a booking id
                next();
            }
        });
    }
});

/*********ROUTES BELOW*************************/

/* availability page */
router.get('/index/:id', function(req, res, next) {
    res.render('admin/finalconfirmation/index', { data:[{bookingInfo:req.bookingInfo, allPassenger: req.passengerAllInfo, passengerInfo:req.passengerInfo, addressInfo:req.addressInfo, paymentInfo:req.paymentInfo}] });
});

module.exports = router;
