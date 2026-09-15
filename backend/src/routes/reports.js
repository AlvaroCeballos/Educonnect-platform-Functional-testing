const router = require('express').Router();
const { authenticateJWT, authorizeAdmin } = require('../middlewares/authJWT');
const { getTopTutorsReport, getSubjectsDemandReport } = require('../controllers/adminUserController');

router.use(authenticateJWT, authorizeAdmin);

// HU-026: Reporte de tutores con más estudiantes
router.get('/tutors-demand', getTopTutorsReport);
router.get('/top-tutors', getTopTutorsReport);

// HU-027: Reporte de materias con mayor demanda
router.get('/subjects-demand', getSubjectsDemandReport);
router.get('/top-subjects', getSubjectsDemandReport);

module.exports = router;