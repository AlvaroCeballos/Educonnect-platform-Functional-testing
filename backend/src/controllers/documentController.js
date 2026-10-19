const fs = require('fs');
const path = require('path');

const cvsDirectory = path.join(__dirname, '..', '..', 'uploads', 'documents', 'cvs');
const carnetsDirectory = path.join(__dirname, '..', '..', 'uploads', 'documents', 'carnets');

const streamStaticPdf = (_req, res, next) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="dummy.pdf"');

  res.sendFile(path.join(__dirname, '../static/dummy.pdf'), (error) => {
    if (error) next(error);
  });
};

const streamPdfFromDirectory = (baseDir, rawFilename, res, next) => {
  const safeFilename = path.basename(String(rawFilename || '').trim());
  if (!safeFilename || !safeFilename.toLowerCase().endsWith('.pdf')) {
    return res.status(400).json({ message: 'Nombre de archivo PDF no válido' });
  }

  const filePath = path.join(baseDir, safeFilename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Documento PDF no encontrado' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);

  return res.sendFile(filePath, (error) => {
    if (error) next(error);
  });
};

const streamTutorCvPdf = (req, res, next) => {
  return streamPdfFromDirectory(cvsDirectory, req.params.filename, res, next);
};

const streamStudentCarnetPdf = (req, res, next) => {
  return streamPdfFromDirectory(carnetsDirectory, req.params.filename, res, next);
};

module.exports = {
  streamStaticPdf,
  streamTutorCvPdf,
  streamStudentCarnetPdf,
};
