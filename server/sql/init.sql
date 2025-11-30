-- Create database and tables for Lebanon Traffic Dashboard
CREATE DATABASE IF NOT EXISTS `lebanon_traffic` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lebanon_traffic`;

-- Traffic table (basic columns extracted from CSV)
CREATE TABLE IF NOT EXISTS `traffic` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `date` DATE NULL,
  `time` TIME NULL,
  `lon` DOUBLE NULL,
  `lat` DOUBLE NULL,
  `course` DOUBLE NULL,
  `velocity` DOUBLE NULL,
  `osm_id` VARCHAR(255) NULL,
  INDEX (`date`),
  INDEX (`osm_id`)
);

-- Users table (username + password hash)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
