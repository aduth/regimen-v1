var path = require('path');

exports.env = process.env.NODE_ENV || 'development';

var hostPrefix = exports.env === 'development' ? 'dev.' : '';

exports.server = {
  host: hostPrefix + 'regimenapp.com',
  port: process.env.PORT || 9001
};

exports.url = {
  client: 'http://' + exports.server.host,
  api: 'http://' + hostPrefix + 'api.regimenapp.com'
};

exports.api = {
  user: exports.url.api + '/user/'
};

exports.paths = {
  app: path.join(__dirname, '/../', (exports.env === 'development' ? 'app/' : 'dist/'))
};