const path = require('path');

const streamStaticPdf = (_req, res, next) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="dummy.pdf"');

  res.sendFile(path.join(__dirname, '../static/dummy.pdf'), (error) => {
    if (error) next(error);
  });
};

module.exports = { streamStaticPdf };
