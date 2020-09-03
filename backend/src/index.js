import express from 'express';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('./connection');
const app = express();
// Cuando salga a produccion, setear la primer variable que va a leer las claves de otro script
// Por ahora lee de development
const NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${NODE_ENV}`,
});
import categoryRoutes from './controllers/category';
import commentRoutes from './controllers/comment';
import memeRoutes from './controllers/meme';
import userRoutes from './controllers/user';
import voteRoutes from './controllers/vote';
import User from './models/User';

app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/memes', memeRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/votes', voteRoutes);

app.get('/', async function (req, res) {
  res.json({ mensaje: 'Bienvenido a memerezco10' });
});

app.listen(process.env.PORT_BACKEND, () => {
  console.log(`Server en port ${process.env.PORT_BACKEND}`);
});

app.post('/api/v1/login', (req, res) => {
  if (req.query && req.query.mail && req.query.password) {
    User.findOne({ mail: req.query.mail }, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        });
      }

      if (!user) {
        return res.status(400).json({
          ok: false,
          err: {
            success: false,
            message: 'mail incorrect',
          },
        });
      }

      if (user.deletedAt) {
        return res.status(400).json({
          ok: false,
          err: {
            success: false,
            message: 'user deleted',
          },
        });
      }

      if (!bcrypt.compareSync(req.query.password, user.password)) {
        return res.status(400).json({
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
        name: user.name,
        token,
      });
    });
  } else {
    return res.status(400).json({
      ok: false,
      err: {
        success: false,
        message: 'insufficient data',
      },
    });
  }
});

app.post('/api/v1/register', function (req, res) {
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
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      success: true,
    });
  });
});
