const router = require('express').Router();
const { streamStaticPdf } = require('../controllers/documentController');

router.get('/test', streamStaticPdf);

module.exports = router;
