var express = require('express'),
  consolidate = require('consolidate'),
  passport = require('passport'),
  config = require('./config'),
  secrets = require('../../secrets');

module.exports = function(app) {
  // Templating
  app.engine('hbs', consolidate.handlebars);
  app.set('view engine', 'hbs');
  app.set('views', config.paths.app);

  // Middleware
  app.use(express.compress());
  app.use(express.methodOverride());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.static(config.paths.app));
  app.use(express.cookieParser());
  app.use(express.session({ secret: secrets.session.client }));
  app.use(passport.initialize());
  app.use(passport.session());
};
