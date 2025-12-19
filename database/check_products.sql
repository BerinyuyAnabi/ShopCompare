-- Check products table structure and data
DESCRIBE products;

-- Show all products
SELECT product_id, name, price, stock_quantity, shop_id, is_active FROM products LIMIT 10;

-- Count total products
SELECT COUNT(*) as total_products FROM products;

-- Show products with shop information
SELECT
    p.product_id,
    p.name,
    p.price,
    p.stock_quantity,
    s.shop_name
FROM products p
LEFT JOIN shops s ON p.shop_id = s.shop_id
LIMIT 10;
