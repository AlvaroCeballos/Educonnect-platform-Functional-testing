const router = require('express').Router();
const { authenticate, mockStudent, mockTutor } = require('../middlewares/auth');
const { getMyIncidents } = require('../controllers/incidentController');

const studentAuth = (req, res, next) => {
  if (req.headers.authorization) {
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

router.get('/me', studentAuth, getMyIncidents('student'));
router.get('/tutor/me', tutorAuth, getMyIncidents('tutor'));
module.exports = router;
