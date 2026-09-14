const router = require('express').Router();
const { authenticateJWT, authorizeAdmin } = require('../middlewares/authJWT');
const { getTopTutorsReport } = require('../controllers/adminUserController');

// CU-ADM-07: Endpoint para reporte de tutores por demanda
router.use(authenticateJWT, authorizeAdmin);
router.get('/tutors-demand', getTopTutorsReport);
router.get('/top-tutors', getTopTutorsReport);

module.exports = router;
