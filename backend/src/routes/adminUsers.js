const router = require('express').Router();
const { authenticateJWT, authorizeAdmin } = require('../middlewares/authJWT');
const { listUsers, updateUserStatus, disableUser, getTopTutorsReport } = require('../controllers/adminUserController');

router.use(authenticateJWT, authorizeAdmin);
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);
router.put('/users/:id/status', updateUserStatus);
router.patch('/users/:id/disable', disableUser);
router.put('/users/:id/disable', disableUser);

// HU-026: Reporte de demanda de tutores
router.get('/reports/top-tutors', getTopTutorsReport);
router.get('/reports/tutors-demand', getTopTutorsReport);

module.exports = router;
