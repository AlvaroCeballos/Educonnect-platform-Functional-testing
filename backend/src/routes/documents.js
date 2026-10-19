const router = require('express').Router();
const {
  streamStaticPdf,
  streamTutorCvPdf,
  streamStudentCarnetPdf,
} = require('../controllers/documentController');

router.get('/test', streamStaticPdf);
router.get('/cvs/:filename', streamTutorCvPdf);
router.get('/carnets/:filename', streamStudentCarnetPdf);

module.exports = router;