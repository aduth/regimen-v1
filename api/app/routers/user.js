var User = require('../models/user.js');

// List
exports.index = function(req, res) {
  User.find(function(err, people) {
    if (err) throw err;

    res.send(people);
  });
};

// Show
exports.show = function(req, res) {
  var id = req.params.id;

  User.findOne({ _id: id }, function(err, user) {
    if (err) throw err;

    res.send(user);
  });
};

// Create
exports.create = function(req, res) {
  new User(req.body).save(function(err, user) {
    if (err) throw err;

    res.send(user);
  });
};

// Update
exports.update = function(req, res) {
  var id = req.params.id;

  User.findOneAndUpdate({ _id: id }, req.body, function(err, user) {
    if (err) throw err;

    res.send(user);
  });
};

// Delete
exports.delete = function(req, res) {
  var id = req.params.id;

  User.remove({ _id: id }, function (err) {
    if (err) throw err;

    res.send(200);
  });
};