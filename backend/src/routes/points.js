const express = require('express');
const PointEvent = require('../models/PointEvent');
const { checkGirlfriendCode } = require('../middleware/auth');

const router = express.Router();

// Publica (protegida por codigo opcional de novia): total + mini historial
router.get('/points', checkGirlfriendCode, async (req, res, next) => {
  try {
    const [totalAgg] = await PointEvent.aggregate([
      { $group: { _id: null, total: { $sum: '$delta' } } },
    ]);
    const total = totalAgg ? totalAgg.total : 0;

    const history = await PointEvent.find().sort({ createdAt: -1 }).limit(50);

    res.json({ total, history });
  } catch (err) {
    next(err);
  }
});

// Publica (protegida por codigo opcional de novia): sumar o restar puntos
router.post('/points', checkGirlfriendCode, async (req, res, next) => {
  try {
    const { delta, reason } = req.body || {};
    const numericDelta = Number(delta);

    if (!Number.isFinite(numericDelta) || numericDelta === 0) {
      return res.status(400).json({ error: 'delta invalido' });
    }
    if (numericDelta > 100 || numericDelta < -100) {
      return res.status(400).json({ error: 'delta fuera de rango' });
    }

    const event = await PointEvent.create({
      delta: numericDelta,
      reason: (reason || '').slice(0, 300),
    });

    const [totalAgg] = await PointEvent.aggregate([
      { $group: { _id: null, total: { $sum: '$delta' } } },
    ]);
    const total = totalAgg ? totalAgg.total : 0;

    res.status(201).json({ event, total });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
