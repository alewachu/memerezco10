import express from 'express';
import { getDateTimeFullBD, ensureToken, getUserByToken } from '../helpers.js';
import Meme from '../models/Meme';
import Vote from '../models/Vote';
const router = express.Router();

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
          await Vote.find(
            { 'meme._id': meme._id, 'user._id': '5f4aaf4eb168d861769a24b8' },
            async (err, data) => {
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
    await Meme.findById({ _id: req.params.id }, (err, data) => {
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

router.post('/', ensureToken, async function (req, res) {
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
