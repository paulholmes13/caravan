var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mustacheExpress = require('mustache-express');

var index = require('./routes/index');
var users = require('./routes/users');
var availability = require('./routes/availability');
var gallery = require('./routes/gallery');
var admin = require('./routes/admin/index');
var receipt = require('./routes/admin/receipt/index');
var confirmation = require('./routes/admin/finalconfirmation/index');
var compress = require('./routes/admin/tools/compress');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/availability', availability);
app.use('/gallery', gallery);
app.use('/admin/', admin);
app.use('/admin/receipt/', receipt);
app.use('/admin/finalconfirmation/', confirmation);
app.use('/admin/tools/compress', compress);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(err.stack);
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
