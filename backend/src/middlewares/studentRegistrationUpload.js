const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const photosDir = path.join(__dirname, '..', '..', 'uploads', 'students');
const carnetsDir = path.join(__dirname, '..', '..', 'uploads', 'documents', 'carnets');

fs.mkdirSync(photosDir, { recursive: true });
fs.mkdirSync(carnetsDir, { recursive: true });

const allowedImageMimes = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const isValidStudentFileMime = (fieldname, mimetype) => {
  if (fieldname === 'fotografia') {
    return Boolean(allowedImageMimes[mimetype]);
  }
  if (fieldname === 'carnet_pdf') {
    return mimetype === 'application/pdf';
  }
  return false;
};

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === 'fotografia') {
      return cb(null, photosDir);
    }
    if (file.fieldname === 'carnet_pdf') {
      return cb(null, carnetsDir);
    }
    return cb(new Error('Campo de archivo no reconocido'));
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'fotografia') {
      const ext = allowedImageMimes[file.mimetype] || '.jpg';
      return cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
    }
    if (file.fieldname === 'carnet_pdf') {
      return cb(null, `${Date.now()}-${crypto.randomUUID()}.pdf`);
    }
    return cb(new Error('Campo de archivo no reconocido'));
  },
});

const fileFilter = (_req, file, cb) => {
  if (!isValidStudentFileMime(file.fieldname, file.mimetype)) {
    const errorMsg =
      file.fieldname === 'carnet_pdf'
        ? 'El carnet escaneado debe ser obligatoriamente un archivo PDF (application/pdf)'
        : 'La fotografía debe ser una imagen válida (JPG, PNG o WEBP)';
    const err = new Error(errorMsg);
    err.status = 400;
    return cb(err, false);
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).fields([
  { name: 'fotografia', maxCount: 1 },
  { name: 'carnet_pdf', maxCount: 1 },
]);

const uploadStudentRegistrationFiles = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'Los archivos no deben superar los 5 MB' });
      }
      return res.status(400).json({ message: `Error al subir archivos: ${err.message}` });
    }
    if (err) {
      return res.status(err.status || 400).json({ message: err.message });
    }
    return next();
  });
};

module.exports = {
  uploadStudentRegistrationFiles,
  isValidStudentFileMime,
};