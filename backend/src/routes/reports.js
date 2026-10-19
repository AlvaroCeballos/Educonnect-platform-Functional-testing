const router = require('express').Router();
const { authenticateJWT, authorizeAdmin } = require('../middlewares/authJWT');
const { getTopTutorsReport, getSubjectsDemandReport } = require('../controllers/adminUserController');
const { getTutorRatingsReport, getSessionsEvolutionReport, getCancellationsBySubjectReport, getDemandedSchedulesReport, getStudentRatingsReport } = require('../controllers/metricsController');


router.use(authenticateJWT, authorizeAdmin);

// HU-026: Reporte de tutores con más estudiantes
router.get('/tutors-demand', getTopTutorsReport);
router.get('/top-tutors', getTopTutorsReport);

// HU-027: Reporte de materias con mayor demanda
router.get('/subjects-demand', getSubjectsDemandReport);
router.get('/top-subjects', getSubjectsDemandReport);

// HU-045: promedio de calificaciones de tutores
router.get('/tutors-ratings', getTutorRatingsReport);

// HU-046: promedio de calificaciones de estudiantes
router.get('/students-ratings', getStudentRatingsReport);

// HU-047: evolución temporal de sesiones
router.get('/sessions-evolution', getSessionsEvolutionReport);

// HU-048: reporte analítico F2-2
router.get('/cancellations-by-subject', getCancellationsBySubjectReport);
router.get('/demanded-schedules', getDemandedSchedulesReport);



module.exports = router;