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
    new ApiFacebookAuth(accessToken, profile).authenticate().nodeify(done);
  }));
};

var ApiFacebookAuth = function(accessToken, profile) {
  this.accessToken = accessToken;
  this.profile = profile;
};

ApiFacebookAuth.prototype.authenticate = function() {
  // 1. Register Facebook user
  return this.registerFacebookUser().bind(this)
    // 2. Request access token
    .then(this.requestAccessToken)
    // 3. Request user list
    .spread(function(res, body) {
      this.accessToken = body.access_token;
      return this.requestUserList();
    })
    // 4. Extract user profile
    .spread(function(res, body) {
      if (body instanceof Array && body.length > 0) {
        var profile = body[0];
        profile.accessToken = this.accessToken;
        return profile;
      }
      done(new Error('Unable to extract user profile'));
    }).catch(function(err) {
      done(err);
    });
};

ApiFacebookAuth.prototype.registerFacebookUser = function() {
  var user = {
    username: this.profile.username,
    firstName: this.profile.name.givenName,
    lastName: this.profile.name.familyName,
    email: this.profile.emails[0].value,
    provider: 'facebook'
  };

  return request({
    method: 'post',
    url: config.api.user,
    json: user
  });
};

ApiFacebookAuth.prototype.requestAccessToken = function() {
  return request({
    url: config.api.oauth.token,
    method: 'POST',
    form: {
      grant_type: 'password',
      username: this.profile.username,
      password: this.accessToken
    },
    auth: {
      user: secrets.oauth.client.client_id,
      pass: secrets.oauth.client.client_secret
    },
    json: true
  });
};

ApiFacebookAuth.prototype.requestUserList = function() {
  return request({
    url: config.api.user,
    headers: {
      Authorization: 'Bearer ' + this.accessToken
    },
    json: true
  });
};