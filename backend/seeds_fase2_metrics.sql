-- Seed Fase 2 para métricas (HU-045 a HU-048). Solo datos de prueba.
SET NAMES utf8mb4;

-- 3 tutores (101-103) y 3 estudiantes (104-106). Nunca inician sesión (hash falso).
INSERT IGNORE INTO users (id, email, password_hash, role, status, email_verified) VALUES
(101, 'seed.tutor1@educonnect.test', 'seed-no-login', 'tutor',   'APPROVED', TRUE),
(102, 'seed.tutor2@educonnect.test', 'seed-no-login', 'tutor',   'APPROVED', TRUE),
(103, 'seed.tutor3@educonnect.test', 'seed-no-login', 'tutor',   'APPROVED', TRUE),
(104, 'seed.est1@educonnect.test',   'seed-no-login', 'student', 'APPROVED', TRUE),
(105, 'seed.est2@educonnect.test',   'seed-no-login', 'student', 'APPROVED', TRUE),
(106, 'seed.est3@educonnect.test',   'seed-no-login', 'student', 'APPROVED', TRUE);

INSERT IGNORE INTO tutor_profiles
  (id, user_id, nombre, apellido, carnet, identificacion, fecha_nacimiento,
   fotografia_url, especialidad, direccion_tutoria, anio_inicio_experiencia, universidad) VALUES
(101, 101, 'Ana',   'Morales', 'T-9001', 'ID-9001', '1999-03-12', '/seed/t1.png', 'Cálculo',      'Edificio T3', 2022, 'USAC'),
(102, 102, 'Luis',  'Pérez',   'T-9002', 'ID-9002', '1998-07-25', '/seed/t2.png', 'Física',       'Edificio T3', 2021, 'USAC'),
(103, 103, 'Marta', 'Gómez',   'T-9003', 'ID-9003', '2000-11-02', '/seed/t3.png', 'Programación', 'Edificio S12', 2023, 'USAC');

INSERT IGNORE INTO student_profiles (id, user_id, nombre, apellido, carnet, universidad, carrera) VALUES
(101, 104, 'Carlos', 'Díaz',   'E-9001', 'USAC', 'Ingeniería en Sistemas'),
(102, 105, 'Sofía',  'Ramos',  'E-9002', 'USAC', 'Ingeniería Industrial'),
(103, 106, 'Diego',  'López',  'E-9003', 'USAC', 'Ingeniería Civil');

INSERT IGNORE INTO subjects (id, nombre) VALUES
(101, 'Cálculo I'), (102, 'Física I'), (103, 'Programación I'), (104, 'Estadística');

INSERT IGNORE INTO sessions
  (id, student_id, tutor_id, session_date, start_time, end_time, subject_id, reason, status) VALUES
(201, 101, 101, '2026-09-08', '08:00', '09:00', 101, 'Repaso de límites',    'ATTENDED'),
(202, 102, 101, '2026-09-10', '10:00', '11:00', 101, 'Derivadas',            'ATTENDED'),
(203, 101, 102, '2026-09-15', '08:00', '09:00', 102, 'Cinemática',           'ATTENDED'),
(204, 103, 102, '2026-09-17', '14:00', '15:00', 102, 'Dinámica',             'CANCELLED_BY_STUDENT'),
(205, 102, 103, '2026-09-22', '16:00', '17:00', 103, 'Estructuras de datos', 'ATTENDED'),
(206, 103, 103, '2026-09-24', '16:00', '17:00', 103, 'Recursividad',         'CANCELLED_BY_TUTOR'),
(207, 101, 101, '2026-09-29', '08:00', '09:00', 101, 'Integrales',           'ATTENDED'),
(208, 102, 102, '2026-10-01', '10:00', '11:00', 102, 'Trabajo y energía',    'CANCELLED_BY_STUDENT'),
(209, 103, 101, '2026-10-02', '14:00', '15:00', 101, 'Series',               'ATTENDED'),
(210, 101, 103, '2026-10-06', '16:00', '17:00', 103, 'POO',                  'ATTENDED'),
(211, 102, 103, '2026-10-08', '16:00', '17:00', 103, 'Algoritmos',           'ATTENDED'),
(212, 103, 102, '2026-10-09', '08:00', '09:00', 102, 'Ondas',                'ATTENDED'),
(213, 102, 101, '2026-10-13', '10:00', '11:00', 104, 'Probabilidad',         'CANCELLED_BY_STUDENT'),
(214, 103, 102, '2026-10-20', '08:00', '09:00', 104, 'Regresión',            'PENDING'),
(215, 101, 101, '2026-10-21', '08:00', '09:00', 101, 'Optimización',         'PENDING'),
(216, 102, 103, '2026-10-22', '16:00', '17:00', 104, 'Muestreo',             'CANCELLED_BY_TUTOR');

-- Calificaciones (estudiante → tutor) solo de sesiones atendidas
-- Promedios esperados: Ana 4.50 (4), Luis 3.50 (2), Marta 4.67 (3)
INSERT IGNORE INTO reviews (session_id, student_id, tutor_id, rating, comment) VALUES
(201, 101, 101, 5, 'Muy claro'),
(202, 102, 101, 4, 'Buena explicación'),
(203, 101, 102, 3, 'Podría mejorar'),
(205, 102, 103, 5, 'Excelente'),
(207, 101, 101, 5, 'Muy buena sesión'),
(209, 103, 101, 4, 'Bien'),
(210, 101, 103, 4, 'Buena'),
(211, 102, 103, 5, 'Excelente'),
(212, 103, 102, 4, 'Clara');