var Promise = require('bluebird'),
  Regimen = Promise.promisifyAll(require('../models/regimen.js'));

Promise.promisifyAll(Regimen.prototype);

// List
exports.index = function(req, res) {
  Regimen.findAsync().then(function(people) {
    res.send(people);
  });
};

// Show
exports.show = function(req, res) {
  var id = req.params.id;

  Regimen.findOneAsync({ _id: id }).then(function(regimen) {
    if (!regimen) res.status(404);
    res.send(regimen);
  });
};

// Create
exports.create = function(req, res) {
  new Regimen(req.body).saveAsync().then(function(regimen) {
    res.send(regimen);
  });
};

// Update
exports.update = function(req, res) {
  var id = req.params.id;

  Regimen.findOneAndUpdateAsync({ _id: id }, req.body).then(function(regimen) {
    res.status(201); // 201: Created
    res.end();
  });
};

// Patch
exports.patch = function(req, res) {
  var id = req.params.id;

  Regimen.findOneAndUpdateAsync({ _id: id }, { $set: req.body }).then(function(regimen) {
    res.status(204); // 204: No Content
    res.end();
  });
};

// Delete
exports.delete = function(req, res) {
  var id = req.params.id;

  Regimen.removeAsync({ _id: id }).then(function() {
    res.send(200);
  });
};