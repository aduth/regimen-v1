var passport = require('passport');

var facebook = module.exports.facebook = { };

facebook.login = passport.authenticate('facebook');

facebook.callback = passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/auth'
});