const mongoose = require('mongoose');

mongoose
  .connect(process.env.DB_MONGO_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((err) => console.log(err));

//cuando se inicia la coneccion
mongoose.connection.on('open', (_) => {
  console.log('database is conected to', uri);
});

//db,once solo una sola vez
mongoose.connection.on('err', (err) => {
  console.log(err);
});
