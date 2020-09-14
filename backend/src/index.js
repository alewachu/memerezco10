import express from 'express';
const cors = require('cors');
require('./connection');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// Cuando salga a produccion, setear la primer variable que va a leer las claves de otro script
// Por ahora lee de development
const NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${NODE_ENV}`,
});

// Definimos rutas
import authRoutes from './controllers/auth';
import categoryRoutes from './controllers/category';
import commentRoutes from './controllers/comment';
import memeRoutes from './controllers/meme';
import userRoutes from './controllers/user';
import voteRoutes from './controllers/vote';
import User from './models/User';
app.use('/auth', authRoutes);
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
