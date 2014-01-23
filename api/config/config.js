var path = require('path'),
  env = process.env.NODE_ENV || 'development',
  network = require('../../network')[env];

exports.env = env;

exports.server = {
  host: network.api.host,
  port: network.api.port
};

exports.url = {
  api: 'http://' + network.api.host,
  client: 'http://' + network.client.host
};

exports.paths = {
  data: path.join(__dirname, '../data/regimen')
};

exports.db = {
  url: 'mongodb://localhost/regimen'
};

exports.oauth = {
  grants: [ 'password', 'refresh_token' ],
  allow: { post: '/user/' }
};

exports.security = {
  hashSaltWorkFactor: 10
};