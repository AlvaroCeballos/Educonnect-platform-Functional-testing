const router = require('express').Router();
const { 
  createSession, 
  getMySessions, 
  cancelSession, 
  cancelSessionByTutor 
} = require('../controllers/sessionController');
const { authenticate, mockStudent, mockTutor } = require('../middlewares/auth');

// Autenticación flexible: usa JWT si viene token, o mockStudent para compatibilidad previa
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

// HU-012: Programar sesión de tutoría
router.post('/', studentAuth, createSession);

// Contrato compartido con HU-016/HU-013: sesiones del estudiante autenticado
router.get('/me', studentAuth, getMySessions);

// HU-016: Cancelar sesión por el estudiante
router.patch('/:id/cancel', studentAuth, cancelSession);

// HU-017: Cancelar sesión por el tutor
router.patch('/:id/cancel/tutor', tutorAuth, cancelSessionByTutor);

module.exports = router;
