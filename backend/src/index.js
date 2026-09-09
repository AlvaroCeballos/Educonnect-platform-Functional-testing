require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

// Middlewares globales 
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check (útil para la condición del docker-compose)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'EduConnect API', timestamp: new Date().toISOString() });
});

// Rutas de la API a agregar 

app.listen(PORT, () => {
  console.log(` EduConnect API corriendo en http://localhost:${PORT}`);
});