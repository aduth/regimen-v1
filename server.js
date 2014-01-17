var http = require('http'),
  httpProxy = require('http-proxy'),
  configs = { };

// Client
var client = require('./client/server');
configs.client = client.config;

// Server
var server = require('./server/server');
configs.server = require('./server/config/config').server;

// Proxy
var proxyServer = httpProxy.createServer({
  hostnameOnly: true,
  router: {
    'regimenapp.com': '127.0.0.1:' + configs.client.port,
    'api.regimenapp.com': '127.0.0.1:' + configs.server.port
  }
}).listen(80);