const router = require('express').Router();
const { registerStudent } = require('../controllers/authController');
const { registerTutor } = require('../controllers/tutorAuthController');
const { uploadTutorPhoto } = require('../middlewares/tutorPhoto');

// HU-001: Registro de estudiante
router.post('/register/student', registerStudent);

// HU-002: Registro de tutor con fotografia obligatoria
router.post('/register/tutor', uploadTutorPhoto.single('fotografia'), registerTutor);

module.exports = router;
