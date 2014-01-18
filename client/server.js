var express = require('express'),
  consolidate = require('consolidate'),
  app = module.exports = express();

var config = app.config = {
  host: 'regimenapp.com',
  port: process.env.PORT || 3001
};

app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/app');

app.use(express.static(__dirname + '/app/'));

app.use(function(req, res) {
  var data = require('../api/data/regimen/1');
  res.render('index', {
    bootstrap: JSON.stringify({
      regimen: {
        1: data
      }
    })
  });
});

app.listen(config.port);
console.log('Client server listening on port ' + config.port);
