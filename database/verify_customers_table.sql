-- Verify and update customers table structure for shop_users integration
-- Run this to check if the customers table has the correct structure

-- First, describe the current structure
DESCRIBE customers;

-- If user_id column doesn't exist or needs to be updated, run:
-- ALTER TABLE customers ADD COLUMN user_id INT NOT NULL AFTER customer_id;
-- ALTER TABLE customers ADD CONSTRAINT fk_customers_user_id FOREIGN KEY (user_id) REFERENCES shop_users(user_id) ON DELETE CASCADE;

-- Expected customers table structure:
/*
CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES shop_users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/
