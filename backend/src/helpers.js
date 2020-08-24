import fetch from 'node-fetch';
export const URL_BASE = 'https://jsonplaceholder.typicode.com';
export const getJsonByUrl = (url) => {
  return fetch(url).then(async (response) => response.json());
};
export const ensureToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  console.log(bearerHeader);
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};
