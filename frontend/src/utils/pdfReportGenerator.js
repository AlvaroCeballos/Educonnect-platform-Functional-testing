/**
 * Generador de Reportes PDF en formato estándar PDF 1.4
 * Diseñado para EduConnect - CU-ADM-07 / HU-026
 * Sin dependencias externas para garantizar compatibilidad total en Docker y navegadores.
 */

function cleanText(str) {
  if (!str) return '';
  return String(str)
    .replace(/[áàäâ]/g, 'a').replace(/[ÁÀÄÂ]/g, 'A')
    .replace(/[éèëê]/g, 'e').replace(/[ÉÈËÊ]/g, 'E')
    .replace(/[íìïî]/g, 'i').replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[óòöô]/g, 'o').replace(/[ÓÒÖÔ]/g, 'O')
    .replace(/[úùüû]/g, 'u').replace(/[ÚÙÜÛ]/g, 'U')
    .replace(/[ñ]/g, 'n').replace(/[Ñ]/g, 'N')
    .replace(/[()\\\\]/g, '')
    .trim();
}

export function generateTutorsDemandPDF(reportData, adminInfo = {}) {
  const {
    topTutors = [],
    totalAttendedAll = 0,
    totalDistinctStudents = 0,
    topTutor = null,
    generatedAt = new Date().toISOString(),
  } = reportData;

  const adminEmail = adminInfo.email || 'admin@educonnect.com';
  const pages = [];
  let currentOps = '';

  function startPage(pageNum) {
    currentOps = '';

    // Encabezado corporativo EduConnect
    currentOps += '0.059 0.463 0.388 rg\n36 726 540 46 re f\n';
    currentOps += 'BT /F2 13 Tf 1 1 1 rg 48 750 Td (EDUCONNECT - PLATAFORMA DE TUTORIAS UNIVERSITARIAS) Tj ET\n';
    currentOps += 'BT /F1 8.5 Tf 1 1 1 rg 48 737 Td (REPORTE OFICIAL DE DEMANDA DOCENTE - CU-ADM-07 / HU-026) Tj ET\n';

    // Barra de metadatos de emisión
    currentOps += '0.96 0.97 0.98 rg 36 688 540 28 re f\n';
    currentOps += '0.82 0.85 0.88 RG 0.5 w 36 688 540 28 re S\n';
    const dateFormatted = cleanText(generatedAt.slice(0, 19).replace('T', ' '));
    currentOps += 'BT /F1 8 Tf 0.25 0.3 0.35 rg 44 703 Td (Fecha de emision: ' + dateFormatted + '   |   Administrador: ' + cleanText(adminEmail) + '   |   Tutores evaluados: ' + topTutors.length + ') Tj ET\n';

    // En la primera página incluimos el resumen ejecutivo con tarjetas KPI
    if (pageNum === 1) {
      // KPI 1: Sesiones Atendidas
      currentOps += '0.95 0.98 0.96 rg 36 626 172 50 re f\n0.8 0.9 0.84 RG 0.5 w 36 626 172 50 re S\n';
      currentOps += 'BT /F2 7.5 Tf 0.2 0.5 0.35 rg 44 662 Td (SESIONES ATENDIDAS) Tj ET\n';
      currentOps += 'BT /F2 16 Tf 0.05 0.45 0.35 rg 44 642 Td (' + totalAttendedAll + ') Tj ET\n';
      currentOps += 'BT /F1 7 Tf 0.45 0.5 0.55 rg 44 632 Td (Total con estado ATTENDED) Tj ET\n';

      // KPI 2: Estudiantes Únicos Beneficiados
      currentOps += '0.96 0.97 0.99 rg 220 626 172 50 re f\n0.82 0.86 0.92 RG 0.5 w 220 626 172 50 re S\n';
      currentOps += 'BT /F2 7.5 Tf 0.2 0.3 0.45 rg 228 662 Td (ESTUDIANTES BENEFICIADOS) Tj ET\n';
      currentOps += 'BT /F2 16 Tf 0.06 0.15 0.3 rg 228 642 Td (' + totalDistinctStudents + ') Tj ET\n';
      currentOps += 'BT /F1 7 Tf 0.45 0.5 0.55 rg 228 632 Td (Estudiantes unicos atendidos) Tj ET\n';

      // KPI 3: Tutor Líder en Demanda
      currentOps += '0.99 0.97 0.94 rg 404 626 172 50 re f\n0.92 0.85 0.74 RG 0.5 w 404 626 172 50 re S\n';
      currentOps += 'BT /F2 7.5 Tf 0.6 0.35 0.05 rg 412 662 Td (TUTOR LIDER EN DEMANDA) Tj ET\n';
      const topName = topTutor && topTutor.totalAtendidos > 0 ? cleanText(topTutor.nombreCompleto) : 'Sin sesiones';
      currentOps += 'BT /F2 10 Tf 0.55 0.28 0.02 rg 412 644 Td (' + topName.slice(0, 24) + ') Tj ET\n';
      const topDesc = topTutor && topTutor.totalAtendidos > 0 ? `${topTutor.totalAtendidos} citas completadas` : 'Ningun tutor atendio citas';
      currentOps += 'BT /F1 7 Tf 0.5 0.4 0.3 rg 412 632 Td (' + topDesc + ') Tj ET\n';

      // Título de la tabla
      currentOps += 'BT /F2 9.5 Tf 0.06 0.17 0.28 rg 36 606 Td (RANKING DE TUTORES CON MAS ESTUDIANTES ATENDIDOS) Tj ET\n';
    }

    // Cabecera de la tabla
    const tableTopY = pageNum === 1 ? 588 : 670;
    currentOps += '0.88 0.92 0.93 rg 36 ' + tableTopY + ' 540 18 re f\n';
    currentOps += '0.75 0.8 0.82 RG 0.5 w 36 ' + tableTopY + ' 540 18 re S\n';
    currentOps += 'BT /F2 7.5 Tf 0.1 0.2 0.25 rg 40 ' + (tableTopY + 5) + ' Td (POS) Tj ET\n';
    currentOps += 'BT /F2 7.5 Tf 0.1 0.2 0.25 rg 65 ' + (tableTopY + 5) + ' Td (TUTOR) Tj ET\n';
    currentOps += 'BT /F2 7.5 Tf 0.1 0.2 0.25 rg 195 ' + (tableTopY + 5) + ' Td (CARNET) Tj ET\n';
    currentOps += 'BT /F2 7.5 Tf 0.1 0.2 0.25 rg 255 ' + (tableTopY + 5) + ' Td (ESPECIALIDAD) Tj ET\n';
    currentOps += 'BT /F2 7.5 Tf 0.1 0.2 0.25 rg 375 ' + (tableTopY + 5) + ' Td (UNIVERSIDAD) Tj ET\n';
    currentOps += 'BT /F2 7.5 Tf 0.1 0.2 0.25 rg 480 ' + (tableTopY + 5) + ' Td (ESTADO) Tj ET\n';
    currentOps += 'BT /F2 7.5 Tf 0.1 0.2 0.25 rg 535 ' + (tableTopY + 5) + ' Td (ATEND.) Tj ET\n';

    return tableTopY;
  }

  let pageIndex = 1;
  let currentY = startPage(pageIndex);
  currentY -= 18;

  if (topTutors.length === 0) {
    currentOps += 'BT /F1 8.5 Tf 0.5 0.55 0.6 rg 40 ' + (currentY + 5) + ' Td (No hay tutores registrados en la plataforma actualmente.) Tj ET\n';
    currentY -= 18;
  } else {
    for (let i = 0; i < topTutors.length; i++) {
      const tutor = topTutors[i];
      if (currentY < 60) {
        pages.push(currentOps);
        pageIndex++;
        currentY = startPage(pageIndex);
        currentY -= 18;
      }

      if (i % 2 === 1) {
        currentOps += '0.97 0.98 0.99 rg 36 ' + currentY + ' 540 18 re f\n';
      }
      currentOps += '0.9 0.92 0.94 RG 0.3 w 36 ' + currentY + ' 540 18 re S\n';

      const rankText = '#' + tutor.ranking;
      currentOps += 'BT /F2 7.5 Tf 0.3 0.35 0.4 rg 40 ' + (currentY + 5) + ' Td (' + rankText + ') Tj ET\n';
      currentOps += 'BT /F2 7.5 Tf 0.1 0.15 0.2 rg 65 ' + (currentY + 5) + ' Td (' + cleanText(tutor.nombreCompleto).slice(0, 26) + ') Tj ET\n';
      currentOps += 'BT /F1 7 Tf 0.4 0.45 0.5 rg 195 ' + (currentY + 5) + ' Td (' + cleanText(tutor.carnet).slice(0, 12) + ') Tj ET\n';
      currentOps += 'BT /F1 7 Tf 0.2 0.25 0.3 rg 255 ' + (currentY + 5) + ' Td (' + cleanText(tutor.especialidad).slice(0, 24) + ') Tj ET\n';
      currentOps += 'BT /F1 7 Tf 0.4 0.45 0.5 rg 375 ' + (currentY + 5) + ' Td (' + cleanText(tutor.universidad).slice(0, 22) + ') Tj ET\n';

      const statusText = tutor.userStatus === 'APPROVED' ? 'Activo' : 'Baja';
      currentOps += 'BT /F2 7 Tf ' + (tutor.userStatus === 'APPROVED' ? '0.05 0.45 0.35' : '0.7 0.2 0.2') + ' rg 480 ' + (currentY + 5) + ' Td (' + statusText + ') Tj ET\n';

      currentOps += 'BT /F2 8 Tf 0.05 0.45 0.35 rg 542 ' + (currentY + 5) + ' Td (' + tutor.totalAtendidos + ') Tj ET\n';

      currentY -= 18;
    }
  }

  pages.push(currentOps);
  const totalPages = pages.length;

  for (let p = 0; p < totalPages; p++) {
    pages[p] += '0.8 0.85 0.88 RG 0.5 w 36 36 540 0.1 re S\n';
    pages[p] += 'BT /F1 7 Tf 0.5 0.55 0.6 rg 36 26 Td (EduConnect - Sistema Integral de Tutorias | Documento Oficial de Administracion) Tj ET\n';
    pages[p] += 'BT /F1 7 Tf 0.5 0.55 0.6 rg 515 26 Td (Pagina ' + (p + 1) + ' de ' + totalPages + ') Tj ET\n';
  }

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  // Obj 1: Catalog
  offsets.push(pdf.length);
  pdf += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

  // Kids
  const pageObjIds = [];
  for (let i = 0; i < totalPages; i++) {
    pageObjIds.push((3 + i * 2) + ' 0 R');
  }

  // Obj 2: Pages
  offsets.push(pdf.length);
  pdf += '2 0 obj\n<< /Type /Pages /Kids [' + pageObjIds.join(' ') + '] /Count ' + totalPages + ' >>\nendobj\n';

  const fontRegularId = 3 + totalPages * 2;
  const fontBoldId = fontRegularId + 1;

  for (let i = 0; i < totalPages; i++) {
    const pageId = 3 + i * 2;
    const contentId = pageId + 1;
    const contentStream = pages[i];
    const streamLen = contentStream.length;

    offsets.push(pdf.length);
    pdf += pageId + ' 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ' + contentId + ' 0 R /Resources << /Font << /F1 ' + fontRegularId + ' 0 R /F2 ' + fontBoldId + ' 0 R >> >> >>\nendobj\n';

    offsets.push(pdf.length);
    pdf += contentId + ' 0 obj\n<< /Length ' + streamLen + ' >>\nstream\n' + contentStream + '\nendstream\nendobj\n';
  }

  offsets.push(pdf.length);
  pdf += fontRegularId + ' 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

  offsets.push(pdf.length);
  pdf += fontBoldId + ' 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';

  const totalObjs = fontBoldId;
  const xrefOffset = pdf.length;
  pdf += 'xref\n0 ' + (totalObjs + 1) + '\n';
  pdf += '0000000000 65535 f \n';
  for (const off of offsets) {
    pdf += String(off).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += 'trailer\n<< /Size ' + (totalObjs + 1) + ' /Root 1 0 R >>\nstartxref\n' + xrefOffset + '\n%%EOF\n';

  return pdf;
}

export function generateTutorsDemandBlob(reportData, adminInfo = {}) {
  const pdfString = generateTutorsDemandPDF(reportData, adminInfo);
  const len = pdfString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = pdfString.charCodeAt(i) & 0xff;
  }
  return new Blob([bytes], { type: 'application/pdf' });
}
