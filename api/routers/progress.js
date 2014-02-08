var Promise = require('bluebird'),
  Regimen = Promise.promisifyAll(require('../models/regimen.js'));

Promise.promisifyAll(Regimen.prototype);

exports.middleware = [
  function(req, res, next) {
    // Verify regimenId passed in body
    if (!req.body.regimenId) {
      res.status(400);

      var error = 'Invalid or missing `regimenId` query parameter.';
      res.send({ error: error });
      return next(error);
    }

    next();
  }
];

// List
exports.index = function(req, res) {
  var regimenId = req.body.regimenId;

  Regimen.findOneAsync({ _user: req.user.id, _id: regimenId }).then(function(regimen) {
    // Respond with progress property
    res.send(regimen.progress);
  });
};

// Create
exports.create = function(req, res) {
  var regimenId = req.body.regimenId;

  Regimen.findOneAsync({ _user: req.user.id, _id: regimenId }).then(function(regimen) {
    regimen.progress.push(req.body);
    return regimen.saveAsync();
  }).then(function(regimen) {
    res.status(201); // 201: Created
    res.end();
  });
};

// Undefined: Show, Update, Patch, Delete
exports.show = exports.update = exports.patch = exports.delete = function(req, res) {
  res.status(404);
  res.end();
};