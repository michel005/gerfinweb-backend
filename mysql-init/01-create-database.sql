-- Create database if not exists
CREATE DATABASE IF NOT EXISTS gerfinweb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user if not exists
CREATE USER IF NOT EXISTS 'gerfinweb_user'@'%' IDENTIFIED BY 'gerfinweb_pass';

-- Grant privileges
GRANT ALL PRIVILEGES ON gerfinweb.* TO 'gerfinweb_user'@'%';
GRANT ALL PRIVILEGES ON gerfinweb.* TO 'root'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Use the database
USE gerfinweb;

-- Set timezone
SET time_zone = '-03:00';

-- Create initial admin user (optional)
-- This will be created by the application when it starts
