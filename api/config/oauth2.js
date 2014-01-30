var oauthserver = require('node-oauth2-server'),
  Promise = require('bluebird'),
  bcrypt = Promise.promisifyAll(require('bcrypt')),
  request = Promise.promisify(require('request')),
  OAuth = require('../models/oauth'),
  User = require('../models/user'),
  config = require('./config'),
  secrets = require('../../secrets'),
  methods = { };

module.exports = function(app) {
  var oauth = oauthserver({
    model: methods,
    grants: config.oauth.grants,
    debug: config.env === 'development',
    allow: config.oauth.allow
  });

  app.use(oauth.handler());
  app.use(oauth.errorHandler());
};

methods.getAccessToken = function(bearerToken, callback) {
  OAuth.AccessToken.findOne({ access_token: bearerToken }, callback);
};

methods.getClient = function(clientId, clientSecret, callback) {
  var client = secrets.oauth.client;

  if (clientId === client.client_id && clientSecret === client.client_secret) {
    return callback(null, client);
  }

  callback(null);
};

methods.grantTypeAllowed = function(clientId, grantType, callback) {
  var client = secrets.oauth.client;
  callback(null, clientId === client.client_id);
};

methods.saveAccessToken = function(token, clientId, userId, expires, callback) {
  var accessToken = new OAuth.AccessToken({
    access_token: token,
    client_id: clientId,
    user_id: userId,
    expires: expires
  });

  accessToken.save(callback);
};

methods.getUser = function(username, password, callback) {
  User.findOne({ _id: username }, function(err, user) {
    // Verify user exists
    if (!user) return callback(false);

    switch(user.provider) {
      case 'facebook':
        // Verify Facebook access token
        request({
          url: config.security.facebookVerifyUrl,
          headers: {
            Authorization: 'Bearer ' + password
          },
          json: true
        }).spread(function(res, body) {
          if (!/^2/.test(res.statusCode) || !('username' in body) || user.username !== body.username) {
           return callback(false);
          }

          return callback(null, { id: user._id });
        }).catch(function() {
          callback(false);
        });
        break;
      case 'local':
        // Verify password matches
        bcrypt.compareAsync(password, user.password).then(function(res) {
          if (!res) return callback(false);
          return callback(null, { id: user._id });
        }).catch(function() {
          callback(false);
        });
        break;
      default: return callback(false);
    }
  });
};

methods.saveRefreshToken = function(token, clientId, userId, expires, callback) {
  var refreshToken = new OAuth.RefreshToken({
    refresh_token: token,
    client_id: clientId,
    user_id: userId,
    expires: expires
  });

  refreshToken.save(callback);
};

methods.getRefreshToken = function(refreshToken, callback) {
  OAuth.RefreshToken.findOne({ refresh_token: refreshToken }, callback);
};