const { Schema, model, ObjectId } = require('mongoose');
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

module.exports = model('Vote', voteSchema, 'vote');
