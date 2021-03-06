import express from 'express';
import { getDateTimeFullBD, ensureToken, getUserByToken } from '../helpers.js';
import Comment from '../models/Comment';
import Meme from '../models/Meme';

const router = express.Router();
const cors = require('cors');

router.get('/', async function (req, res) {
  // Armamos el query según qué parámetros hay que filtrar
  const body = req.query;
  let query = {};

  if (body.comment) {
    query['comment'] = body.comment;
  }

  if (body.createdAt) {
    query['createdAt'] = body.createdAt;
  }
  if (body.updatedAt) {
    query['updatedAt'] = body.updatedAt;
  }

  if (body.meme) {
    query['meme._id'] = body.meme;
  }

  if (body.user) {
    query['user._id'] = body.user;
  }

  const skip = body.skip ? parseInt(body.skip) : 0;
  const limit = body.limit ? parseInt(body.limit) : 5;

  query['deletedAt'] = null; // No busque eliminados
  const comments = await Comment.find(query, null, { limit, skip });
  if (comments) {
    return res.status(200).json({
      success: true,
      data: comments,
    });
  } else {
    return res.status(500).json({
      success: false,
      message: 'Error 500',
    });
  }
});

router.get('/:id', async function (req, res) {
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    const comment = await Comment.findById({ _id: req.params.id });
    if (comment) {
      if (!comment.deletedAt) {
        return res.status(200).json({
          success: true,
          data: comment,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Not found',
        });
      }
    }
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'Not found',
    });
  }
});

router.put('/:id', ensureToken, async function (req, res) {
  // Actualizar un comentario, actualmente no está desarrollado.
  res.json({ mensaje: 'Api works' });
});

router.delete('/:id', ensureToken, async function (req, res) {
  // Actualmente no se usa.
  const _id = req.params.id;
  let query = {};

  query['deletedAt'] = getDateTimeFullBD();
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    const comment = await Comment.findByIdAndUpdate({ _id }, query, {
      new: true,
    });
    if (comment) {
      return res.status(200).json({
        success: true,
        data,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Error 500',
      });
    }
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'Not found',
    });
  }
});

router.post('/', ensureToken, cors(), async function (req, res) {
  // Creamos el comentario según los parámetros
  const body = req.body;
  let query = {};
  if (body.comment) {
    query['comment'] = body.comment;
  }

  if (body.meme) {
    query['meme'] = { _id: body.meme };
  }

  query['user'] = getUserByToken(req.headers['authorization']);
  try {
    const comment = new Comment(query);
    // Primero 'armamos' el comentario. Luego verificamos si es un comentario padre o hijo
    let newComment;
    if (body.parent) {
      // Es un comentario hijo. Hay que pushear el array de childrens.
      // Retornamos el comentario padre + todos los hijos
      const commentUpdated = await Comment.findByIdAndUpdate(
        { _id: body.parent },
        { $push: { children: query } },
        { new: true }
      );
      if (!commentUpdated) {
        return res.status(500).json({
          success: false,
          message: 'Error 500',
        });
      }
      newComment = commentUpdated;
    } else {
      // No forma parte de un hilo. Retornamos solo ese comentario
      const commentCreated = await comment.save();
      if (!commentCreated) {
        return res.status(500).json({
          success: false,
          message: 'Error 500',
        });
      }
      newComment = commentCreated;
    }

    await Meme.findByIdAndUpdate(
      { _id: query['meme']._id },
      { $inc: { comments: 1 } }
    );

    return res.status(200).json({
      success: true,
      data: newComment,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Error 500',
    });
  }
});

export default router;
