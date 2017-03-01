var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var map = require('./routes/map');
var pug = require('pug');

var neo4j = require('node-neo4j');
var neo4j_db = new neo4j('http://neo4j:dxy@localhost:7474');

var app = express();
 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use(function(req,res,next){
  req.neo4j_db = neo4j_db;
  next();
});
app.use('/', index);
app.use('/map', map);
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  // Website you wish to allow to connect
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
