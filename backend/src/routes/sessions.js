const router = require('express').Router();
const { 
  createSession, 
  getMySessions, 
  cancelSession, 
  cancelSessionByTutor,
  getTutorSessions,
  attendSession
} = require('../controllers/sessionController');
const { authenticate, mockStudent, mockTutor } = require('../middlewares/auth');

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

// Rutas de Estudiante
router.post('/', studentAuth, createSession);
router.get('/me', studentAuth, getMySessions);
router.patch('/:id/cancel', studentAuth, cancelSession);

// Rutas de Tutor
router.get('/tutor/me', tutorAuth, getTutorSessions); // T-015.3: GET para el historial
router.patch('/:id/cancel/tutor', tutorAuth, cancelSessionByTutor);
router.patch('/:id/attend', tutorAuth, attendSession); // T-015.3: PATCH para marcar atencion

module.exports = router;