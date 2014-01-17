var express = require('express'),
  middlewares = require('./middleware'),
  config = require('./config');

module.exports = function(app) {
  app.use(express.compress());
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(middlewares.cors);
};
