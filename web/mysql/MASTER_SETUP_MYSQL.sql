-- MASTER SETUP SCRIPT FOR SYGMA CONSULT (MySQL Version)
-- Run this script in your Hostinger phpMyAdmin SQL tab.
-- Disable foreign key checks temporarily to allow dropping tables
SET FOREIGN_KEY_CHECKS = 0;
-- ==========================================
-- 1. DROP EXISTING TABLES (To ensure clean setup)
-- ==========================================
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `clients`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `admin_users`;
DROP TABLE IF EXISTS `user_profiles`;
DROP TABLE IF EXISTS `recommendations`;
DROP TABLE IF EXISTS `activity_logs`;
-- ==========================================
-- 2. CREATE TABLES
-- ==========================================
-- Bookings Table
CREATE TABLE `bookings` (
    `id` CHAR(36) NOT NULL,
    `user_id` VARCHAR(255),
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `topic` VARCHAR(255) NOT NULL,
    `date` DATE NOT NULL,
    `time` TIME NOT NULL,
    `status` ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_bookings_email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Contacts Table
CREATE TABLE `contacts` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('new', 'read', 'replied') DEFAULT 'new',
    `reply` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_contacts_email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Clients Table
CREATE TABLE `clients` (
    `id` CHAR(36) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255),
    `phone` VARCHAR(50),
    `address` TEXT,
    `city` VARCHAR(100),
    `postal_code` VARCHAR(20),
    `country` VARCHAR(100) DEFAULT 'France',
    `siret` VARCHAR(50),
    `tva_number` VARCHAR(50),
    `company_type` VARCHAR(50),
    `notes` TEXT,
    `is_active` BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (`id`),
    UNIQUE KEY `clients_email_unique` (`email`),
    INDEX `idx_clients_email` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Invoices Table
CREATE TABLE `invoices` (
    `id` CHAR(36) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `type` ENUM('quote', 'invoice', 'credit_note') NOT NULL,
    `status` ENUM(
        'draft',
        'sent',
        'accepted',
        'rejected',
        'paid',
        'overdue',
        'cancelled'
    ) NOT NULL,
    `number` VARCHAR(50) NOT NULL,
    `client_name` VARCHAR(255) NOT NULL,
    `client_email` VARCHAR(255),
    `client_address` TEXT,
    `client_siret` VARCHAR(50),
    `client_id` CHAR(36),
    `currency` VARCHAR(3) DEFAULT 'EUR',
    `items` JSON,
    `total_excl_tax` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total_tax` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total_incl_tax` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `issue_date` DATE NOT NULL,
    `due_date` DATE,
    `notes` TEXT,
    `footer` TEXT,
    PRIMARY KEY (`id`),
    UNIQUE KEY `invoices_number_unique` (`number`),
    KEY `client_id` (`client_id`),
    INDEX `idx_invoices_type` (`type`),
    CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE
    SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Site Settings
CREATE TABLE `site_settings` (
    `id` CHAR(36) NOT NULL,
    `key` VARCHAR(50) DEFAULT 'main',
    `value` TEXT,
    `description` VARCHAR(255),
    -- Content Columns
    `company_name` VARCHAR(255) DEFAULT 'SYGMA CONSULT',
    `company_tagline_en` VARCHAR(255),
    `company_tagline_fr` VARCHAR(255),
    `company_tagline_ar` VARCHAR(255),
    `company_description_en` TEXT,
    `company_description_fr` TEXT,
    `company_description_ar` TEXT,
    `phone_primary` VARCHAR(50),
    `phone_secondary` VARCHAR(50),
    `whatsapp_number` VARCHAR(50),
    `email_primary` VARCHAR(255),
    `email_secondary` VARCHAR(255),
    `address_paris_en` TEXT,
    `address_paris_fr` TEXT,
    `address_paris_ar` TEXT,
    `address_tunis_en` TEXT,
    `address_tunis_fr` TEXT,
    `address_tunis_ar` TEXT,
    `linkedin_url` VARCHAR(255),
    `twitter_url` VARCHAR(255),
    `facebook_url` VARCHAR(255),
    `instagram_url` VARCHAR(255),
    `youtube_url` VARCHAR(255),
    `business_hours_en` TEXT,
    `business_hours_fr` TEXT,
    `business_hours_ar` TEXT,
    `site_title_en` VARCHAR(255),
    `site_title_fr` VARCHAR(255),
    `site_title_ar` VARCHAR(255),
    `meta_description_en` TEXT,
    `meta_description_fr` TEXT,
    `meta_description_ar` TEXT,
    `primary_color` VARCHAR(20) DEFAULT '#001F3F',
    `secondary_color` VARCHAR(20) DEFAULT '#D4AF37',
    `company_siret` VARCHAR(50),
    `company_tva` VARCHAR(50),
    `company_rcs` VARCHAR(50),
    `company_capital` VARCHAR(50),
    `company_legal_form` VARCHAR(50) DEFAULT 'SASU',
    `is_active` BOOLEAN DEFAULT TRUE,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `updated_by` CHAR(36),
    PRIMARY KEY (`id`),
    UNIQUE KEY `key_unique` (`key`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Extended Features
CREATE TABLE `notifications` (
    `id` CHAR(36) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('booking', 'reminder', 'message', 'system') NOT NULL,
    `read` BOOLEAN DEFAULT FALSE,
    `link` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_notifications_user_id` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE `documents` (
    `id` CHAR(36) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `file_url` TEXT NOT NULL,
    `file_type` VARCHAR(50) NOT NULL,
    `file_size` INTEGER NOT NULL,
    `category` ENUM('contract', 'invoice', 'id', 'other'),
    `status` ENUM('pending', 'processing', 'analyzed', 'failed') DEFAULT 'pending',
    `analysis_result` JSON,
    `extracted_data` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_documents_user_id` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE `admin_users` (
    `id` CHAR(36) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `role` ENUM('super_admin', 'admin', 'moderator') DEFAULT 'admin',
    `permissions` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_id_unique` (`user_id`),
    UNIQUE KEY `email_unique` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE `user_profiles` (
    `id` CHAR(36) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255),
    `phone` VARCHAR(50),
    `company` VARCHAR(255),
    `country` VARCHAR(100),
    `language` ENUM('en', 'fr', 'ar') DEFAULT 'fr',
    `avatar_url` TEXT,
    `preferences` JSON,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_id_unique` (`user_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE `recommendations` (
    `id` CHAR(36) NOT NULL,
    `user_id` VARCHAR(255) NOT NULL,
    `service_slug` VARCHAR(255) NOT NULL,
    `reason` TEXT NOT NULL,
    `score` FLOAT NOT NULL,
    `shown` BOOLEAN DEFAULT FALSE,
    `clicked` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
CREATE TABLE `activity_logs` (
    `id` CHAR(36) NOT NULL,
    `user_id` VARCHAR(255),
    `action` VARCHAR(255) NOT NULL,
    `entity_type` VARCHAR(50),
    `entity_id` CHAR(36),
    `metadata` JSON,
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ==========================================
-- 3. INSERT DEFAULT DATA
-- ==========================================
-- Main Site Settings
INSERT INTO `site_settings` (
        `id`,
        `key`,
        `company_name`,
        `phone_primary`,
        `email_primary`,
        `address_paris_en`,
        `address_tunis_en`
    )
VALUES (
        UUID(),
        'main',
        'SYGMA CONSULT',
        '+33 7 52 03 47 86',
        'contact@sygma-consult.com',
        '6 rue Paul Verlaine, 93130 Noisy-le-Sec, Paris, France',
        'Les Berges du Lac II, 1053 Tunis, Tunisia'
    ) ON DUPLICATE KEY
UPDATE `company_name` =
VALUES(`company_name`),
    `phone_primary` =
VALUES(`phone_primary`);
-- Secrets (Placeholders)
INSERT INTO `site_settings` (`id`, `key`, `value`, `description`)
VALUES (
        UUID(),
        'STRIPE_SECRET_KEY',
        'REPLACE_ME',
        'Stripe Secret Key'
    ),
    (
        UUID(),
        'STRIPE_WEBHOOK_SECRET',
        'REPLACE_ME',
        'Stripe Webhook Secret'
    ),
    (
        UUID(),
        'SMTP_HOST',
        'smtp.hostinger.com',
        'SMTP Host'
    ),
    (UUID(), 'SMTP_PORT', '465', 'SMTP Port'),
    (
        UUID(),
        'SMTP_USER',
        'contact@sygma-consult.com',
        'SMTP User'
    ),
    (
        UUID(),
        'SMTP_PASSWORD',
        'REPLACE_ME',
        'SMTP Password'
    ),
    (
        UUID(),
        'GOOGLE_CLIENT_ID',
        'REPLACE_ME',
        'Google Client ID'
    ),
    (
        UUID(),
        'GOOGLE_CLIENT_SECRET',
        'REPLACE_ME',
        'Google Client Secret'
    ) ON DUPLICATE KEY
UPDATE `description` =
VALUES(`description`);
-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;