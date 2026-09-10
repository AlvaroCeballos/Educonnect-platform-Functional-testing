const router = require('express').Router();
const { registerStudent } = require('../controllers/authController');

// HU-001: Registro de estudiante
router.post('/register/student', registerStudent);

module.exports = router;