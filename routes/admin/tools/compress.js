var express = require('express');
var router = express.Router();
var fs = require( 'fs' );
var path = require( 'path' );
// In newer Node.js versions where process is already global this isn't necessary.
//var process = require( "process" );
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
 
router.get('/', function(req, res, next) {
    imagemin(['/Users/pholmes/Sites/caravan1/caravan/public/images/*.{jpg,png}', '/Users/pholmes/Sites/caravan1/caravan/public/images/caravan/*.{jpg,png}'], 'build/images', {
        plugins: [
            imageminJpegtran(),
        ]
    }).then(files => {
        console.log(files);
        res.render('admin/tools/compress');
    });
});

module.exports = router;

