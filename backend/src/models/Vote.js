import { Schema, model } from 'mongoose';
import { getDateTimeFullBD } from '../helpers.js';

const voteSchema = new Schema({
  user: {
    _id: { type: String, default: null },
    name: { type: String, default: null },
  },
  meme: {
    _id: { type: String, default: null },
  },
  positive: { type: Number, default: null },
  createdAt: { type: Date, default: getDateTimeFullBD },
  updatedAt: { type: Date, default: getDateTimeFullBD },
  deletedAt: { type: Date, default: null },
});

// Módulo para eliminar underscore, _v y password
voteSchema.set('toJSON', {
  transform: function (doc, schema) {
    schema.id = schema._id;
    delete schema._id;
    delete schema.__v;
    schema.user.id = schema.user._id;
    delete schema.user._id;
    schema.meme.id = schema.meme._id;
    delete schema.meme._id;
  },
});

module.exports = model('Vote', voteSchema, 'vote');
