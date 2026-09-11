CREATE DATABASE IF NOT EXISTS educonnect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE educonnect;

-- ── Tabla central de autenticación 
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(191)     NOT NULL UNIQUE,
  password_hash VARCHAR(255)     NOT NULL,
  role          ENUM('student','tutor','admin') NOT NULL,
  status        ENUM('PENDING','APPROVED','REJECTED','DISABLED')
                                 NOT NULL DEFAULT 'PENDING',
  created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Perfil extendido del estudiante 

CREATE TABLE IF NOT EXISTS student_profiles (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL UNIQUE,
  nombre     VARCHAR(100) NOT NULL,
  apellido   VARCHAR(100) NOT NULL,
  carnet     VARCHAR(20)  NOT NULL UNIQUE,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sp_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Seed: administrador por defecto 
INSERT IGNORE INTO users (email, password_hash, role, status) VALUES (
  'admin@educonnect.com',
  '$2b$10$dfXhCrvpfqZcHNgevCtw2etDtv0BvuSWnxjMV6zIojlef0ySv1rpq',
  'admin',
  'APPROVED'
);