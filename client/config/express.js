var express = require('express'),
  consolidate = require('consolidate'),
  passport = require('passport');
  secrets = require('../../secrets');

module.exports = function(app) {
  // Templating
  app.engine('hbs', consolidate.handlebars);
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/../app');

  // Middleware
  app.use(express.compress());
  app.use(express.methodOverride());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.static(__dirname + '/../app'));
  app.use(express.cookieParser());
  app.use(express.session({ secret: secrets.session }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Routing
  var auth = require('../routers/auth');
  app.get('/auth/facebook', auth.facebook.login);
  app.get('/auth/facebook/callback', auth.facebook.callback);
  app.get('/auth/user', auth.user);

  app.use(function(req, res) {
    var data = require('../../api/data/regimen/1');
    res.render('index', {
      bootstrap: JSON.stringify({
        regimen: {
          1: data
        }
      })
    });
  });
};
