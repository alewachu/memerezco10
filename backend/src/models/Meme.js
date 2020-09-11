import { Schema, model } from 'mongoose';
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

memeSchema.set('toJSON', {
  transform: function (doc, schema) {
    schema.id = schema._id;
    delete schema._id;
    delete schema.__v;
    schema.user.id = schema.user._id;
    delete schema.user._id;
    schema.category.id = schema.category._id;
    delete schema.category._id;
  },
});

module.exports = model('Meme', memeSchema, 'meme');
