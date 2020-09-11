import express from 'express';
import { getDateTimeFullBD, ensureToken, getUserByToken } from '../helpers.js';
import Vote from '../models/Vote';
import Meme from '../models/Meme';

const router = express.Router();
const cors = require('cors');

router.get('/', async function (req, res) {
  const body = req.query;
  let query = {};

  if (body.positive) {
    query['positive'] = body.positive;
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

  query['deletedAt'] = null; // No busque eliminados
  const votes = await Vote.find(query, null, { limit, skip });
  if (!votes) {
    return res.status(500).json({
      success: false,
      message: 'Error 500',
    });
  } else {
    return res.status(200).json({
      success: true,
      data: votes,
    });
  }
});

router.get('/:id', async function (req, res) {
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    const vote = await Vote.findById({ _id: req.params.id });
    if (vote) {
      if (!vote.deletedAt) {
        return res.status(200).json({
          success: true,
          data: vote,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Not found',
        });
      }
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
  const _id = req.params.id;
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    const vote = await Vote.find({ _id, deletedAt: null });
    if (!vote) {
      return res.status(500).json({
        success: false,
        message: 'Error 500',
      });
    }

    if (vote && vote.length > 0) {
      const queryUpdateMeme = parseInt(vote[0].positive)
        ? { upvotes: -1, downvotes: +1 }
        : { upvotes: 1, downvotes: -1 };

      const memeUpdated = await Meme.findByIdAndUpdate(
        { _id: vote[0].meme._id },
        { $inc: queryUpdateMeme }
      );
      if (!memeUpdated) {
        return res.status(500).json({
          success: false,
          message: 'Error 500',
        });
      }

      const queryUpdateVote = parseInt(vote[0].positive)
        ? { positive: 0 }
        : { positive: 1 };

      const voteUpdated = await Vote.findByIdAndUpdate(
        { _id },
        queryUpdateVote,
        { new: true }
      );
      if (!voteUpdated) {
        return res.status(500).json({
          success: false,
          message: 'Error 500',
        });
      }
      return res.status(200).json({
        success: true,
        data: vote,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Vote deleted',
      });
    }
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'Not found',
    });
  }
});

router.delete('/:id', ensureToken, async function (req, res) {
  const _id = req.params.id;
  let query = {};

  query['deletedAt'] = getDateTimeFullBD();
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    const vote = await Vote.findOneAndUpdate({ _id, deletedAt: null }, query, {
      new: true,
    });
    if (!vote) {
      return res.status(500).json({
        success: false,
        message: 'Error 500',
      });
    }
    if (vote) {
      const queryUpdateMeme = parseInt(vote.positive)
        ? { upvotes: -1 }
        : { downvotes: -1 };

      const memeUpdated = await Meme.findByIdAndUpdate(
        { _id: vote.meme._id },
        { $inc: queryUpdateMeme },
        (err, memeUpdated) => {}
      );

      return res.status(200).json({
        success: true,
        data: vote,
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'Vote deleted',
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
  if (body.positive !== undefined && body.positive !== null) {
    query['positive'] = body.positive;
  }
  if (body.meme) {
    query['meme'] = { _id: body.meme };
  }

  query['user'] = getUserByToken(req.headers['authorization']);

  if (body.meme && body.positive !== undefined && body.positive !== null) {
    try {
      const querySearchVote = {
        'user._id': query['user']._id,
        'meme._id': query['meme']._id,
        deletedAt: null,
      };
      const vote = await Vote.find(querySearchVote);
      if (!vote) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }
      if (vote.length === 0) {
        const vote = new Vote(query);
        const voteCreated = await vote.save();
        if (!voteCreated) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        const queryUpdateMeme = parseInt(query.positive)
          ? { upvotes: 1 }
          : { downvotes: 1 };
        Meme.findByIdAndUpdate(
          { _id: query['meme']._id },
          { $inc: queryUpdateMeme },
          (err, data) => {}
        );

        return res.status(200).json({
          success: true,
          data: voteCreated,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: 'voto exist',
        });
      }
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: 'Error 500',
      });
    }
  } else {
    return res.status(200).json({
      ok: false,
      err: {
        success: false,
        message: 'insufficient data',
      },
    });
  }
});

export default router;
