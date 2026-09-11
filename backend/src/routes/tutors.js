const router = require('express').Router();
const {
  getTutors,
  getTutorSchedules,
  getTutorSubjects,
} = require('../controllers/tutorController');
const { authenticate, authorize } = require('../middlewares/auth');
const { getMySchedules, saveMySchedules, updateMySchedules } = require('../controllers/scheduleController');

// Contratos compartidos para disponibilidad y programacion de sesiones.
router.get('/', getTutors);
router.get('/me/schedules', authenticate, authorize('tutor'), getMySchedules);
router.post('/me/schedules', authenticate, authorize('tutor'), saveMySchedules);
router.put('/me/schedules', authenticate, authorize('tutor'), updateMySchedules);
router.get('/:id/schedules', getTutorSchedules);
router.get('/:id/subjects', getTutorSubjects);

module.exports = router;
