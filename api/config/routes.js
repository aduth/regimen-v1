module.exports = function (app) {
  var regimen = require('../app/routers/regimen');
  app.get('/regimen/:id', regimen.show);
};
