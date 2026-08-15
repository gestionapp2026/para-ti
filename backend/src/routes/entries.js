const express = require('express');
const Entry = require('../models/Entry');
const { requireAdmin, checkGirlfriendCode } = require('../middleware/auth');

const router = express.Router();

const VALID_TYPES = ['letter', 'phrase', 'collage'];

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

// Publica (vista novia): entradas de un dia concreto, por defecto hoy
router.get('/entries', checkGirlfriendCode, async (req, res, next) => {
  try {
    const date = req.query.date || todayString();
    const entries = await Entry.find({ date }).sort({ createdAt: 1 });
    res.json({ date, entries });
  } catch (err) {
    next(err);
  }
});

// Admin: listado completo, mas reciente primero
router.get('/entries/all', requireAdmin, async (req, res, next) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    res.json({ entries });
  } catch (err) {
    next(err);
  }
});

// Admin: crear carta, frase o collage
router.post('/entries', requireAdmin, async (req, res, next) => {
  try {
    const { type, title, content, images, date } = req.body || {};

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Tipo invalido' });
    }

    const entry = await Entry.create({
      type,
      title: title || '',
      content: content || '',
      images: Array.isArray(images) ? images.slice(0, 20) : [],
      date: date || todayString(),
    });

    res.status(201).json({ entry });
  } catch (err) {
    next(err);
  }
});

// Admin: borrar una entrada
router.delete('/entries/:id', requireAdmin, async (req, res, next) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
