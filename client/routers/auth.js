var passport = require('passport');

var facebook = module.exports.facebook = { };

facebook.login = passport.authenticate('facebook', {
  scope: 'email'
});

facebook.callback = passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/auth'
});