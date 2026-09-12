const router = require('express').Router();
const { createSession, getMySessions, cancelSession } = require('../controllers/sessionController');
const { mockStudent } = require('../middlewares/auth');

// TODO(HU-006): reemplazar `mockStudent` por `authenticate, authorize('student')`
// cuando exista el login de estudiante (ver middlewares/auth.js).

// HU-012: Programar sesión de tutoría
router.post('/', mockStudent, createSession);

// Contrato compartido con HU-016/HU-013: sesiones del estudiante autenticado
router.get('/me', mockStudent, getMySessions);

// HU-016: Cancelar sesión por el estudiante
router.patch('/:id/cancel', mockStudent, cancelSession);

module.exports = router;
