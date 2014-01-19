module.exports = function (app) {
  // Regimen
  var regimen = require('../app/routers/regimen');
  app.get('/regimen/:id', regimen.show);

  // User
  var user = require('../app/routers/user');
  app.get('/user/', user.index);
  app.get('/user/:id', user.show);
  app.post('/user/', user.create);
  app.put('/user/:id', user.update);
  app.del('/user/:id', user.delete);
};
