module.exports = function (app) {
  var regimen = require('../routers/regimen');
  app.get('/regimen/:id', regimen.show);
};
