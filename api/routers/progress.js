var Promise = require('bluebird'),
  Regimen = Promise.promisifyAll(require('../models/regimen.js')),
  _ = require('lodash');

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
  var _regimen = req.query._regimen,
    week = req.query.week,
    query = { _user: req.user.id, _id: _regimen },
    promise;

  // Verify parameters
  if (!/\d/.test(week)) {
    res.status(400);
    return res.send({ error: 'Invalid week specified' });
  }

  if (week) {
    var deferred = Promise.defer();

    Regimen.aggregate([
      // Match user and regimen
      { $match: query },
      // Unwind progress array
      { $unwind: '$progress' },
      // And find only matching week progress
      { $match: { 'progress.week': parseInt(week, 10) } },
      // Then regroup
      { $group: { _id: '$_id', 'progress': { $push: '$progress' }}}
    ]).exec(function(err, regimen) {
      if (err) return deferred.reject(err);
      deferred.resolve(regimen[0]);
    });

    promise = deferred.promise;
  } else {
    promise = Regimen.findAsync(query);
  }

  promise.then(function(regimen) {
    // Respond with progress property
    res.send(regimen.progress);
  });
};

// Create
exports.create = function(req, res) {
  var _regimen = req.body._regimen || req.query._regimen;

  Regimen.findOneAsync({ _user: req.user.id, _id: _regimen }).then(function(regimen) {
    // Find existing progress record for this exercise and week
    var existing = _.find(regimen.progress, function(progress) {
      return req.body._exercise === progress._exercise &&
        req.body.week === progress.week &&
        req.body.workout === progress.workout;
    });

    if (existing) {
      // If progress exists, update progress and increment
      existing.increment = req.body.increment;
      existing.progress = req.body.progress;
    } else {
      // If progress does not exist, append new
      regimen.progress.push(req.body);
    }

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