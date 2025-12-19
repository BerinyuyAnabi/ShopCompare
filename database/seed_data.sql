-- ============================================================================
-- ShopCompare Database Seed Data with Internet Images
-- This file contains sample data with image URLs from the internet
-- Users can still upload their own images via the shop dashboard
-- ============================================================================

-- ============================================================================
-- 1. CATEGORIES
-- ============================================================================
INSERT INTO categories (category_id, category_name, parent_category_id, description, is_active) VALUES
(1, 'Electronics', NULL, 'Electronic devices and gadgets', 1),
(2, 'Home & Garden', NULL, 'Home improvement and garden supplies', 1),
(3, 'Clothing', NULL, 'Apparel and accessories', 1),
(4, 'Sports & Outdoors', NULL, 'Sports equipment and outdoor gear', 1),
(5, 'Books', NULL, 'Books and reading materials', 1),
(6, 'Food & Beverages', NULL, 'Food items and drinks', 1)
ON DUPLICATE KEY UPDATE category_name=VALUES(category_name);

-- ============================================================================
-- 2. SHOP USERS (Authentication accounts)
-- ============================================================================
-- Password for all test accounts: password123
INSERT INTO shop_users (user_id, username, email, password_hash, user_type, is_active) VALUES
(1, 'techworld', 'contact@techworld.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'shop_owner', 1),
(2, 'homestore', 'info@homestore.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'shop_owner', 1),
(3, 'fashionhub', 'hello@fashionhub.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'shop_owner', 1),
(4, 'sportsplus', 'support@sportsplus.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'shop_owner', 1),
(5, 'bookworm', 'books@bookworm.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'shop_owner', 1),
(6, 'johndoe', 'john@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 1),
(7, 'janedoe', 'jane@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 1)
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- ============================================================================
-- 3. CUSTOMERS
-- ============================================================================
INSERT INTO customers (customer_id, user_id, first_name, last_name, phone, address_line1, region) VALUES
(1, 6, 'John', 'Doe', '0244123456', 'East Legon, Plot 45', 'Greater Accra'),
(2, 7, 'Jane', 'Doe', '0555987654', 'Osu Oxford Street', 'Greater Accra')
ON DUPLICATE KEY UPDATE first_name=VALUES(first_name);

-- ============================================================================
-- 4. SHOPS
-- ============================================================================
INSERT INTO shops (shop_id, user_id, shop_name, owner_first_name, owner_last_name, street_address, country, phone, email, description, rating, total_reviews, is_verified, is_active) VALUES
(1, 1, 'Tech World Ghana', 'Kwame', 'Mensah', 'Accra Mall, Tetteh Quarshie', 'Ghana', '0302123456', 'contact@techworld.com', 'Leading electronics and gadgets store in Ghana', 4.50, 245, 1, 1),
(2, 2, 'Home & Living Store', 'Ama', 'Adjei', 'Achimota Retail Centre', 'Ghana', '0244567890', 'info@homestore.com', 'Quality home and garden products', 4.30, 189, 1, 1),
(3, 3, 'Fashion Hub Accra', 'Yaw', 'Boateng', 'Oxford Street, Osu', 'Ghana', '0201234567', 'hello@fashionhub.com', 'Trendy clothing and accessories', 4.60, 312, 1, 1),
(4, 4, 'Sports Plus Ghana', 'Akosua', 'Frimpong', 'Spintex Road, Community 18', 'Ghana', '0558765432', 'support@sportsplus.com', 'All your sports and outdoor needs', 4.20, 156, 1, 1),
(5, 5, 'Bookworm Ghana', 'Kofi', 'Asante', 'Ring Road, Osu', 'Ghana', '0277654321', 'books@bookworm.com', 'Books, stationery and educational materials', 4.40, 98, 1, 1)
ON DUPLICATE KEY UPDATE shop_name=VALUES(shop_name);

-- ============================================================================
-- 5. PRODUCTS WITH INTERNET IMAGE URLS
-- ============================================================================
-- Electronics from Tech World
INSERT INTO products (product_id, shop_id, name, description, price, stock_quantity, category_id, image_url, is_active) VALUES
(1, 1, 'Samsung Galaxy S23', 'Latest Samsung flagship smartphone with 256GB storage, 8GB RAM, triple camera system', 4500.00, 15, 1, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', 1),
(2, 1, 'HP Pavilion Laptop 15.6"', 'Intel Core i5 11th Gen, 8GB RAM, 512GB SSD, Windows 11', 3200.00, 8, 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 1),
(3, 1, 'Sony WH-1000XM5 Headphones', 'Premium noise-cancelling wireless headphones with 30hr battery', 1800.00, 20, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 1),
(4, 1, 'Dell 27" Monitor', '4K UHD display, 60Hz, USB-C connectivity', 2100.00, 12, 1, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', 1),
(5, 1, 'Logitech MX Master 3', 'Ergonomic wireless mouse with precision scroll wheel', 380.00, 25, 1, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', 1),

-- Home Store Products
(6, 2, 'Blender Pro 3000', 'Heavy duty blender with 10 speed settings, 2L capacity', 450.00, 30, 2, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500', 1),
(7, 2, 'Rice Cooker Deluxe', 'Automatic rice cooker with steamer, 1.8L capacity', 320.00, 18, 2, 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500', 1),
(8, 2, 'Garden Tool Set', 'Complete 10-piece garden tool set with carrying bag', 195.00, 15, 2, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500', 1),
(9, 2, 'LED Desk Lamp', 'Adjustable LED lamp with USB charging port', 125.00, 40, 2, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', 1),
(10, 2, 'Coffee Maker', 'Automatic drip coffee maker, 12-cup capacity', 280.00, 22, 2, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 1),

-- Fashion Hub Products
(11, 3, 'Nike Running Shoes', 'Comfortable running shoes for all terrains, sizes 38-45', 450.00, 35, 3, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 1),
(12, 3, 'Adidas T-Shirt', 'Cotton sports t-shirt, multiple colors available', 120.00, 60, 3, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 1),
(13, 3, 'Levi''s Jeans', 'Classic fit denim jeans, blue wash', 380.00, 28, 3, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500', 1),
(14, 3, 'Leather Wallet', 'Genuine leather bi-fold wallet with RFID protection', 95.00, 45, 3, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', 1),
(15, 3, 'Canvas Backpack', 'Stylish and durable backpack with laptop compartment', 220.00, 32, 3, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 1),

-- Sports Plus Products
(16, 4, 'Yoga Mat Premium', 'Extra thick yoga mat with carrying strap, non-slip', 85.00, 50, 4, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 1),
(17, 4, 'Dumbbell Set 20kg', 'Adjustable dumbbell set with case', 340.00, 15, 4, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', 1),
(18, 4, 'Football Size 5', 'Professional football, FIFA approved', 120.00, 25, 4, 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500', 1),
(19, 4, 'Resistance Bands Set', 'Set of 5 resistance bands with different strengths', 75.00, 40, 4, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500', 1),
(20, 4, 'Water Bottle 1L', 'BPA-free sports water bottle with time markers', 35.00, 100, 4, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', 1),

-- Bookworm Products
(21, 5, 'Things Fall Apart', 'Classic African literature by Chinua Achebe', 65.00, 45, 5, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 1),
(22, 5, 'Python Programming Book', 'Learn Python programming from basics to advanced', 180.00, 20, 5, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', 1),
(23, 5, 'Notebook Set A4', 'Set of 3 ruled notebooks, 200 pages each', 45.00, 80, 5, 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500', 1),
(24, 5, 'Scientific Calculator', 'Advanced scientific calculator for students', 95.00, 35, 5, 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=500', 1),
(25, 5, 'Atlas of Ghana', 'Comprehensive geographical atlas of Ghana', 120.00, 15, 5, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================================================
-- 6. SAME PRODUCTS IN MULTIPLE SHOPS (For price comparison)
-- ============================================================================
-- Samsung Galaxy S23 in other shops
INSERT INTO products (shop_id, name, description, price, stock_quantity, category_id, image_url, is_active) VALUES
(3, 'Samsung Galaxy S23', 'Latest Samsung flagship smartphone with 256GB storage', 4650.00, 10, 1, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', 1),
(4, 'Samsung Galaxy S23', 'Latest Samsung flagship smartphone with 256GB storage', 4400.00, 6, 1, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500', 1)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- HP Laptop in other shops
INSERT INTO products (shop_id, name, description, price, stock_quantity, category_id, image_url, is_active) VALUES
(2, 'HP Pavilion Laptop 15.6"', 'Intel Core i5 11th Gen, 8GB RAM, 512GB SSD', 3100.00, 5, 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 1),
(5, 'HP Pavilion Laptop 15.6"', 'Intel Core i5 11th Gen, 8GB RAM, 512GB SSD', 3350.00, 3, 1, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 1)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- Nike Running Shoes in other shops
INSERT INTO products (shop_id, name, description, price, stock_quantity, category_id, image_url, is_active) VALUES
(1, 'Nike Running Shoes', 'Comfortable running shoes for all terrains', 480.00, 20, 3, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 1),
(4, 'Nike Running Shoes', 'Comfortable running shoes for all terrains', 420.00, 30, 3, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 1)
ON DUPLICATE KEY UPDATE price=VALUES(price);

-- ============================================================================
-- 7. PRODUCT REVIEWS
-- ============================================================================
INSERT INTO product_reviews (review_id, product_id, customer_id, rating, review_text, is_verified_purchase, helpful_count, created_at) VALUES
(1, 1, 1, 5, 'Excellent phone! Camera quality is amazing and battery lasts all day.', 1, 12, '2025-12-10 10:30:00'),
(2, 1, 2, 4, 'Great phone but a bit pricey. Worth it for the features though.', 1, 8, '2025-12-12 14:15:00'),
(3, 2, 1, 5, 'Best laptop for the price. Fast and reliable for work and study.', 1, 15, '2025-12-11 09:20:00'),
(4, 3, 2, 5, 'Noise cancellation is incredible. Perfect for long flights.', 1, 20, '2025-12-13 16:45:00'),
(5, 11, 1, 4, 'Very comfortable running shoes. Good grip on different surfaces.', 1, 6, '2025-12-14 11:00:00')
ON DUPLICATE KEY UPDATE rating=VALUES(rating);

-- ============================================================================
-- 8. WISHLIST
-- ============================================================================
INSERT INTO wishlist (wishlist_id, customer_id, product_id, added_at) VALUES
(1, 1, 1, '2025-12-15 08:00:00'),
(2, 1, 4, '2025-12-15 08:05:00'),
(3, 2, 2, '2025-12-16 10:30:00'),
(4, 2, 11, '2025-12-16 10:35:00')
ON DUPLICATE KEY UPDATE added_at=VALUES(added_at);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
SELECT 'Categories:', COUNT(*) as count FROM categories;
SELECT 'Shop Users:', COUNT(*) as count FROM shop_users;
SELECT 'Customers:', COUNT(*) as count FROM customers;
SELECT 'Shops:', COUNT(*) as count FROM shops;
SELECT 'Products:', COUNT(*) as count FROM products;
SELECT 'Product Reviews:', COUNT(*) as count FROM product_reviews;
SELECT 'Wishlist Items:', COUNT(*) as count FROM wishlist;
