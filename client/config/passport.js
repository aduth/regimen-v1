var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  request = require('request'),
  config = require('./config'),
  secrets = require('../../secrets');

var createUser = function(profile, done) {
  var user = {
    username: profile.username,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value
  };

  request({
    method: 'post',
    url: config.api.user,
    json: user
  }, function(err, res, body) {
    if (err) return done(err);
    done(null, body[0]);
  });
};

module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(function(id, done) {
    request.get(config.api.user + id, function(err, res, body) {
      if (err || res.statusCode !== 200) return done(err);
      done(null, body);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: secrets.facebook.appId,
    clientSecret: secrets.facebook.appSecret,
    callbackURL: config.url.client + '/auth/facebook/callback'
  }, function(accessToken, refreshToken, profile, done) {
    request.get(config.api.user + profile.username, function(err, res, body) {
      if (err) return done(err);

      if (res.statusCode === 404) {
        createUser(profile, done);
      } else if (/^2/.test(res.statusCode)) {
        var user = JSON.parse(body);
        done(null, user);
      } else {
        done(new Error('Received unexpected status code ' + res.statusCode));
      }
    });
  }));
};