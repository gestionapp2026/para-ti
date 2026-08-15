const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Endpoint pensado para monitores externos como UptimeRobot
router.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = conectado
  res.status(200).json({
    status: 'ok',
    db: dbState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
