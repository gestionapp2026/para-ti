require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./src/config/db');
const healthRoutes = require('./src/routes/health');
const authRoutes = require('./src/routes/auth');
const entriesRoutes = require('./src/routes/entries');
const pointsRoutes = require('./src/routes/points');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
  })
);

// Limite alto para admitir imagenes en base64 dentro del JSON
app.use(express.json({ limit: '15mb' }));

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', entriesRoutes);
app.use('/api', pointsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo conectar a MongoDB', err);
    process.exit(1);
  });
