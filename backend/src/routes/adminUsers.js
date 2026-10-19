const router = require('express').Router();
const { authenticateJWT, authorizeAdmin } = require('../middlewares/authJWT');
const {
  listUsers,
  listPendingStudents,
  listPendingTutors,
  updateStudentStatus,
  updateUserStatus,
  updateTutorStatus,
  disableUser,
  getTopTutorsReport,
  updateStudentProfileByAdmin,
  updateTutorProfileByAdmin,
  listTutorIncidents,
  resolveTutorIncident,
} = require('../controllers/adminUserController');

router.use(authenticateJWT, authorizeAdmin);
router.get('/students/pending', listPendingStudents);
router.put('/students/:id/status', updateStudentStatus);
router.get('/tutors/pending', listPendingTutors);
router.put('/tutors/:id/status', updateTutorStatus);
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);
router.put('/users/:id/status', updateUserStatus);
router.patch('/users/:id/disable', disableUser);
router.put('/users/:id/disable', disableUser);

// HU-041: Edición de perfil de estudiantes por Administrador (correo inmutable)
router.put('/users/:id/student-profile', updateStudentProfileByAdmin);
router.put('/students/:id', updateStudentProfileByAdmin);

// HU-042: Edición de perfil de tutores por Administrador (correo inmutable)
router.put('/users/:id/tutor-profile', updateTutorProfileByAdmin);
router.put('/tutors/:id', updateTutorProfileByAdmin);

// HU-043: Panel de moderación y denuncias contra tutores
router.get('/reports/tutors', listTutorIncidents);
router.get('/incidents/tutors', listTutorIncidents);
router.patch('/reports/:id/resolve', resolveTutorIncident);
router.put('/reports/:id/resolve', resolveTutorIncident);
router.patch('/incidents/:id/resolve', resolveTutorIncident);
router.put('/incidents/:id/resolve', resolveTutorIncident);

// HU-026: Reporte de demanda de tutores
router.get('/reports/top-tutors', getTopTutorsReport);
router.get('/reports/tutors-demand', getTopTutorsReport);

module.exports = router;
