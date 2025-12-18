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
    // Fetch all active shops
    $stmt = $conn->prepare("
        SELECT
            shop_id,
            shop_name,
            email,
            phone,
            street_address,
            country,
            logo_url,
            description,
            rating,
            total_reviews,
            is_verified,
            created_at
        FROM shops
        WHERE is_active = 1
        ORDER BY created_at DESC
    ");

    $stmt->execute();
    $result = $stmt->get_result();

    $shops = [];
    while ($row = $result->fetch_assoc()) {
        $shops[] = $row;
    }

    $stmt->close();
    $conn->close();

    echo json_encode([
        'success' => true,
        'shops' => $shops,
        'count' => count($shops)
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->close();
    }

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch shops: ' . $e->getMessage()
    ]);
}
