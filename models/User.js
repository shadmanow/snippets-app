const {Schema, model} = require('mongoose');
const GoogleStorageService = require('../services/GoogleStorageService');
const GS = new GoogleStorageService();

const subSchema = new Schema({
  snippetId: {type: String, ref: 'Snippet'},
}, {_id: false});

const schema = new Schema({
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},

  name: {type: String, required: true},
  password: {type: String, required: true},
  bio: {type: String, default: ''},
  contactLink: {type: String, default: ''},

  avatar: {type: String, default: `${GS.uri()}/default-avatar.png`},

  editor: {
    theme: {type: String, default: 'monokai'},
    fontSize: {type: Number, default: 17},
  },

  pins: [{type: subSchema}],
});

module.exports = model('User', schema);