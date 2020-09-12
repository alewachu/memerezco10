import moment from 'moment';
import jwt from 'jsonwebtoken';

// Function para verificar que exista un token, y que sea válido (middleware)
export const ensureToken = (req, res, next) => {
  if (typeof req.headers['authorization'] !== 'undefined') {
    const bearer = req.headers['authorization'].split(' ');
    jwt.verify(bearer[1], process.env.JWT_SECRET_KEY, (err, data) => {
      if (err) {
        res.sendStatus(403);
      } else {
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};

export const getDateTimeFullBD = () => {
  // Retorna fecha para la bd con formato 2020-06-25 08:00:00
  return moment().utcOffset('-06:00').format('YYYY-MM-DD HH:mm:ss');
};
// A traves del token, decodificamos el obj user
export const getUserByToken = (authorization) => {
  const bearer = authorization.split(' ');
  let user = {};
  jwt.verify(bearer[1], process.env.JWT_SECRET_KEY, (err, data) => {
    user = {
      name: data.name,
      _id: data.id,
    };
  });
  return user;
};
