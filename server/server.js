var express = require('express'),
  config = require('./config/config'),
  app = module.exports = express();

// Configure server
require('./config/express')(app);
require('./config/routes')(app);

// Start listening
app.listen(config.server.port);
console.log('Server listening on port ' + config.server.port);