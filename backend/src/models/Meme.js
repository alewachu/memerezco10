const { Schema, model, ObjectId } = require('mongoose');
import { getDateTimeFullBD } from '../helpers.js';

const memeSchema = new Schema({
  category: {
    _id: { type: String, default: null },
    name: { type: String, default: null },
    slug: { type: String, default: null },
  },
  user: {
    _id: { type: String, default: null },
    name: { type: String, default: null },
  },
  title: { type: String, default: null },
  image: { type: String, default: null },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  createdAt: { type: Date, default: getDateTimeFullBD },
  updatedAt: { type: Date, default: getDateTimeFullBD },
  deletedAt: { type: Date, default: null },
});

module.exports = model('Meme', memeSchema, 'meme');
