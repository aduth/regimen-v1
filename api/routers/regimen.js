var Promise = require('bluebird'),
  config    = require('../config/config'),
  fs        = Promise.promisifyAll(require('fs')),
  path      = require('path');

module.exports.show = function(req, res) {
  var id = req.params.id,
    regimenPath = path.join(config.paths.data, id + '.json');

  fs.existsAsync(regimenPath)
    .then(function() {
      res.status(404);
      res.send({});
    })
    .catch(function() {
      // Exception is thrown if exists is true because `exists` does not
      //   follow typical Node convention of error as first param
      fs.createReadStream(regimenPath).pipe(res);
    });
};