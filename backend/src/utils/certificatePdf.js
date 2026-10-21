const PDFDocument = require('pdfkit');

const COLORES = {
  primario: '#0f766e',
  textoFuerte: '#0f172a',
  textoSuave: '#64748b',
  bordeSuave: '#cbd5e1',
  bandaHeader: '#ecfdf5',
};

const TELEFONO_CONTACTO = '+502 2411 9999';
const NOMBRE_PLATAFORMA = 'EduConnect';

const CAMPOS_REQUERIDOS_PLAN = [
  'id',
  'session_date',
  'tutor_name',
  'tutor_specialty',
  'tutor_identification',
  'dificultades_detectadas',
  'recursos',
];

const validateCertificatePayload = (plan) => {
  if (plan === null || typeof plan !== 'object') {
    return { valid: false, message: 'El plan es requerido para generar la constancia' };
  }
  for (const campo of CAMPOS_REQUERIDOS_PLAN) {
    if (plan[campo] === undefined || plan[campo] === null || plan[campo] === '') {
      return { valid: false, message: `Falta el campo "${campo}" para generar la constancia` };
    }
  }
  if (!Array.isArray(plan.recursos)) {
    return { valid: false, message: 'El campo "recursos" debe ser un array' };
  }
  return { valid: true };
};

const formatearFecha = (fecha) => {
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return String(fecha);
  return d.toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' });
};

const dibujarEncabezado = (doc, plan) => {
  doc.rect(0, 0, doc.page.width, 90).fill(COLORES.bandaHeader);
  doc.fillColor(COLORES.primario).fontSize(26).font('Helvetica-Bold').text(NOMBRE_PLATAFORMA, 50, 30);
  doc.fillColor(COLORES.textoSuave).fontSize(10).font('Helvetica').text('Plataforma de Gestión de Tutorías Académicas', 50, 60);

  const anchoDerecha = doc.page.width - 50;
  doc.fillColor(COLORES.textoFuerte).fontSize(9).font('Helvetica-Bold')
    .text(`Fecha de emisión: ${formatearFecha(new Date())}`, 0, 30, { width: anchoDerecha, align: 'right' });
  doc.font('Helvetica')
    .text(`Teléfono de contacto: ${TELEFONO_CONTACTO}`, 0, 44, { width: anchoDerecha, align: 'right' });
  doc.font('Helvetica').fontSize(8).fillColor(COLORES.textoSuave)
    .text(`Constancia N° ${String(plan.id).padStart(6, '0')}`, 0, 58, { width: anchoDerecha, align: 'right' });

  doc.y = 110;
};

const dibujarTituloYIntroduccion = (doc, plan) => {
  doc.x = 50;
  doc.fillColor(COLORES.textoFuerte).fontSize(16).font('Helvetica-Bold')
    .text('Constancia de Tutoría Académica', { align: 'center' });
  doc.moveDown(0.8);

  doc.fontSize(11).font('Helvetica').fillColor(COLORES.textoFuerte)
    .text(
      `Por medio de la presente se hace constar que se brindó una sesión de tutoría académica el día ${formatearFecha(plan.session_date)}, en la cual se identificaron las siguientes dificultades y se recomendaron los recursos listados a continuación como parte del plan de estudio del estudiante.`,
      { align: 'justify', lineGap: 2 },
    );
  doc.moveDown(1);
};

const dibujarDificultades = (doc, plan) => {
  doc.x = 50;
  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORES.textoSuave).text('DIFICULTADES IDENTIFICADAS', { characterSpacing: 1 });
  doc.moveDown(0.3);
  doc.fontSize(11).font('Helvetica').fillColor(COLORES.textoFuerte)
    .text(plan.dificultades_detectadas, { align: 'justify', lineGap: 2 });
  doc.moveDown(1);
};

const dibujarTablaRecursos = (doc, plan) => {
  doc.x = 50;
  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORES.textoSuave).text('RECURSOS RECOMENDADOS', { characterSpacing: 1 });
  doc.moveDown(0.4);

  const inicioX = 50;
  const anchoTabla = doc.page.width - 100;
  const anchoCols = {
    nombre: anchoTabla * 0.35,
    tipo: anchoTabla * 0.15,
    descripcion: anchoTabla * 0.50,
  };

  const yEncabezado = doc.y;
  doc.rect(inicioX, yEncabezado, anchoTabla, 22).fill(COLORES.primario);
  doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold');
  doc.text('Nombre', inicioX + 8, yEncabezado + 7, { width: anchoCols.nombre - 10 });
  doc.text('Tipo', inicioX + anchoCols.nombre + 8, yEncabezado + 7, { width: anchoCols.tipo - 10 });
  doc.text('Descripción de uso', inicioX + anchoCols.nombre + anchoCols.tipo + 8, yEncabezado + 7, { width: anchoCols.descripcion - 10 });

  let y = yEncabezado + 22;
  doc.font('Helvetica').fontSize(10).fillColor(COLORES.textoFuerte);

  (plan.recursos || []).forEach((r, idx) => {
    const altoFila = Math.max(
      doc.heightOfString(r.nombre_recurso || '', { width: anchoCols.nombre - 10 }),
      doc.heightOfString(r.tipo_recurso || '', { width: anchoCols.tipo - 10 }),
      doc.heightOfString(r.descripcion_uso || '', { width: anchoCols.descripcion - 10 }),
    ) + 10;

    if (idx % 2 === 0) {
      doc.rect(inicioX, y, anchoTabla, altoFila).fill('#f8fafc');
      doc.fillColor(COLORES.textoFuerte);
    }
    doc.rect(inicioX, y, anchoTabla, altoFila).stroke(COLORES.bordeSuave);

    doc.text(r.nombre_recurso || '', inicioX + 8, y + 5, { width: anchoCols.nombre - 10 });
    doc.text(r.tipo_recurso || '', inicioX + anchoCols.nombre + 8, y + 5, { width: anchoCols.tipo - 10 });
    doc.text(r.descripcion_uso || '', inicioX + anchoCols.nombre + anchoCols.tipo + 8, y + 5, { width: anchoCols.descripcion - 10 });

    y += altoFila;
  });

  doc.y = y + 10;
};

const dibujarPieFirmaTutor = (doc, plan) => {
  const anchoPagina = doc.page.width;
  const yFirma = doc.page.height - 160;

  const xLinea = anchoPagina / 2 - 120;
  doc.strokeColor(COLORES.textoFuerte).lineWidth(0.8)
    .moveTo(xLinea, yFirma).lineTo(xLinea + 240, yFirma).stroke();

  doc.fontSize(10).font('Helvetica-Bold').fillColor(COLORES.textoFuerte)
    .text(plan.tutor_name, 0, yFirma + 6, { align: 'center', width: anchoPagina });
  doc.fontSize(9).font('Helvetica').fillColor(COLORES.textoSuave)
    .text(`Especialidad: ${plan.tutor_specialty}`, 0, yFirma + 22, { align: 'center', width: anchoPagina })
    .text(`Identificación: ${plan.tutor_identification}`, 0, yFirma + 36, { align: 'center', width: anchoPagina });

  doc.fontSize(8).fillColor(COLORES.textoSuave)
    .text(
      `Documento generado automáticamente por ${NOMBRE_PLATAFORMA}. Este documento no requiere firma manuscrita.`,
      50,
      doc.page.height - 60,
      { align: 'center', width: doc.page.width - 100 },
    );
};

const generateCertificatePDF = (plan, stream) => {
  const validation = validateCertificatePayload(plan);
  if (!validation.valid) throw new Error(validation.message);

  const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true, info: {
    Title: `Constancia EduConnect - Sesión ${plan.id}`,
    Author: NOMBRE_PLATAFORMA,
    Subject: 'Constancia de Tutoría Académica',
  }});
  doc.pipe(stream);

  dibujarEncabezado(doc, plan);
  dibujarTituloYIntroduccion(doc, plan);
  dibujarDificultades(doc, plan);
  dibujarTablaRecursos(doc, plan);
  dibujarPieFirmaTutor(doc, plan);

  doc.end();
  return doc;
};

module.exports = {
  CAMPOS_REQUERIDOS_PLAN,
  TELEFONO_CONTACTO,
  NOMBRE_PLATAFORMA,
  validateCertificatePayload,
  generateCertificatePDF,
};
