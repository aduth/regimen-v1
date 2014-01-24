var mongoose = require('mongoose'),
  Promise = require('bluebird'),
  bcrypt = require('bcrypt'),
  config = require('../../config/config'),
  Schema = mongoose.Schema;

// Schema
var userSchema = new Schema({
  _id: String,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  lastRegimen: String,
  createdAt: { type: Date, default: Date.now },
  password: String,
  provider: { type: String, enum: [ 'local', 'facebook' ], default: 'local' }
}, {
  id: false,
  versionKey: false
});

// Handlers
userSchema.set('toObject', { virtuals: true });

userSchema.pre('save', function(next) {
  // If password modified, hash modified password
  if (!this.isModified('password')) return next();
  var _this = this;
  bcrypt.hash(this.password, config.security.hashSaltWorkFactor, function(err, hash) {
    if (err) return next(err);
    _this.password = hash;
    next();
  });
});

// Validation
userSchema.path('password').validate(function() {
  if ((this.provider === 'local' || !this.provider) && !this.password) {
    var err = 'Password required for local accounts';
    this.invalidate('password', err);
  }
}, null);

// Virtual properties
userSchema.virtual('name').get(function() {
  return this.firstName + ' ' + this.lastName;
});

userSchema.virtual('username')
  .get(function() {
    return this._id;
  })
  .set(function(username) {
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
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);