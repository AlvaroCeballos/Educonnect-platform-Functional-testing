const router = require('express').Router();
const {
  getTutors,
  getTutorSchedules,
  getTutorSubjects,
  getTutorAvailability, 
  getAllSubjects,
} = require('../controllers/tutorController');
const { authenticate, authorize } = require('../middlewares/auth');
const { getMyProfile, updateMyProfile } = require('../controllers/tutorProfileController');
const { getMySchedules, saveMySchedules, updateMySchedules } = require('../controllers/scheduleController');

// Rutas autenticadas de tutor — deben ir antes de las rutas públicas con
// parámetro (`/:id/...`), porque si no Express matchea "me" como si fuera
// un :id (ej. GET /tutors/me/schedules caía en GET /tutors/:id/schedules).
router.get('/me/profile', authenticate, authorize('tutor'), getMyProfile);
router.put('/me/profile', authenticate, authorize('tutor'), updateMyProfile);
router.get('/me/schedules', authenticate, authorize('tutor'), getMySchedules);
router.post('/me/schedules', authenticate, authorize('tutor'), saveMySchedules);
router.put('/me/schedules', authenticate, authorize('tutor'), updateMySchedules);

// Rutas públicas
router.get('/', getTutors);
router.get('/subjects-catalog', getAllSubjects);
router.get('/:id/schedules', getTutorSchedules);
router.get('/:id/subjects', getTutorSubjects);
router.get('/:id/availability', getTutorAvailability);

module.exports = router;