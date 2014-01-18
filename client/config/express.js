var express = require('express'),
  consolidate = require('consolidate');

module.exports = function(app) {
  // Templating
  app.engine('html', consolidate.handlebars);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/../app');

  // Middleware
  app.use(express.compress());
  app.use(express.methodOverride());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.static(__dirname + '/../app'));

  // Routing
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
