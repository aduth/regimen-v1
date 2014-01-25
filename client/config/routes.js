config = require('./config');

module.exports = function(app) {
  var auth = require('../routers/auth');
  app.get('/auth/facebook', auth.facebook.login);
  app.get('/auth/facebook/callback', auth.facebook.callback);
  app.get('/auth/user', auth.user);

  app.use(function(req, res) {
    res.render('index', {
      bootstrap: JSON.stringify({ user: req.user }),
      config: config
    });
  });
};