var express = require('express'),
  mongoose = require('mongoose'),
  config = require('./config/config'),
  app = module.exports = express();

// Bootstrap database
mongoose.connect(config.db.url);

// Configure server
require('./config/express')(app);
require('./config/oauth2')(app);
require('./config/routes')(app);

// Start listening
app.listen(config.server.port);
console.log('API server listening on port ' + config.server.port);