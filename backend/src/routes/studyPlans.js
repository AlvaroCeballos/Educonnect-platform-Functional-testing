const router = require('express').Router();
const { createStudyPlan, getMyStudyPlans, downloadCertificate } = require('../controllers/studyPlanController');
const { authenticate, mockTutor, mockStudent } = require('../middlewares/auth');

const tutorAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticate(req, res, () => {
      if (req.user && req.user.role === 'tutor') return next();
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    });
  }
  return mockTutor(req, res, next);
};

const studentAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authenticate(req, res, () => {
      if (req.user && req.user.role === 'student') return next();
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    });
  }
  return mockStudent(req, res, next);
};

router.post('/', tutorAuth, createStudyPlan);
router.get('/me', studentAuth, getMyStudyPlans);
router.get('/:planId/certificate', studentAuth, downloadCertificate);

module.exports = router;
