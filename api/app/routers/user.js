var Promise = require('bluebird'),
  User = Promise.promisifyAll(require('../models/user.js'));

Promise.promisifyAll(User.prototype);

// List
exports.index = function(req, res) {
  User.findAsync().then(function(people) {
    res.send(people);
  });
};

// Show
exports.show = function(req, res) {
  var id = req.params.id;

  User.findOneAsync({ _id: id }).then(function(user) {
    if (!user) res.status(404);
    res.send(user);
  });
};

// Create
exports.create = function(req, res) {
  new User(req.body).saveAsync().then(function(user) {
    res.send(user);
  });
};

// Update
exports.update = function(req, res) {
  var id = req.params.id;

  User.findOneAndUpdateAsync({ _id: id }, req.body).then(function(user) {
    res.send(user);
  });
};

// Delete
exports.delete = function(req, res) {
  var id = req.params.id;

  User.removeAsync({ _id: id }).then(function() {
    res.send(200);
  });
};