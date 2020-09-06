//destructuring,trae una propiedad de un objeto,en este caso una funcion
const { Schema, model } = require('mongoose');
import { getDateTimeFullBD } from '../helpers.js';

const userSchema = new Schema({
  name: { type: String, default: null },
  mail: { type: String, default: null },
  password: { type: String, default: null },
  dob: { type: Date, default: null },
  image: { type: String, default: null }, // path
  verifiedAt: { type: Date, default: getDateTimeFullBD },
  createdAt: { type: Date, default: getDateTimeFullBD },
  updatedAt: { type: Date, default: getDateTimeFullBD },
  deletedAt: { type: Date, default: null },
});

userSchema.set('toJSON', {
  transform: function (doc, schema) {
    schema.id = schema._id;
    delete schema._id;
    delete schema.__v;
    delete schema.password;
  },
  virtuals: true,
});

module.exports = model('User', userSchema, 'user');
