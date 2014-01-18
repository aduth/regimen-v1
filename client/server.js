var express = require('express'),
  app = module.exports = express();

var config = app.config = {
  host: 'regimenapp.com',
  port: process.env.PORT || 3001
};

app.use(express.static(__dirname + '/app/'));

app.use(function(req, res) {
  require('fs')
    .createReadStream(__dirname + '/app/index.html')
    .pipe(res);
});

app.listen(config.port);
console.log('Client server listening on port ' + config.port);
