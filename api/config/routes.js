module.exports = function (app) {
  crudify(app, 'regimen');
  crudify(app, 'user');
};

var crudify = function(app, base) {
  var router = require('../app/routers/' + base);
  app.get('/' + base + '/', router.index);
  app.get('/' + base + '/:id', router.show);
  app.post('/' + base + '/', router.create);
  app.put('/' + base + '/:id', router.update);
  app.del('/' + base + '/:id', router.delete);
};