var path = require('path');

exports.env = process.env.NODE_ENV || 'development';

var hostPrefix = exports.env === 'development' ? 'dev.' : '';

exports.server = {
  host: hostPrefix + 'api.regimenapp.com',
  port: process.env.PORT || 9000
};

exports.url = {
  api: 'http://' + exports.server.host,
  client: 'http://' + hostPrefix + 'regimenapp.com'
};

exports.paths = {
  data: path.join(__dirname, '../data/regimen')
};

exports.db = {
  url: 'mongodb://localhost/regimen'
};

exports.oauth = {
  grants: [ 'password', 'refresh_token' ]
};