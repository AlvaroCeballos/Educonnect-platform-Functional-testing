const router = require('express').Router();
const multer = require('multer');
const { registerStudent, loginAdmin, loginAdmin2FA } = require('../controllers/authController');
const { registerTutor } = require('../controllers/tutorAuthController');
const { loginTutor } = require('../controllers/tutorLoginController');
const { uploadTutorPhoto } = require('../middlewares/tutorPhoto');
const { authenticateJWT, authorizeAdmin } = require('../middlewares/authJWT');

// Configurar multer para procesar archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.originalname !== 'auth2-ayd1.txt') {
      cb(new Error('Solo se permite auth2-ayd1.txt'));
    } else {
      cb(null, true);
    }
  },
});

// HU-001: Registro de estudiante
router.post('/register/student', registerStudent);

// HU-003 Fase 1: Login de administrador
router.post('/login/admin', loginAdmin);

// HU-003 Fase 2: Validación del archivo 2FA
router.post('/login/admin/2fa', upload.single('auth2fa'), loginAdmin2FA);

// HU-003 T-003.3: Verificar acceso admin (ruta protegida)
router.get('/admin/profile', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    return res.status(200).json({
      message: 'Acceso autorizado a admin',
      user: req.user,
    });
  } catch (err) {
    console.error('Error en admin profile:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

//  HU-002: Registro de tutor
router.post('/register/tutor', uploadTutorPhoto.single('foto'), registerTutor);

// HU-007: Login de tutor
router.post('/login/tutor', loginTutor);

module.exports = router;
