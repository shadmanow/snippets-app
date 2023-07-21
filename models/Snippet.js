const shortId = require('shortid');
const {Schema, model} = require('mongoose');

const subSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  text: {type: String, required: true},
  date: {type: Date, required: true, default: new Date()}
});

const schema = new Schema({
  _id: {type: String, default: shortId.generate},
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  name: {type: String, required: true},
  views: {type: Number, default: 0},
  img: { type: String, default: '' },
  createdAt: {type: Date, default: new Date()},
  updatedAt: {type: Date, default: new Date()},
  code: {
    html: {type: String,  default: ' '},
    js: {type: String, default: ' '},
    css: {type: String, default: ' '},
  },
  keywords: [{type: String, default: ''}],
  description: {type: String, default: ''},
  comments: [{ type: subSchema }]
});

module.exports = model('Snippet', schema);