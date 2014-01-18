var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  config = require('./config'),
  secrets = require('../../secrets');

var users = { };

module.exports = function() {
  passport.serializeUser(function(user, done) {
    users[user.id] = user;
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    done(null, users[id] || { });
  });

  passport.use(new FacebookStrategy({
    clientID: secrets.facebook.appId,
    clientSecret: secrets.facebook.appSecret,
    callbackURL: config.url.client + '/auth/facebook/callback'
  }, function(accessToken, refreshToken, profile, done) {
    done(null, profile);
  }));
};