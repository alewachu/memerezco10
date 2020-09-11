import { Schema, model } from 'mongoose';
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
        _id: { type: String, default: null },
        name: { type: String, default: null },
      },
    },
  ],
  comment: { type: String, default: null },
  createdAt: { type: Date, default: getDateTimeFullBD },
  updatedAt: { type: Date, default: getDateTimeFullBD },
  deletedAt: { type: Date, default: null },
});

// Módulo para eliminar underscore y _v
commentSchema.set('toJSON', {
  transform: function (doc, schema) {
    schema.id = schema._id;
    delete schema._id;
    delete schema.__v;
    schema.user.id = schema.user._id;
    delete schema.user._id;
    schema.meme.id = schema.meme._id;
    delete schema.meme._id;
    // Mapeamos para eliminar en cada comentario hijo
    schema.children.map((comment) => {
      comment.id = comment._id;
      delete comment._id;
      comment.user.id = comment.user._id;
      delete comment.user._id;
    });
  },
});

module.exports = model('Comment', commentSchema, 'comment');
