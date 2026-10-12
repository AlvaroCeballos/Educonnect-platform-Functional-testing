-- Datos semilla de Fase 2 para incident_reports (EduConnect)
-- Inserciones de prueba compatibles con las sesiones existentes.

USE educonnect;

-- Garantizar que existan denuncias de prueba pendientes y resueltas para maquetar y probar HU-043 y HU-044
INSERT IGNORE INTO incident_reports (
  id,
  session_id,
  reporter_id,
  reported_user_id,
  reporter_role,
  category,
  reason,
  status,
  admin_notes,
  created_at
) VALUES 
(
  1,
  1,
  2, -- Estudiante
  3, -- Tutor
  'student',
  'Ética y profesionalismo',
  'El tutor llegó 25 minutos tarde a la tutoría y no abordó los temas de cálculo solicitados en el temario.',
  'PENDING',
  NULL,
  '2026-10-10 10:30:00'
),
(
  2,
  2,
  3, -- Tutor
  2, -- Estudiante
  'tutor',
  'Conducta inapropiada',
  'El estudiante utilizó un vocabulario despectivo durante la sesión presencial de física.',
  'PENDING',
  NULL,
  '2026-10-10 11:15:00'
);
