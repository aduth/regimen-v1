var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  config = require('./config'),
  secrets = require('../../secrets');

module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.use(new FacebookStrategy({
    clientID: secrets.facebook.appId,
    clientSecret: secrets.facebook.appSecret,
    callbackURL: config.url.client + '/auth/facebook/callback'
  }, function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }));
};