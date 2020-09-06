import express from 'express';
import { getDateTimeFullBD, ensureToken, getUserByToken } from '../helpers.js';
import Comment from '../models/Comment';
import Meme from '../models/Meme';

const router = express.Router();
const cors = require('cors');

router.get('/', async function (req, res) {
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
  await Comment.find(query, null, { limit, skip }, (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }

    if (data) {
      return res.status(200).json({
        success: true,
        data,
      });
    }
  });
});

router.get('/:id', async function (req, res) {
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    await Comment.findById({ _id: req.params.id }, (err, data) => {
      if (data) {
        if (!data.deletedAt) {
          return res.status(200).json({
            success: true,
            data,
          });
        } else {
          return res.status(404).json({
            success: false,
            message: 'Not found',
          });
        }
      }
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'Not found',
    });
  }
});

router.put('/:id', ensureToken, async function (req, res) {
  res.json({ mensaje: 'Api works' });
});

router.delete('/:id', ensureToken, async function (req, res) {
  const _id = req.params.id;
  let query = {};

  query['deletedAt'] = getDateTimeFullBD();
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    await Comment.findByIdAndUpdate(
      { _id },
      query,
      { new: true },
      (err, data) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Error 500',
          });
        }
        if (data) {
          return res.status(200).json({
            success: true,
            data,
          });
        }
      }
    );
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'Not found',
    });
  }
});

router.post('/', ensureToken, cors(), async function (req, res) {
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
    let newComment;
    if (body.parent) {
      Comment.findByIdAndUpdate(
        { _id: body.parent },
        { $push: { children: query } },
        (err, data) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: 'Error 500',
            });
          }

          newComment = data;
        }
      );
    } else {
      // No forma parte de un hilo
      await comment.save((err, data) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            err,
          });
        }
        newComment = data;
      });
    }

    Meme.findByIdAndUpdate(
      { _id: query['meme']._id },
      { $inc: { comments: 1 } },
      (err, data) => {}
    );

    return res.status(200).json({
      success: true,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'Error 500',
    });
  }
});

export default router;
