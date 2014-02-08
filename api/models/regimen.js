var mongoose = require('mongoose'),
  shortId = require('shortid'),
  Schema = mongoose.Schema;

// Schema
var regimenSchema = new Schema({
  _id: { type: String, default: shortId.generate },
  week: Number,
  workout: Number,
  fields: Object,
  program: Object,
  createdAt: { type: Date, default: Date.now },
  progress: [{
    _id: false,
    _exercise: String,
    week: Number,
    increment: Number,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  id: true,
  versionKey: false
});

regimenSchema.set('toObject', { virtuals: true });

// Methods
regimenSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj._id;
  return obj;
};

module.exports = mongoose.model('Regimen', regimenSchema);