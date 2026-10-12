CREATE DATABASE IF NOT EXISTS educonnect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE educonnect;

-- Contrato compartido de autenticacion.
-- Los valores se mantienen compatibles con el modulo de Wade (HU-001).
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(191) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('student', 'tutor', 'admin') NOT NULL,
  status        ENUM('PENDING', 'APPROVED', 'REJECTED', 'DISABLED')
                NOT NULL DEFAULT 'PENDING',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS student_profiles (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          INT UNSIGNED NOT NULL,
  nombre           VARCHAR(100) NOT NULL,
  apellido         VARCHAR(100) NOT NULL,
  carnet           VARCHAR(20) NOT NULL,
  fecha_nacimiento DATE NULL,
  genero           ENUM('M', 'F', 'OTHER', 'UNSPECIFIED')
                   NOT NULL DEFAULT 'UNSPECIFIED',
  universidad      VARCHAR(150) NULL,
  carrera          VARCHAR(150) NULL,
  fotografia_url   VARCHAR(500) NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_student_profiles_user UNIQUE (user_id),
  CONSTRAINT uq_student_profiles_carnet UNIQUE (carnet),
  CONSTRAINT fk_student_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tutor_profiles (
  id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id                 INT UNSIGNED NOT NULL,
  nombre                  VARCHAR(100) NOT NULL,
  apellido                VARCHAR(100) NOT NULL,
  carnet                  VARCHAR(20) NOT NULL,
  identificacion          VARCHAR(30) NOT NULL,
  fecha_nacimiento        DATE NOT NULL,
  genero                  ENUM('M', 'F', 'OTHER', 'UNSPECIFIED')
                          NOT NULL DEFAULT 'UNSPECIFIED',
  fotografia_url          VARCHAR(500) NOT NULL,
  especialidad            VARCHAR(150) NOT NULL,
  direccion_tutoria       VARCHAR(255) NOT NULL,
  anio_inicio_experiencia YEAR NOT NULL,
  universidad             VARCHAR(150) NOT NULL,
  created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                          ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_tutor_profiles_user UNIQUE (user_id),
  CONSTRAINT uq_tutor_profiles_carnet UNIQUE (carnet),
  CONSTRAINT uq_tutor_profiles_identificacion UNIQUE (identificacion),
  CONSTRAINT fk_tutor_profiles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catalogo normalizado de materias. Una materia puede ser impartida por
-- varios tutores y cada tutor puede impartir varias materias.
CREATE TABLE IF NOT EXISTS subjects (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(150) NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_subjects_nombre UNIQUE (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tutor_subjects (
  tutor_id   INT UNSIGNED NOT NULL,
  subject_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (tutor_id, subject_id),
  CONSTRAINT fk_tutor_subjects_tutor
    FOREIGN KEY (tutor_id) REFERENCES tutor_profiles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_tutor_subjects_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  INDEX idx_tutor_subjects_subject (subject_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ISO-8601: 1 = lunes y 7 = domingo. Cada tutor utiliza el mismo rango
-- para todos los dias seleccionados, como exige HU-008.
CREATE TABLE IF NOT EXISTS schedules (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tutor_id    INT UNSIGNED NOT NULL,
  day_of_week TINYINT UNSIGNED NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_schedules_tutor_day UNIQUE (tutor_id, day_of_week),
  CONSTRAINT chk_schedules_day CHECK (day_of_week BETWEEN 1 AND 7),
  CONSTRAINT chk_schedules_range CHECK (start_time < end_time),
  CONSTRAINT fk_schedules_tutor
    FOREIGN KEY (tutor_id) REFERENCES tutor_profiles(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id      INT UNSIGNED NOT NULL,
  tutor_id        INT UNSIGNED NOT NULL,
  session_date    DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  subject_id      INT UNSIGNED NOT NULL,
  reason          TEXT NOT NULL,
  status          ENUM(
                    'PENDING',
                    'ATTENDED',
                    'CANCELLED_BY_STUDENT',
                    'CANCELLED_BY_TUTOR'
                  ) NOT NULL DEFAULT 'PENDING',
  summary         TEXT NULL,
  recommendations TEXT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_sessions_range CHECK (start_time < end_time),
  CONSTRAINT fk_sessions_student
    FOREIGN KEY (student_id) REFERENCES student_profiles(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_sessions_tutor
    FOREIGN KEY (tutor_id) REFERENCES tutor_profiles(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_sessions_subject
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  INDEX idx_sessions_tutor_schedule (tutor_id, session_date, start_time, status),
  INDEX idx_sessions_student_schedule (student_id, session_date, start_time, status),
  INDEX idx_sessions_subject (subject_id),
  INDEX idx_sessions_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id INT UNSIGNED NOT NULL,
  student_id INT UNSIGNED NOT NULL,
  tutor_id   INT UNSIGNED NOT NULL,
  rating     TINYINT UNSIGNED NOT NULL,
  comment    TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
             ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_reviews_session UNIQUE (session_id),
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 0 AND 5),
  CONSTRAINT fk_reviews_session
    FOREIGN KEY (session_id) REFERENCES sessions(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_reviews_student
    FOREIGN KEY (student_id) REFERENCES student_profiles(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_reviews_tutor
    FOREIGN KEY (tutor_id) REFERENCES tutor_profiles(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  INDEX idx_reviews_tutor (tutor_id),
  INDEX idx_reviews_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fase 2: Reportes disciplinarios y denuncias entre tutores y estudiantes (HU-036, HU-038, HU-043, HU-044)
CREATE TABLE IF NOT EXISTS incident_reports (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id       INT UNSIGNED NOT NULL,
  reporter_id      INT UNSIGNED NOT NULL,
  reported_user_id INT UNSIGNED NOT NULL,
  reporter_role    ENUM('student', 'tutor') NOT NULL,
  category         VARCHAR(150) NOT NULL,
  reason           TEXT NOT NULL,
  status           ENUM('PENDING', 'RESOLVED_BANNED', 'DISMISSED')
                   NOT NULL DEFAULT 'PENDING',
  admin_notes      TEXT NULL,
  resolved_by      INT UNSIGNED NULL,
  resolved_at      TIMESTAMP NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                   ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_incident_session_reporter UNIQUE (session_id, reporter_id),
  CONSTRAINT fk_incident_session
    FOREIGN KEY (session_id) REFERENCES sessions(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_incident_reporter
    FOREIGN KEY (reporter_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_incident_reported_user
    FOREIGN KEY (reported_user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT fk_incident_admin
    FOREIGN KEY (resolved_by) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  INDEX idx_incident_status (status),
  INDEX idx_incident_reported_user (reported_user_id),
  INDEX idx_incident_reporter_role (reporter_role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

