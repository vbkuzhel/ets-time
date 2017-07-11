const express = require('express');
const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./app/routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:4200");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, HEAD, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "accept");
    next();
});

// error handler
app.use(function(err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  switch (err.code) {
    // knex error when we try to insert duplicate entrie
    case 'ER_DUP_ENTRY':
      res.status(409).send();
      break;
    case 'ER_BAD_FIELD_ERROR':
      res.status(400).end();
      break;
    default:
      res.status(err.status || 500).end(res.locals.message);
      break;
  }
});

module.exports = app;
