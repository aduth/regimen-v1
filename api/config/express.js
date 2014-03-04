var express = require('express'),
  middlewares = require('./middleware');

module.exports = function(app) {
  app.use(express.compress());
  app.use(express.methodOverride());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(middlewares.cors);
};
