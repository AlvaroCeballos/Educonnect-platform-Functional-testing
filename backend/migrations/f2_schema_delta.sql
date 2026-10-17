ALTER TABLE users
  ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE AFTER status,
  ADD COLUMN verification_token VARCHAR(10) NULL AFTER email_verified,
  ADD COLUMN carnet_pdf_url VARCHAR(500) NULL AFTER verification_token,
  ADD COLUMN cv_pdf_url VARCHAR(500) NULL AFTER carnet_pdf_url;

CREATE TABLE IF NOT EXISTS study_plans (
  id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  session_id              INT UNSIGNED NOT NULL,
  dificultades_detectadas TEXT NOT NULL,
  created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
                          ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_study_plans_session UNIQUE (session_id),
  CONSTRAINT fk_study_plans_session
    FOREIGN KEY (session_id) REFERENCES sessions(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- HU-037: permite una calificación independiente por participante de la sesión.
ALTER TABLE reviews
  DROP INDEX uq_reviews_session,
  ADD COLUMN reviewer_role ENUM('student', 'tutor') NOT NULL DEFAULT 'student' AFTER tutor_id,
  ADD UNIQUE KEY uq_reviews_session_reviewer (session_id, reviewer_role);

CREATE TABLE IF NOT EXISTS study_resources (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  study_plan_id    INT UNSIGNED NOT NULL,
  nombre_recurso   VARCHAR(255) NOT NULL,
  tipo_recurso     ENUM('Texto', 'Video', 'PDF', 'Enlace') NOT NULL,
  descripcion_uso  TEXT NOT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_study_resources_plan
    FOREIGN KEY (study_plan_id) REFERENCES study_plans(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
