-- Sample product data for ShopCompare
-- Make sure you have shops and categories in your database first

-- First, let's check if we have categories
-- If not, insert some basic categories
INSERT IGNORE INTO categories (category_id, category_name, description) VALUES
(1, 'Electronics', 'Electronic devices and gadgets'),
(2, 'Clothing', 'Apparel and fashion items'),
(3, 'Home & Garden', 'Home improvement and garden supplies'),
(4, 'Books', 'Books and reading materials'),
(5, 'Food & Beverages', 'Food items and drinks');

-- Sample products (adjust shop_id based on your existing shops)
-- These assume you have shop_id 1, 2, 3, etc. in your shops table
-- Check your shops table first: SELECT shop_id, shop_name FROM shops;

-- Example products for shop 1
INSERT INTO products (shop_id, name, description, price, stock_quantity, category_id, is_active) VALUES
(1, 'Samsung Galaxy S23', 'Latest Samsung flagship smartphone with 256GB storage', 4500.00, 15, 1, 1),
(1, 'HP Laptop 15.6"', 'Intel Core i5, 8GB RAM, 512GB SSD', 3200.00, 8, 1, 1),
(1, 'Sony Headphones WH-1000XM5', 'Premium noise-cancelling wireless headphones', 1800.00, 20, 1, 1);

-- Example products for shop 2 (same products, different prices)
INSERT INTO products (shop_id, name, description, price, stock_quantity, category_id, is_active) VALUES
(2, 'Samsung Galaxy S23', 'Latest Samsung flagship smartphone with 256GB storage', 4650.00, 10, 1, 1),
(2, 'HP Laptop 15.6"', 'Intel Core i5, 8GB RAM, 512GB SSD', 3100.00, 5, 1, 1),
(2, 'Sony Headphones WH-1000XM5', 'Premium noise-cancelling wireless headphones', 1750.00, 12, 1, 1);

-- Example products for shop 3
INSERT INTO products (shop_id, name, description, price, stock_quantity, category_id, is_active) VALUES
(3, 'Samsung Galaxy S23', 'Latest Samsung flagship smartphone with 256GB storage', 4400.00, 6, 1, 1),
(3, 'Nike Running Shoes', 'Comfortable running shoes for all terrains', 450.00, 30, 2, 1),
(3, 'Adidas T-Shirt', 'Cotton sports t-shirt, multiple colors available', 120.00, 50, 2, 1);

-- Note: Before running this, check your existing shops:
-- SELECT shop_id, shop_name FROM shops;
-- And adjust the shop_id values above to match your actual shop IDs
