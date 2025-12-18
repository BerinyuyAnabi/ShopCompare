<?php

require_once __DIR__ . '/../config/cors.php';

// Database connection
require_once __DIR__ . '/../db/connect_db.php';

// Set content type to JSON
header('Content-Type: application/json');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    // Get shop_id from query parameter
    $shopId = isset($_GET['shop_id']) ? intval($_GET['shop_id']) : 0;

    if ($shopId <= 0) {
        throw new Exception('Invalid shop ID');
    }

    // Fetch shop details
    $stmt = $conn->prepare("
        SELECT
            shop_id,
            shop_name,
            owner_first_name,
            owner_last_name,
            email,
            phone,
            street_address,
            country,
            logo_url,
            description,
            rating,
            total_reviews,
            is_verified,
            is_active,
            created_at,
            updated_at
        FROM shops
        WHERE shop_id = ? AND is_active = 1
    ");

    $stmt->bind_param("i", $shopId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('Shop not found');
    }

    $shop = $result->fetch_assoc();
    $stmt->close();
    $conn->close();

    echo json_encode([
        'success' => true,
        'shop' => $shop
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->close();
    }

    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
