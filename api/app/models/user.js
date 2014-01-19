var mongoose = require('mongoose'),
  Promise = require('bluebird'),
  Schema = mongoose.Schema;

// Schema
var userSchema = new Schema({
  _id: String,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  lastRegimen: Number,
  createdAt: { type: Date, default: Date.now }
}, {
  id: false,
  versionKey: false
});

userSchema.set('toObject', { virtuals: true });

// Virtual properties
userSchema.virtual('name').get(function() {
  return this.firstName + ' ' + this.lastName;
});

userSchema.virtual('username')
  .get(function() {
    return this._id;
  }).set(function(username) {
    this._id = username;
  });

// Statics
userSchema.statics.findByEmail = function(email) {
  var deferred = Promise.defer();

  this.find({ email: new RegExp(email, 'i') }, function(err, user) {
    if (err) return deferred.reject(err);
    deferred.resolve(user);
  });

  return deferred.promise;
};

// Methods
userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj._id;
  return obj;
};

module.exports = mongoose.model('User', userSchema);