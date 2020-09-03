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

module.exports = model('Category', categorySchema, 'category');
