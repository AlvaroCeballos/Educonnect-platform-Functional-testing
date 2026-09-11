const router = require('express').Router();
const {
  getTutors,
  getTutorSchedules,
  getTutorSubjects,
} = require('../controllers/tutorController');

// Contratos compartidos para disponibilidad y programacion de sesiones.
router.get('/', getTutors);
router.get('/:id/schedules', getTutorSchedules);
router.get('/:id/subjects', getTutorSubjects);

module.exports = router;
