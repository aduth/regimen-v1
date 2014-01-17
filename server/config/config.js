var path = require('path');

exports.env = process.env.NODE_ENV || 'development';

exports.rootUrl = 'http://api.regimenapp.com';

exports.server = {
  port: process.env.PORT || 9000
};

exports.paths = {
  data: path.join(__dirname, '../data/regimen')
}