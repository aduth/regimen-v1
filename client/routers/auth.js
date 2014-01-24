var passport = require('passport');

// Facebook
var facebook = module.exports.facebook = { };

facebook.login = passport.authenticate('facebook', {
  scope: 'email'
});

facebook.callback = passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/auth/login'
});

// Verification
module.exports.user = function(req, res) {
  res.send(req.user);
};