var http = require('http'),
  httpProxy = require('http-proxy'),
  network = require('./network'),
  env = process.env.NODE_ENV || 'development';

// Verify valid configuration exists
if (env in network) {
  network = network[env];
} else {
  throw new Error('Network settings for current environment `' + env + '` do not exist');
}

// Bootstrap sub-applications
require('./client/server');
require('./api/server');

// Start proxy
var router = { };
router[network.api.host] = network.api.local;
router[network.client.host] = network.client.local;

var proxyServer = httpProxy.createServer({
  hostnameOnly: true,
  router: router
}).listen(80);
