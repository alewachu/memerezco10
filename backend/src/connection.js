const mongoose = require('mongoose');
const NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: `.env.${NODE_ENV}`,
});
mongoose
  .connect(process.env.DB_MONGO_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .catch((err) => console.log(err));

//cuando se inicia la coneccion
mongoose.connection.on('open', (_) => {
  console.log('database is conected to', process.env.DB_MONGO_CONN);
});

//db,once solo una sola vez
mongoose.connection.on('err', (err) => {
  console.log(err);
});
