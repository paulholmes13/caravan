var express = require('express');
var db = require("../models/db");

var self = module.exports = {
    getBooking: function (args, callback) {
        db.connect({type:'select', action:'SELECT * FROM bookings where booking_id = ' + args.bookingId }, function(result) {
            //if (typeof result != 'undefined' && result.length) {
                callback(result);
            //}
        });
    },
    getAllPassengers: function(args, callback) {
        db.connect({type:'select', action:'SELECT * FROM customer'}, function(result) {
            //if (typeof result != 'undefined' && result.length) {
                callback(result);
            //}
        });
    },
    getPassengers: function(args, callback) {
        var inParams = [args.bookingId];
        db.connect({type:'proc', action:'get_guests', params:inParams}, function(result) {
            callback(result);
        });
    },
    getPassenger: function(args, callback) {
        callback('Hello');
    },
    getLeadPassenger: function(args, callback) {
        callback('Hello');
    },
    getPayments: function(args, callback) {
        db.connect({type:'select', action:'SELECT * FROM payments where booking_id = ' + args.bookingId}, function(result) {
            if (typeof result != 'undefined') {
                callback(result);
            }
            else {
                callback({});
            }
        });
    },
    getAddress: function(args, callback) {
        if (args && args.customerId) {
            db.connect({type:'select', action:'SELECT * FROM addresses where customer_id = ' + args.customerId}, function(result) {
                if (typeof result != 'undefined') {
                    callback(result);
                }
                else {
                    callback({});
                }
            });
        }
        else {
            callback({});
        }
    },
    getAvailability: function(args, callback) {
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
                        available: (result[i].status == '' || result[i].status == null || typeof result[i].status == undefined) ? 1:0,
                        pending:(result[i].status == 'P') ? 1:0, 
                        booked: (result[i].status == 'B') ? 1:0,
                        closed: (result[i].status == 'C') ? 1:0,
                        firstDayInMonth: firstDayInMonth,
                        lastDayInMonth: (result[i]["arrival_date"].getDate() == lastDayInMonth) ? 1:0
                    };
                    dataSet.push(tempVariable);
                }
                callback(dataSet);
            }
        });
    },
    setBooking: function(args, callback) {
        db.connect({type:'proc', action:'create_booking', params:args.inParams, outParams:1}, function(result) {
            callback(result);
        });
    },
    setGuest: function(args, callback) {
        db.connect({type:'proc', action:'create_guest', params:args.inParams}, function(result) {
            callback(result);
        });
    },
    setAddress: function(args, callback) {
        db.connect({type:'proc', action:'create_address', params:args.inParams}, function(result) {
            callback(result);
        });
    }

};
