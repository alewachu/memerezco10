const { Schema, model } = require('mongoose');
import { getDateTimeFullBD } from '../helpers.js';

const categorySchema = new Schema({
  name: { type: String, default: null },
  Slug: { type: String, default: null },
  description: { type: String, default: null },
  createdAt: { type: Date, default: getDateTimeFullBD },
  updatedAt: { type: Date, default: getDateTimeFullBD },
  deletedAt: { type: Date, default: null },
});

categorySchema.set('toJSON', {
  transform: function (doc, schema) {
    schema.id = schema._id;
    delete schema._id;
    delete schema.__v;
  },
});

module.exports = model('Category', categorySchema, 'category');
