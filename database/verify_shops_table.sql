-- Verify and update shops table structure for shop_users integration
-- Run this to check if the shops table has the correct structure

-- First, describe the current structure
DESCRIBE shops;

-- If user_id column doesn't exist or needs to be updated, run:
-- ALTER TABLE shops ADD COLUMN user_id INT NOT NULL AFTER shop_id;
-- ALTER TABLE shops ADD CONSTRAINT fk_shops_user_id FOREIGN KEY (user_id) REFERENCES shop_users(user_id) ON DELETE CASCADE;

-- Expected shops table structure:
/*
CREATE TABLE IF NOT EXISTS shops (
    shop_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    shop_name VARCHAR(255) NOT NULL,
    owner_first_name VARCHAR(100) NOT NULL,
    owner_last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    street_address TEXT,
    country VARCHAR(100),
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES shop_users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/
