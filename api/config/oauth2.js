var oauthserver = require('node-oauth2-server'),
  OAuth = require('../app/models/oauth'),
  User = require('../app/models/user'),
  config = require('./config'),
  secrets = require('../../secrets'),
  methods = { };

module.exports = function(app) {
  var oauth = oauthserver({
    model: methods,
    grants: [ 'password', 'refresh_token' ],
    debug: config.env === 'development'
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
  User.findOne({ _id: username, password: password }, function(err, user) {
    if (err) return callback(err);
    if (!user) return callback(false);
    callback(null, { id: user._id });
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