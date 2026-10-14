const router = require('express').Router();
const { authenticate, mockStudent } = require('../middlewares/auth');
const { getMyRatings, createRating } = require('../controllers/ratingController');

const studentAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    return authenticate(req, res, () => {
      if (req.user?.role === 'student') return next();
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    });
  }
  return mockStudent(req, res, next);
};

router.get('/me', studentAuth, getMyRatings);
router.post('/sessions/:sessionId', studentAuth, createRating);

module.exports = router;
