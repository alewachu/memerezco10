import express from 'express';
const jwt = require('jsonwebtoken');

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
import { getJsonByUrl, URL_BASE, ensureToken } from './helpers.js';

app.use('/category', categoryRoutes);
app.use('/comment', commentRoutes);
app.use('/meme', memeRoutes);
app.use('/user', userRoutes);
app.use('/vote', voteRoutes);

app.get('/', function (req, res) {
  res.json({ mensaje: 'Bienvenido a memerezco10' });
});

app.listen(process.env.PORT_BACKEND, () => {
  console.log(`Server en port ${process.env.PORT_BACKEND}`);
});

app.post('/api/login', (req, res) => {
  const user = { id: 3 };
  const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY);
  res.json({
    token,
  });
});

app.get('/api/protected', ensureToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, data) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.send({
        text: 'protected',
        data,
      });
    }
  });
});
