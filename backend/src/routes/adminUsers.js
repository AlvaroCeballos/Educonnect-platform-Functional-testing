const router = require('express').Router();
const { authenticateJWT, authorizeAdmin } = require('../middlewares/authJWT');
const { listUsers, updateUserStatus } = require('../controllers/adminUserController');

router.use(authenticateJWT, authorizeAdmin);
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);
router.put('/users/:id/status', updateUserStatus);

module.exports = router;
