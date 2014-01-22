var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var accessTokenSchema = new Schema({
  access_token: { type: String },
  client_id: { type: String },
  user_id: { type: String },
  expires: { type: Date }
});

var refreshTokenSchema = new Schema({
  refresh_token: { type: String },
  client_id: { type: String },
  user_id: { type: String },
  expires: { type: Date }
});

module.exports.AccessToken = mongoose.model('AccessToken', accessTokenSchema);
module.exports.RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);