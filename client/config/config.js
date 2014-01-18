var path = require('path');

exports.env = process.env.NODE_ENV || 'development';

exports.server = {
  host: 'regimenapp.com',
  port: process.env.PORT || 9001
};

exports.url = {
  client: 'http://' + exports.server.host,
  api: 'http://api.regimenapp.com'
};