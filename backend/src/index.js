const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'EduConnect API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/adminUsers'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/tutors', require('./routes/tutors'));
app.use('/api/sessions', require('./routes/sessions'));

app.listen(PORT, () => {
  console.log(` EduConnect API corriendo en http://localhost:${PORT}`);
});
