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
    getPassengers: function(args, callback) {
        db.connect({type:'select', action:'SELECT * FROM customer where booking_id = ' + args.bookingId}, function(result) {
            //if (typeof result != 'undefined' && result.length) {
                callback(result);
            //}
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
            //if (typeof result != 'undefined' && result.length) {
                callback(result);
            //}
        });
    },
    getAddress: function(args, callback) {
        db.connect({type:'select', action:'SELECT * FROM addresses where customer_id = 253'}, function(result) {
            //if (typeof result != 'undefined' && result.length) {
                callback(result);
            //}
        });
    }
};






