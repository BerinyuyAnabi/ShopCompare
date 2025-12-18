<?php

require_once __DIR__ . '/../config/cors.php';

session_start();

// database connection
require_once __DIR__ . '/../db/connect_db.php';

//content type to JSON
header('Content-Type: application/json');

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    if (!isset($_GET['product_id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Product ID is required'
        ]);
        exit();
    }

    $productId = intval($_GET['product_id']);

    // Get product details with shop information and category
    $stmt = $conn->prepare("
        SELECT
            p.product_id,
            p.shop_id,
            p.name,
            p.description,
            p.price,
            p.stock_quantity,
            p.category_id,
            c.category_name as category,
            p.image_url,
            p.is_active,
            p.created_at,
            p.updated_at,
            s.shop_name,
            s.logo_url as shop_logo,
            s.street_address,
            s.country,
            s.phone as shop_phone
        FROM products p
        JOIN shops s ON p.shop_id = s.shop_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE p.product_id = ?
    ");

    $stmt->bind_param("i", $productId);

    if (!$stmt->execute()) {
        throw new Exception('Failed to fetch product: ' . $stmt->error);
    }

    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Product not found'
        ]);
        $stmt->close();
        $conn->close();
        exit();
    }

    $product = $result->fetch_assoc();
    $stmt->close();

    // Get all shops selling this product (for comparison)
    $compareStmt = $conn->prepare("
        SELECT
            p.product_id,
            p.shop_id,
            p.price,
            p.stock_quantity,
            s.shop_name,
            s.logo_url as shop_logo,
            s.street_address,
            s.country,
            s.phone as shop_phone
        FROM products p
        JOIN shops s ON p.shop_id = s.shop_id
        WHERE p.name = ? AND p.is_active = 1 AND s.is_active = 1
        ORDER BY p.price ASC
    ");

    $productName = $product['name'];
    $compareStmt->bind_param("s", $productName);
    $compareStmt->execute();
    $compareResult = $compareStmt->get_result();

    $compareShops = [];
    while ($row = $compareResult->fetch_assoc()) {
        $compareShops[] = $row;
    }
    $compareStmt->close();

    $conn->close();

    echo json_encode([
        'success' => true,
        'product' => $product,
        'compare_shops' => $compareShops,
        'compare_count' => count($compareShops)
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->close();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
