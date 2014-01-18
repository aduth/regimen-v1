var path = require('path');

exports.env = process.env.NODE_ENV || 'development';

exports.server = {
  host: 'api.regimenapp.com',
  port: process.env.PORT || 9000
};

exports.url = {
  api: 'http://' + exports.server.host,
  client: 'http://regimenapp.com'
};

exports.paths = {
  data: path.join(__dirname, '../data/regimen')
};

exports.db = {
  url: 'mongodb://localhost/regimen'
};