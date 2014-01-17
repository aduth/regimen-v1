var express = require('express'),
  config = require('./config');

module.exports = function(app) {
  app.use(express.compress());
  app.use(express.methodOverride());
  app.use(express.bodyParser());
};
