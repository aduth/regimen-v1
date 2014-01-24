var config = require('./config');

module.exports.cors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', config.url.client);
  res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};