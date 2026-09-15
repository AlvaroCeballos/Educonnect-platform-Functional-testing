const router = require('express').Router();
const { updateStudentProfile } = require('../controllers/studentProfileController');
const { authenticateJWT } = require('../middlewares/authJWT');

// T-022.2, T-022.4: Actualizar perfil del estudiante
router.put('/me/profile', authenticateJWT, updateStudentProfile);

module.exports = router;
