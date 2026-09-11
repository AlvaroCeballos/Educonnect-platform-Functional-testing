require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'EduConnect API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth'));

app.listen(PORT, () => {
  console.log(` EduConnect API corriendo en http://localhost:${PORT}`);
});
