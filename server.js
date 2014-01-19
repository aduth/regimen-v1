var http = require('http'),
  httpProxy = require('http-proxy'),
  configs = { };

// Client
var client = require('./client/server');
configs.client = require('./client/config/config').server;

// API
var api = require('./api/server');
configs.api = require('./api/config/config').server;

// Proxy
var router = { };
router[configs.api.host] = '127.0.0.1:' + configs.api.port;
router[configs.client.host] = '127.0.0.1:' + configs.client.port;

var proxyServer = httpProxy.createServer({
  hostnameOnly: true,
  router: router
}).listen(80);
