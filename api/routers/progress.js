var Promise = require('bluebird'),
  Regimen = Promise.promisifyAll(require('../models/regimen.js'));

Promise.promisifyAll(Regimen.prototype);

exports.middleware = [
  function(req, res, next) {
    // Verify _regimen passed in body
    if (!(req.body._regimen || req.query._regimen)) {
      res.status(400);

      var error = 'Invalid or missing `_regimen`';
      res.send({ error: error });
      return next(error);
    }

    next();
  }
];

// List
exports.index = function(req, res) {
  var _regimen = req.query._regimen;

  Regimen.findOneAsync({ _user: req.user.id, _id: _regimen }).then(function(regimen) {
    // Respond with progress property
    res.send(regimen.progress);
  });
};

// Create
exports.create = function(req, res) {
  var _regimen = req.body._regimen || req.query._regimen;

  Regimen.findOneAsync({ _user: req.user.id, _id: _regimen }).then(function(regimen) {
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