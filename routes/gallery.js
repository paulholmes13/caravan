var express = require('express');
var router = express.Router();
var fs = require( 'fs' );
var path = require( 'path' );
// In newer Node.js versions where process is already global this isn't necessary.
//var process = require( "process" );


router.get('/', function(req, res, next) {
    var readFrom = "/Users/pholmes/Sites/caravan1/caravan/public/images/caravan/";
    var imageLoop = [];
    // Loop through all the files in the temp directory
    fs.readdir( readFrom, function( err, files ) {
            if( err ) {
                console.error( "Could not list the directory.", err );
                process.exit( 1 );
            } 

            files.forEach( function( file, index ) {
                imageLoop.push({'image': '//localhost:3000/images/caravan/' + file});
            });

            res.render('gallery', {imageArray: imageLoop, fbHeight: '2000px'});
    } );
});

module.exports = router;

