import express from 'express';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
const router = express.Router();
const cors = require('cors');
router.post('/login', cors(), (req, res) => {
  // Verificamos todo tipo de errores, mail o password incorrect, usuario eliminado.
  // Para lograr una mejor respuesta para el usuario
  if (req.body && req.body.mail && req.body.password) {
    User.findOne({ mail: req.body.mail }, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        });
      }

      if (!user) {
        return res.status(200).json({
          ok: false,
          err: {
            success: false,
            message: 'mail incorrect',
          },
        });
      }

      if (user.deletedAt) {
        return res.status(200).json({
          ok: false,
          err: {
            success: false,
            message: 'user deleted',
          },
        });
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(200).json({
          ok: false,
          err: {
            success: false,
            message: 'password failed',
          },
        });
      }

      const token = jwt.sign(
        { id: user._id, name: user.name, mail: user.mail },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.EXPIRES_TOKEN,
        }
      );
      res.json({
        success: true,
        user: { name: user.name, mail: user.mail, id: user._id },
        token,
      });
    });
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
router.post('/register', function (req, res) {
  const body = req.body;
  let query = {};
  if (body.name) {
    query['name'] = body.name;
  }
  if (body.mail) {
    query['mail'] = body.mail;
  }
  if (body.password) {
    // Usamos metodo de hasheado de bcrypt.
    // El segundo parametro es la cantidad de "salt rounds"
    query['password'] = bcrypt.hashSync(body.password, 10);
  }
  if (body.dob) {
    query['dob'] = body.dob;
  }
  if (body.image) {
    query['image'] = body.image;
  }

  const user = new User(query);
  user.save((err, user) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    res.json({
      success: true,
    });
  });
});
export default router;
