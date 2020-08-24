import express from 'express';
import { getJsonByUrl, URL_BASE } from '../helpers.js';

const router = express.Router();

router.get('/', async function (req, res) {
  res.json({ mensaje: 'Api works' });
});

router.get('/:id', async function (req, res) {
  res.json({ mensaje: 'Api works' });
});

router.put('/:id', async function (req, res) {
  res.json({ mensaje: 'Api works' });
});

router.delete('/:id', async function (req, res) {
  res.json({ mensaje: 'Api works' });
});

router.post('/', function (req, res) {
  res.json({ mensaje: 'Api works' });
});

export default router;
