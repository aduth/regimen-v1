var path = require('path');

exports.env = process.env.NODE_ENV || 'development';

exports.url = {
  api: 'http://api.regimenapp.com',
  client: 'http://regimenapp.com'
};

exports.server = {
  port: process.env.PORT || 9000
};

exports.paths = {
  data: path.join(__dirname, '../data/regimen')
}