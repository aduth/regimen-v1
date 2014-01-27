module.exports = function (app) {
  restify(app, 'regimen');
  restify(app, 'user');
};

var restify = function(app, base) {
  var router = require('../app/routers/' + base);
  app.get('/' + base + '/', router.index);
  app.get('/' + base + '/:id', router.show);
  app.post('/' + base + '/', router.create);
  app.put('/' + base + '/:id', router.update);
  app.patch('/' + base + '/:id', router.patch);
  app.del('/' + base + '/:id', router.delete);
};