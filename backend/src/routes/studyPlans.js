const router = require('express').Router();
const { createStudyPlan } = require('../controllers/studyPlanController');
const { authenticate, mockTutor } = require('../middlewares/auth');

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

router.post('/', tutorAuth, createStudyPlan);

module.exports = router;
