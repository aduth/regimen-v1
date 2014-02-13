var Promise = require('bluebird'),
  User = Promise.promisifyAll(require('../models/user.js'));

Promise.promisifyAll(User.prototype);

// List
exports.index = function(req, res) {
  User.findAsync({ _id: req.user.id }).then(function(users) {
    res.send(users);
  });
};

// Show
exports.show = function(req, res) {
  User.findOneAsync({ _id: req.user.id }).then(function(user) {
    if (!user) res.status(404);
    res.send(user);
  });
};

// Create
exports.create = function(req, res) {
  new User(req.body).saveAsync().then(function(user) {
    res.status(201); // 201: Created
    res.end();
  }, function(err) {
    if (err.cause.code === 11000) {
      // User already exists
      res.status(409); // 409: Conflict
      return res.end();
    }
    throw err;
  });
};

// Update
exports.update = function(req, res) {
  User.findOneAndUpdateAsync({ _id: req.user.id }, req.body).then(function() {
    res.status(201); // 201: Created
    res.end();
  });
};

// Patch
exports.patch = function(req, res) {
  var username = req.params.id;

  // Verify updated user is currently authenticated user
  if (username !== req.user.id) {
    res.status(401); // 401: Unauthorized
    return res.end();
  }

  User.findOneAndUpdateAsync({ _id: username }, { $set: req.body }).then(function(regimen) {
    res.status(204); // 204: No Content
    res.end();
  });
};

// Delete
exports.delete = function(req, res) {
  User.removeAsync({ _id: req.user.id }).then(function() {
    res.send(200);
  });
};