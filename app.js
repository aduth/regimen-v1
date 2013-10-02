var express = require('express'),
  app = express();

app.use(express.static(__dirname + '/'));

app.get('/api/regimen/:id', function(req, res) {
  var id = req.params.id,
    regimen = require(__dirname + '/data/regimen/' + id);

  res.send(regimen);
});

app.get('*', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

var port = process.env.port || 3001;
app.listen(port);
console.log('Server listening on port ' + port);
