require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const multer  = require('multer');

const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.BACKEND_PORT || process.env.PORT || 5000;

// Middlewares globales 
app.use(cors({ origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check (útil para la condición del docker-compose)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'EduConnect API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'La fotografía no debe superar 5 MB'
      : 'La fotografía debe ser un archivo JPG, PNG o WEBP';
    return res.status(400).json({ message });
  }
  console.error('Error no controlado:', error);
  return res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(` EduConnect API corriendo en http://localhost:${PORT}`);
});
