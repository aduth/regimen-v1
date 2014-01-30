var path = require('path'),
  env = process.env.NODE_ENV || 'development',
  network = require('../../network')[env];

exports.env = env;
exports.development = env === 'development';

exports.server = {
  host: network.api.host,
  port: network.api.port
};

exports.url = {
  api: network.api.protocol + '://' + network.api.host,
  client: network.client.protocol + '://' + network.client.host
};

exports.db = {
  url: 'mongodb://localhost/regimen'
};

exports.oauth = {
  grants: [ 'password', 'refresh_token' ],
  allow: {
    post: [ '/user/' ],
    options: [ '/.*' ]
  }
};

exports.security = {
  hashSaltWorkFactor: 10,
  facebookVerifyUrl: 'https://graph.facebook.com/me'
};