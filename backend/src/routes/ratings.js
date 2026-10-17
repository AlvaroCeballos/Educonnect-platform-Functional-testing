const router = require('express').Router();
const { authenticate, mockStudent, mockTutor } = require('../middlewares/auth');
const {
  getMyRatings,
  createRating,
  getMyStudentRatings,
  createStudentRating,
} = require('../controllers/ratingController');

const studentAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return authenticate(req, res, () => {
      if (req.user?.role === 'student') return next();
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    });
  }
  return mockStudent(req, res, next);
};

const tutorAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, () => {
      if (req.user?.role === 'tutor') return next();
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    });
  }
  return mockTutor(req, res, next);
};

router.get('/me', studentAuth, getMyRatings);
router.post('/sessions/:sessionId', studentAuth, createRating);
router.get('/tutor/me', tutorAuth, getMyStudentRatings);
router.post('/tutor/sessions/:sessionId', tutorAuth, createStudentRating);

module.exports = router;
