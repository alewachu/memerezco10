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
  let memes = [];
  const data = await Meme.find(query, null, { sort, limit, skip });

  if (data) {
    if (req.headers['authorization']) {
      // Logueado
      const user = getUserByToken(req.headers['authorization']);

      for (let i = 0; i < data.length; i++) {
        const meme = data[i].toJSON();

        const vote = await Vote.find({
          'meme._id': meme.id,
          'user._id': user._id,
          deletedAt: null,
        });
        if (vote && vote.length > 0) {
          if (typeof vote[0].positive !== 'undefined') {
            meme['positive'] = vote[0].positive;
            meme['idVote'] = vote[0]._id;
          } else {
            meme.positive = null;
          }
        } else {
          meme.positive = null;
        }
        memes = [...memes, meme];
      }
    } else {
      // isnt logging
      memes = data;
    }

    res.status(200).json({
      success: true,
      data: memes,
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
    const meme = await Meme.findById({ _id: req.params.id });
    const memeJson = meme.toJSON();
    if (meme) {
      if (!meme.deletedAt) {
        if (req.headers['authorization']) {
          // Logueado
          const user = getUserByToken(req.headers['authorization']);

          const vote = await Vote.find({
            'meme._id': meme.id,
            'user._id': user._id,
            deletedAt: null,
          });

          if (vote && vote.length > 0) {
            if (typeof vote[0].positive !== 'undefined') {
              memeJson['positive'] = vote[0].positive;
              memeJson['idVote'] = vote[0]._id;
            } else {
              memeJson.positive = null;
            }
          } else {
            memeJson.positive = null;
          }
        }

        const comments = await Comment.find({ 'meme._id': meme.id });

        if (comments && comments.length > 0) {
          memeJson.allComments = comments;
        } else {
          memeJson.allComments = null;
        }
      }
      return res.status(200).json({
        success: true,
        data: memeJson,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Not found',
      });
    }
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
    const meme = await Meme.findByIdAndUpdate({ _id }, query, { new: true });
    if (!meme) {
      return res.status(500).json({
        success: false,
        message: 'Error 500',
      });
    }
    if (meme) {
      return res.status(200).json({
        success: true,
        data: meme,
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
  const body = req.body;
  let query = {};
  if (body.title) {
    query['title'] = body.title;
  }
  if (body.image) {
    query['image'] = body.image;
  }
  if (body.category) {
    query['category'] = body.category;
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
