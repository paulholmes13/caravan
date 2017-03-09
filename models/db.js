var express = require('express');
var mysql = require("mysql");
var config = require("../config");

var self = module.exports = {
    connect: function (args, connectCallback) {

        if (typeof args.type == 'undefined' || typeof args.action == 'undefined') {return}

        var con = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.username,
            password: config.mysql.password,
            database: config.mysql.database
        });
        con.connect(function(err){
            if(err){
                console.log('Error connecting to Db');
                return;
            }
            console.log('Connection established');
        });

        switch (args.type) {
            case 'select':
                self.select(con, args, function(data) {
                    self.end(con);
                    connectCallback(data);
                });
            break;
            case 'insert':
                self.insert(con, args, function(data) {
                    self.end(con);
                    connectCallback(data);
                });
            break;
            case 'update':
                self.update(con, args, function(data) {
                    self.end(con);
                    connectCallback(data);
                });
            break;
        }
        return {};
    },
    end: function(con) {
        con.end(function(err) {
            //The connection is terminated gracefully
            //Ensures all previously enqueued queries are still
            //before sending a COM_QUIT packet to the MySQL server.
        });
    },
    select: function (con, args, selectCallback) {
        con.query(args.action,function(err,data){
            if(err) throw err;
            selectCallback(data);
            return 1;
        });
    },
    insert: function (con, args, insertCallback) {
        con.query(args.action,function(err,data){
        if(err) throw err;
        insertCallback(data);
        });
    },
    update: function (con, args, updateCallback) {
        con.query(args.action,function(err,data){
        if(err) throw err;
        updateCallback(data);
        });
    }
};






