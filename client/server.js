var express = require('express'),
  app = module.exports = express();

var config = app.config = {
  host: 'regimenapp.com',
  port: process.env.PORT || 3001
};

app.use(express.static(__dirname + '/'));

app.get('/api/regimen/:id', function(req, res) {
  var id = req.params.id,
    regimen = require(__dirname + '/../server/data/regimen/' + id);

  res.send(regimen);
});

app.get('*', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.listen(config.port);
console.log('Client server listening on port ' + config.port);
