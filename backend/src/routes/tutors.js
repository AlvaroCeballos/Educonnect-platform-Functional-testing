const router = require('express').Router();
const {
  getTutors,
  getTutorSchedules,
  getTutorSubjects,
} = require('../controllers/tutorController');
const { authenticate, authorize } = require('../middlewares/auth');
const { getMyProfile, updateMyProfile } = require('../controllers/tutorProfileController');

// Contratos compartidos para disponibilidad y programacion de sesiones.
router.get('/', getTutors);
router.get('/me/profile', authenticate, authorize('tutor'), getMyProfile);
router.put('/me/profile', authenticate, authorize('tutor'), updateMyProfile);
router.get('/:id/schedules', getTutorSchedules);
router.get('/:id/subjects', getTutorSubjects);

module.exports = router;
