var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  Promise = require('bluebird'),
  request = Promise.promisify(require('request')),
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
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    request({
      url: config.api.user + id,
      json: true
    }).spread(function(res, body) {
      done(null, body);
    }).catch(function(err) {
      done(err);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: secrets.facebook.appId,
    clientSecret: secrets.facebook.appSecret,
    callbackURL: config.url.client + '/auth/facebook/callback'
  }, function(accessToken, refreshToken, profile, done) {
    var accessToken;

    // Request access token
    request({
      url: config.api.oauth.token,
      method: 'POST',
      form: {
        grant_type: 'password',
        username: profile.username,
        password: accessToken
      },
      auth: {
        user: secrets.oauth.client.client_id,
        pass: secrets.oauth.client.client_secret
      },
      json: true
    }).spread(function(res, body) {
      // Then request user list
      accessToken = body.access_token;

      return request({
        url: config.api.user,
        headers: {
          Authorization: 'Bearer ' + accessToken
        },
        json: true
      });
    }).spread(function(res, body) {
      // Then extract user profile
      if (body instanceof Array && body.length > 0) {
        var profile = body[0];
        profile.accessToken = accessToken;
        return done(null, profile);
      }
      done(new Error('Unable to extract user profile'));
    }).catch(function(err) {
      done(err);
    });
  }));
};