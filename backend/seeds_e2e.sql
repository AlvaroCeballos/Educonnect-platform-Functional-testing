-- =====================================================================
-- seeds_e2e.sql — Datos mínimos para ejecutar la suite E2E (Cypress)
-- Responsable: Wade (202308940) — compendio docs/Pruebas/pruebas_e2e.md
--
-- Crea (si no existen):
--   * admin@educonnect.com         / Admin123!  -> E2E-03, E2E-04
--   * sofia.tutora@test.com        / Passw0rd1  -> E2E-05 (tutora)
--   * sofia.estudiante@test.com    / Passw0rd1  -> E2E-05 (estudiante)
--   * Materia "Física", asignación a la tutora y horario lunes-viernes 08:00-18:00
--   * Una sesión PENDING tutora <-> estudiante (la E2E-05 la marca como atendida)
--
-- Es idempotente: se puede ejecutar varias veces. No modifica datos existentes,
-- salvo dejar a las dos cuentas de prueba de E2E-05 aprobadas y verificadas.
-- Como la E2E-05 consume la sesión PENDING, vuelva a cargar este script antes
-- de cada ejecución de la suite.
--
-- Uso (desde la raíz del repositorio, con los contenedores levantados):
--   docker compose exec -T db sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' < backend/seeds_e2e.sql
-- =====================================================================

-- El cliente mysql del contenedor asume latin1 al leer por stdin; sin esto
-- las tildes se guardan mal ("SofÃ­a") y "Física" se duplica como otra materia.
SET NAMES utf8mb4;

-- Hashes bcrypt (10 rondas) generados con la librería bcrypt del backend
SET @pwd_admin = '$2b$10$BMeHTKXtDinPqmSoQiTuwOd/U1v4TCP.Tqm9JWOQ/nDOIX/zuM422'; -- Admin123!
SET @pwd_test  = '$2b$10$EC1T0LcceziL/MFZENlhRu0n1/YOiZzXFIlMeF9IO3Z1kvvws7Wzi'; -- Passw0rd1

-- ---------------------------------------------------------------------
-- 1. Usuarios
-- ---------------------------------------------------------------------
-- Administrador: si ya existe, no se toca (cada base puede tener su propia clave)
INSERT INTO users (email, password_hash, role, status, email_verified)
VALUES ('admin@educonnect.com', @pwd_admin, 'admin', 'APPROVED', TRUE)
ON DUPLICATE KEY UPDATE id = id;

-- Cuentas de prueba de E2E-05: se garantizan aprobadas, verificadas y con su clave
INSERT INTO users (email, password_hash, role, status, email_verified, verification_token)
VALUES
  ('sofia.tutora@test.com',     @pwd_test, 'tutor',   'APPROVED', TRUE, NULL),
  ('sofia.estudiante@test.com', @pwd_test, 'student', 'APPROVED', TRUE, NULL)
ON DUPLICATE KEY UPDATE
  password_hash      = VALUES(password_hash),
  status             = 'APPROVED',
  email_verified     = TRUE,
  verification_token = NULL;

-- ---------------------------------------------------------------------
-- 2. Perfiles
-- ---------------------------------------------------------------------
INSERT INTO tutor_profiles
  (user_id, nombre, apellido, carnet, identificacion, fecha_nacimiento, genero,
   fotografia_url, especialidad, direccion_tutoria, anio_inicio_experiencia, universidad)
SELECT u.id, 'Sofía', 'Tutora E2E', 'E2E-T001', '0000000000101', '1995-03-10', 'F',
       '/uploads/e2e/tutora.jpg', 'Física', 'Edificio T-3, Ciudad Universitaria', 2018,
       'Universidad de San Carlos de Guatemala'
  FROM users u
 WHERE u.email = 'sofia.tutora@test.com'
   AND NOT EXISTS (SELECT 1 FROM tutor_profiles tp WHERE tp.user_id = u.id);

INSERT INTO student_profiles (user_id, nombre, apellido, carnet, genero, universidad, carrera)
SELECT u.id, 'Sofía', 'Estudiante E2E', 'E2E-S001', 'F',
       'Universidad de San Carlos de Guatemala', 'Ingeniería en Ciencias y Sistemas'
  FROM users u
 WHERE u.email = 'sofia.estudiante@test.com'
   AND NOT EXISTS (SELECT 1 FROM student_profiles sp WHERE sp.user_id = u.id);

-- ---------------------------------------------------------------------
-- 3. Materia, asignación y horario de la tutora
-- ---------------------------------------------------------------------
INSERT INTO subjects (nombre, is_active) VALUES ('Física', TRUE)
ON DUPLICATE KEY UPDATE is_active = TRUE;

SET @tutor_id   = (SELECT tp.id FROM tutor_profiles tp
                     JOIN users u ON u.id = tp.user_id
                    WHERE u.email = 'sofia.tutora@test.com');
SET @student_id = (SELECT sp.id FROM student_profiles sp
                     JOIN users u ON u.id = sp.user_id
                    WHERE u.email = 'sofia.estudiante@test.com');
SET @subject_id = (SELECT id FROM subjects WHERE nombre = 'Física');

INSERT IGNORE INTO tutor_subjects (tutor_id, subject_id)
VALUES (@tutor_id, @subject_id);

-- Lunes (1) a viernes (5), 08:00-18:00. Si la tutora ya tiene horario en un día, se respeta.
INSERT IGNORE INTO schedules (tutor_id, day_of_week, start_time, end_time, is_active)
VALUES
  (@tutor_id, 1, '08:00:00', '18:00:00', TRUE),
  (@tutor_id, 2, '08:00:00', '18:00:00', TRUE),
  (@tutor_id, 3, '08:00:00', '18:00:00', TRUE),
  (@tutor_id, 4, '08:00:00', '18:00:00', TRUE),
  (@tutor_id, 5, '08:00:00', '18:00:00', TRUE);

-- ---------------------------------------------------------------------
-- 4. Sesión PENDING para E2E-05 (solo si la tutora no tiene ninguna pendiente)
-- ---------------------------------------------------------------------
INSERT INTO sessions
  (student_id, tutor_id, session_date, start_time, end_time, subject_id, reason, status)
SELECT @student_id, @tutor_id, DATE_ADD(CURDATE(), INTERVAL 30 DAY), '10:00:00', '11:00:00',
       @subject_id, 'Sesión semilla para E2E-05', 'PENDING'
  FROM DUAL
 WHERE @tutor_id IS NOT NULL
   AND @student_id IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM sessions s
                    WHERE s.tutor_id = @tutor_id AND s.status = 'PENDING');

-- ---------------------------------------------------------------------
-- 5. Verificación
-- ---------------------------------------------------------------------
SELECT email, role, status, email_verified
  FROM users
 WHERE email IN ('admin@educonnect.com', 'sofia.tutora@test.com', 'sofia.estudiante@test.com');

SELECT id, session_date, start_time, status, reason
  FROM sessions
 WHERE tutor_id = @tutor_id
 ORDER BY id DESC
 LIMIT 3;