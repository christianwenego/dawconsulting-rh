-- ============================================================
--  DAW Consulting RH — Base de données MySQL
--  À exécuter avant le premier démarrage du backend.
--  (Hibernate crée/maj les tables via ddl-auto=update, mais ce
--   script garantit la base, l'utilisateur et un schéma de référence.)
-- ============================================================

CREATE DATABASE IF NOT EXISTS dawconsulting_rh
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Utilisateur applicatif (adapter le mot de passe en production)
CREATE USER IF NOT EXISTS 'dawconsulting'@'%' IDENTIFIED BY 'dawconsulting';
GRANT ALL PRIVILEGES ON dawconsulting_rh.* TO 'dawconsulting'@'%';
FLUSH PRIVILEGES;

USE dawconsulting_rh;

-- ----------------------------------------------------------------
--  Schéma de référence (optionnel — Hibernate peut le générer seul)
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS admin_users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(150)  NOT NULL,
    email         VARCHAR(180)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    role          VARCHAR(30)   NOT NULL DEFAULT 'ROLE_ADMIN',
    created_at    DATETIME(6)   NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS jobs (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(160)  NOT NULL,
    department       VARCHAR(80),
    location         VARCHAR(120)  NOT NULL,
    contract_type    VARCHAR(20)   NOT NULL DEFAULT 'CDI',
    experience_level VARCHAR(80),
    description       TEXT          NOT NULL,
    responsibilities TEXT,
    requirements      TEXT,
    salary_min        INT,
    salary_max        INT,
    status           VARCHAR(15)   NOT NULL DEFAULT 'PUBLISHED',
    created_at       DATETIME(6)   NOT NULL,
    updated_at       DATETIME(6)   NOT NULL,
    closing_date     DATETIME(6),
    INDEX idx_jobs_status (status),
    INDEX idx_jobs_department (department)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS applications (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id           BIGINT        NOT NULL,
    full_name        VARCHAR(120)  NOT NULL,
    email            VARCHAR(180)  NOT NULL,
    phone            VARCHAR(40),
    cover_letter     TEXT,
    cv_stored_name   VARCHAR(255),
    cv_original_name VARCHAR(255),
    cv_content_type  VARCHAR(100),
    status           VARCHAR(15)   NOT NULL DEFAULT 'RECEIVED',
    created_at       DATETIME(6)   NOT NULL,
    CONSTRAINT fk_applications_job FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE,
    INDEX idx_applications_job (job_id),
    INDEX idx_applications_status (status)
) ENGINE=InnoDB;
