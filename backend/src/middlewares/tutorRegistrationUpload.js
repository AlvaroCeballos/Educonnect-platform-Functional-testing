const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const uploadsDirectory = path.join(__dirname, '..', '..', 'uploads');
const photoDirectory = path.join(uploadsDirectory, 'tutors');
const cvDirectory = path.join(uploadsDirectory, 'documents', 'cvs');

fs.mkdirSync(photoDirectory, { recursive: true });
fs.mkdirSync(cvDirectory, { recursive: true });

const photoExtensionsByMimeType = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (_req, file, callback) => {
    callback(null, file.fieldname === 'cv' ? cvDirectory : photoDirectory);
  },
  filename: (_req, file, callback) => {
    const extension = file.fieldname === 'cv'
      ? '.pdf'
      : photoExtensionsByMimeType[file.mimetype];
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const uploadFiles = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 2 },
  fileFilter: (_req, file, callback) => {
    if (file.fieldname === 'cv') {
      if (file.mimetype !== 'application/pdf') {
        return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
      }
      return callback(null, true);
    }

    if (file.fieldname === 'fotografia' && photoExtensionsByMimeType[file.mimetype]) {
      return callback(null, true);
    }

    return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
  },
}).fields([
  { name: 'fotografia', maxCount: 1 },
  { name: 'cv', maxCount: 1 },
]);

const removePartialUploads = async (files = {}) => {
  const uploadedFiles = Object.values(files).flat();
  await Promise.all(uploadedFiles.map(async (file) => {
    try {
      await fs.promises.unlink(file.path);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('No se pudo eliminar un archivo de registro incompleto:', error);
      }
    }
  }));
};

const uploadTutorRegistrationFiles = (req, res, next) => {
  uploadFiles(req, res, async (error) => {
    if (error) {
      await removePartialUploads(req.files);
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'Cada archivo debe pesar 5 MB o menos.'
        : 'Tipo de archivo no permitido o campo de archivo inesperado.';
      return res.status(400).json({ message });
    }

    req.file = req.files?.cv?.[0];
    req.tutorPhoto = req.files?.fotografia?.[0];
    return next();
  });
};

module.exports = { uploadTutorRegistrationFiles };
