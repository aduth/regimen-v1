module.exports = function (app) {
  restify(app, 'regimen');
  restify(app, 'user');
  restify(app, 'progress')
};

var restify = function(app, base) {
  var router = require('../routers/' + base),
    middleware = router.middleware || passthrough;

  app.get('/' + base + '/', middleware, router.index);
  app.get('/' + base + '/:id', middleware, router.show);
  app.post('/' + base + '/', middleware, router.create);
  app.put('/' + base + '/:id', middleware, router.update);
  app.patch('/' + base + '/:id', middleware, router.patch);
  app.del('/' + base + '/:id', middleware, router.delete);
};

var passthrough = function(req, res, next) {
  next();
};