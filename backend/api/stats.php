<?php
// 
ob_start();

error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/../config/cors.php';

session_start();

// database connection
require_once __DIR__ . '/../db/connect_db.php';

//content type to JSON
header('Content-Type: application/json');

// Clear any output 
ob_end_clean();
ob_start();

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
    // Get total number of shops
    $shopStmt = $conn->prepare("SELECT COUNT(*) as total FROM shops WHERE is_active = 1");
    $shopStmt->execute();
    $shopResult = $shopStmt->get_result();
    $totalShops = $shopResult->fetch_assoc()['total'];
    $shopStmt->close();

    // Get total number of customers
    $customerStmt = $conn->prepare("SELECT COUNT(*) as total FROM customers");
    $customerStmt->execute();
    $customerResult = $customerStmt->get_result();
    $totalCustomers = $customerResult->fetch_assoc()['total'];
    $customerStmt->close();

    // Get total number of products
    $productStmt = $conn->prepare("SELECT COUNT(*) as total FROM products WHERE is_active = 1");
    $productStmt->execute();
    $productResult = $productStmt->get_result();
    $totalProducts = $productResult->fetch_assoc()['total'];
    $productStmt->close();

    $conn->close();

    echo json_encode([
        'success' => true,
        'stats' => [
            'total_shops' => $totalShops,
            'total_customers' => $totalCustomers,
            'total_products' => $totalProducts
        ]
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
