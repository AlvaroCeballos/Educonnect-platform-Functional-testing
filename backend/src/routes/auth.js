const router = require('express').Router();
const { registerStudent , loginAdmin } = require('../controllers/authController');

// HU-001: Registro de estudiante
router.post('/register/student', registerStudent);

router.post('/login/admin', loginAdmin); // login admin

module.exports = router;