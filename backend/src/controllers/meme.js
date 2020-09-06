import express from 'express';
import { getDateTimeFullBD, ensureToken, getUserByToken } from '../helpers.js';
import Meme from '../models/Meme';
import Vote from '../models/Vote';
import Comment from '../models/Comment';

const router = express.Router();
const cors = require('cors');

router.get('/', async function (req, res) {
  const body = req.query;
  let query = {};

  if (body.title) {
    query['title'] = body.title;
  }
  if (body.image) {
    query['image'] = body.image;
  }
  if (body.upvotes) {
    query['upvotes'] = body.upvotes;
  }
  if (body.downvotes) {
    query['downvotes'] = body.downvotes;
  }
  if (body.comments) {
    query['comments'] = body.comments;
  }
  if (body.createdAt) {
    query['createdAt'] = body.createdAt;
  }
  if (body.updatedAt) {
    query['updatedAt'] = body.updatedAt;
  }

  if (body.category) {
    query['category._id'] = body.category;
  }

  if (body.user) {
    query['user._id'] = body.user;
  }

  const skip = body.skip ? parseInt(body.skip) : 0;
  const limit = body.limit ? parseInt(body.limit) : 5;

  // Verificamos si debemos ordenar de alguna manera, y lo agregamos
  let sort = {};
  if (body.sort) {
    sort[body['sort']] = -1;
  } else {
    sort = { _id: -1 };
  }

  query['deletedAt'] = null; // No busque eliminados
  let memes;
  await Meme.find(query, null, { sort, limit, skip }, async (err, data) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
    memes = JSON.parse(JSON.stringify(data));

    if (data) {
      if (req.headers['authorization']) {
        // Logueado
        const user = getUserByToken(req.headers['authorization']);

        for (let i = 0; i < memes.length; i++) {
          const meme = memes[i];
          console.log(meme);
          await Vote.find(
            { 'meme._id': meme._id, 'user._id': user._id },
            async (err, data) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: 'Error 500',
                });
              }
              // cambiar por _id hardcodeado
              if (data && data.length > 0) {
                if (typeof data[0].positive !== 'undefined') {
                  meme['positive'] = data[0].positive;
                } else {
                  meme.positive = null;
                }
              } else {
                meme.positive = null;
              }
            }
          );
        }
      }

      res.status(200).json({
        success: true,
        data: memes,
      });
    }
  });
});

router.get('/:id', async function (req, res) {
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    await Meme.findById({ _id: req.params.id }, async (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Error 500',
        });
      }
      if (data) {
        if (!data.deletedAt) {
          const meme = JSON.parse(JSON.stringify(data));
          await Comment.find(
            { 'meme._id': meme._id },
            async (err, comments) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: 'Error 500',
                });
              }
              if (comments && comments.length > 0) {
                meme.allComments = comments;
              }
            }
          );
          return res.status(200).json({
            success: true,
            data: meme,
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
  res.json({ mensaje: 'Api works' });
  const _id = req.params.id;
  let query = {};

  query['deletedAt'] = getDateTimeFullBD();
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    await Meme.findByIdAndUpdate({ _id }, query, { new: true }, (err, data) => {
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
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'Not found',
    });
  }
});

router.post('/', ensureToken, cors(), async function (req, res) {
  const body = req.query;
  let query = {};
  if (body.title) {
    query['title'] = body.title;
  }
  if (body.image) {
    query['image'] = body.image;
  }
  if (body.category) {
    query['category'] = JSON.parse(body.category);
  }

  query['user'] = getUserByToken(req.headers['authorization']);

  const meme = new Meme(query);
  await meme.save((err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    return res.status(200).json({
      success: true,
      data,
    });
  });
});

export default router;
