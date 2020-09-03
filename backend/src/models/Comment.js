const { Schema, model, ObjectId } = require('mongoose');
import { getDateTimeFullBD } from '../helpers.js';

const commentSchema = new Schema({
  user: {
    _id: { type: String, default: null },
    name: { type: String, default: null },
  },
  meme: {
    _id: { type: String, default: null },
  },
  children: [
    {
      comment: { type: String, default: null },
      createdAt: { type: Date, default: getDateTimeFullBD },
      updatedAt: { type: Date, default: getDateTimeFullBD },
      user: {
        _id: ObjectId,
        name: { type: String, default: null },
      },
    },
  ],
  comment: { type: String, default: null },
  createdAt: { type: Date, default: getDateTimeFullBD },
  updatedAt: { type: Date, default: getDateTimeFullBD },
  deletedAt: { type: Date, default: null },
});

module.exports = model('Comment', commentSchema, 'comment');
