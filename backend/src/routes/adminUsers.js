const router = require('express').Router();
const { authenticateJWT, authorizeAdmin } = require('../middlewares/authJWT');
const {
  listUsers,
  updateUserStatus,
  disableUser,
  getTopTutorsReport,
  updateStudentProfileByAdmin,
} = require('../controllers/adminUserController');

router.use(authenticateJWT, authorizeAdmin);
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);
router.put('/users/:id/status', updateUserStatus);
router.patch('/users/:id/disable', disableUser);
router.put('/users/:id/disable', disableUser);

// HU-041: Edición de perfil de estudiantes por Administrador (correo inmutable)
router.put('/users/:id/student-profile', updateStudentProfileByAdmin);
router.put('/students/:id', updateStudentProfileByAdmin);

// HU-026: Reporte de demanda de tutores
router.get('/reports/top-tutors', getTopTutorsReport);
router.get('/reports/tutors-demand', getTopTutorsReport);

module.exports = router;
