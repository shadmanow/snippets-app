const {Schema, model} = require('mongoose');

const schema = new Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exp: {type: Number, required: true},
  fingerprint: { type: String, required: true }
});

module.exports = model('Token', schema);

