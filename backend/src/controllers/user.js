import express from 'express';
import { getDateTimeFullBD, ensureToken } from '../helpers.js';
import User from '../models/User';
import * as bcrypt from 'bcrypt';
const router = express.Router();
const cors = require('cors');

router.get('/', async function (req, res) {
  // Armamos el query según qué parámetros hay que filtrar
  const body = req.query;
  let query = {};

  if (body.name) {
    query['name'] = body.name;
  }
  if (body.mail) {
    query['mail'] = body.mail;
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
  await User.find(query, null, { limit, skip }, (err, data) => {
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
    // Buscamos al user y que no esté eliminado
    await User.findById({ _id: req.params.id }, (err, data) => {
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

router.get('/photo/:id', async function (req, res) {
  // Retorna solamente el string del patch de la foto del user
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    await User.findById({ _id: req.params.id }, (err, data) => {
      if (data) {
        if (!data.deletedAt) {
          return res.status(200).send(data.image);
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
  // Utiliza el middleware para verificar que pueda realizar esta accion
  // Modulo para actualizar al user según que parámetros le enviamos. Actualmente no se usa.
  const _id = req.params.id;
  const body = req.query;

  let query = {};
  if (body.name) {
    query['name'] = body.name;
  }
  if (body.mail) {
    query['mail'] = body.mail;
  }

  if (body.password) {
    query['password'] = body.password;
  }

  if (body.imagen) {
    query['imagen'] = body.imagen;
  }

  if (body.dob) {
    query['dob'] = body.dob;
  }
  query['updatedAt'] = getDateTimeFullBD();
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    await User.findByIdAndUpdate({ _id }, query, { new: true }, (err, data) => {
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

router.delete('/:id', ensureToken, async function (req, res) {
  const _id = req.params.id;
  let query = {};

  query['deletedAt'] = getDateTimeFullBD();
  // Try y catch ya que si no encuentra el documento, da error y entra al catch
  try {
    await User.findByIdAndUpdate({ _id }, query, { new: true }, (err, data) => {
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
  // Armamos la query según qué parametros llegan
  const body = req.query;
  let query = {};
  if (body.name) {
    query['name'] = body.name;
  }
  if (body.mail) {
    query['mail'] = body.mail;
  }
  if (body.password) {
    query['password'] = bcrypt.hashSync(body.password, 10);
  }
  if (body.dob) {
    query['dob'] = body.dob;
  }
  if (body.image) {
    query['image'] = body.image;
  }

  const user = new User(query);
  await user.save((err, data) => {
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
