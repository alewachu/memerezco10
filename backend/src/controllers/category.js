import express from 'express';
import { getDateTimeFullBD, ensureToken } from '../helpers.js';
import Category from '../models/Category';

const router = express.Router();
const cors = require('cors');

router.get('/', async function (req, res) {
  const body = req.query;
  let query = {};

  if (body.name) {
    query['name'] = body.name;
  }
  if (body.slug) {
    query['slug'] = body.slug;
  }
  if (body.createdAt) {
    query['createdAt'] = body.createdAt;
  }
  if (body.updatedAt) {
    query['updatedAt'] = body.updatedAt;
  }

  const skip = body.skip ? parseInt(body.skip) : 0;
  const limit = body.limit ? parseInt(body.limit) : 5;

  query['deletedAt'] = null; // No busque eliminados
  await Category.find(query, null, { limit, skip }, (err, data) => {
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
    await Category.findById({ _id: req.params.id }, (err, data) => {
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
    await Category.findByIdAndUpdate(
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

router.post('/', cors(), ensureToken, async function (req, res) {
  const body = req.query;
  let query = {};
  if (body.name) {
    query['name'] = body.name;
  }
  if (body.slug) {
    query['slug'] = body.slug;
  }
  if (body.description) {
    query['description'] = body.description;
  }

  const category = new Category(query);
  await category.save((err, data) => {
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
