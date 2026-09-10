const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const uploadDirectory = path.join(__dirname, '..', '..', 'uploads', 'tutors');
fs.mkdirSync(uploadDirectory, { recursive: true });

const extensionsByMimeType = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = extensionsByMimeType[file.mimetype];
    callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
  },
});

const uploadTutorPhoto = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!extensionsByMimeType[file.mimetype]) {
      return callback(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'fotografia'));
    }
    return callback(null, true);
  },
});

module.exports = { uploadTutorPhoto };
