var path = require('path'),
  env = process.env.NODE_ENV || 'development',
  network = require('../../network')[env];

exports.env = env;

exports.server = {
  host: network.client.host,
  port: network.client.port
};

exports.url = {
  client: 'http://' + network.client.host,
  api: 'http://' + network.api.host
};

exports.api = {
  user: network.api.local + '/user/'
};

exports.paths = {
  app: path.join(__dirname, '/../', (exports.env === 'development' ? 'app/' : 'dist/'))
};