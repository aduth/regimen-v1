var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  Promise = require('bluebird'),
  request = Promise.promisify(require('request')),
  config = require('./config'),
  secrets = require('../../secrets');

module.exports = function() {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    done(null, id);
  });

  passport.use(new FacebookStrategy({
    clientID: secrets.facebook.appId,
    clientSecret: secrets.facebook.appSecret,
    callbackURL: config.url.client + '/auth/facebook/callback'
  }, function(accessToken, refreshToken, profile, done) {
    var accessToken;

    // 1. Register Facebook user
    registerFacebookUser(profile).then(function() {
      // 2. Request access token
      return requestAccessToken(profile, accessToken);
    }).spread(function(res, body) {
      // 3. Request user list
      accessToken = body.access_token;
      return requestUserList(accessToken);
    }).spread(function(res, body) {
      // 4. Extract user profile
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

var registerFacebookUser = function(profile) {
  var user = {
    username: profile.username,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.emails[0].value,
    provider: 'facebook'
  };

  return request({
    method: 'post',
    url: config.api.user,
    json: user
  });
};

var requestAccessToken = function(profile, accessToken) {
  return request({
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
  });
};

var requestUserList = function(accessToken) {
  return request({
    url: config.api.user,
    headers: {
      Authorization: 'Bearer ' + accessToken
    },
    json: true
  });
};