var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Schema
var userSchema = new Schema({
  firstName: String,
  lastName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual properties
userSchema.virtual('name').get(function() {
  return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model('User', userSchema);