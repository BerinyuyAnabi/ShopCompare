<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/../config/cors.php';

session_start();

// Load authentication middleware
require_once __DIR__ . '/../middleware/auth.php';

// Require customer authentication for all wishlist operations
requireCustomer();

// database connection
require_once __DIR__ . '/../db/connect_db.php';

//content type to JSON
header('Content-Type: application/json');

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            handleGet($conn);
            break;
        case 'POST':
            handlePost($conn);
            break;
        case 'DELETE':
            handleDelete($conn);
            break;
        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Method not allowed'
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

$conn->close();

// Get wishlist items for a customer
function handleGet($conn) {
    if (!isset($_GET['customer_id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Customer ID is required'
        ]);
        return;
    }

    $customerId = intval($_GET['customer_id']);

    $stmt = $conn->prepare("
        SELECT
            w.wishlist_id,
            w.product_id,
            w.customer_id,
            w.added_at,
            p.name,
            p.description,
            p.price,
            p.image_url,
            p.stock_quantity,
            p.category_id,
            c.category_name as category
        FROM wishlist w
        JOIN products p ON w.product_id = p.product_id
        LEFT JOIN categories c ON p.category_id = c.category_id
        WHERE w.customer_id = ?
        ORDER BY w.added_at DESC
    ");

    $stmt->bind_param("i", $customerId);

    if (!$stmt->execute()) {
        throw new Exception('Failed to fetch wishlist: ' . $stmt->error);
    }

    $result = $stmt->get_result();
    $wishlist = [];

    while ($row = $result->fetch_assoc()) {
        $wishlist[] = $row;
    }

    $stmt->close();

    echo json_encode([
        'success' => true,
        'wishlist' => $wishlist,
        'count' => count($wishlist)
    ]);
}

// Add item to wishlist
function handlePost($conn) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['customer_id']) || !isset($input['product_id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Customer ID and Product ID are required'
        ]);
        return;
    }

    $customerId = intval($input['customer_id']);
    $productId = intval($input['product_id']);

    // Check if item already exists in wishlist
    $checkStmt = $conn->prepare("SELECT wishlist_id FROM wishlist WHERE customer_id = ? AND product_id = ?");
    $checkStmt->bind_param("ii", $customerId, $productId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        $checkStmt->close();
        echo json_encode([
            'success' => true,
            'message' => 'Item already in wishlist',
            'already_exists' => true
        ]);
        return;
    }
    $checkStmt->close();

    // Add to wishlist
    $stmt = $conn->prepare("INSERT INTO wishlist (customer_id, product_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $customerId, $productId);

    if (!$stmt->execute()) {
        throw new Exception('Failed to add to wishlist: ' . $stmt->error);
    }

    $wishlistId = $conn->insert_id;
    $stmt->close();

    echo json_encode([
        'success' => true,
        'message' => 'Item added to wishlist',
        'wishlist_id' => $wishlistId,
        'already_exists' => false
    ]);
}

// Remove item from wishlist
function handleDelete($conn) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['wishlist_id']) && (!isset($input['customer_id']) || !isset($input['product_id']))) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Either wishlist_id or both customer_id and product_id are required'
        ]);
        return;
    }

    if (isset($input['wishlist_id'])) {
        $wishlistId = intval($input['wishlist_id']);
        $stmt = $conn->prepare("DELETE FROM wishlist WHERE wishlist_id = ?");
        $stmt->bind_param("i", $wishlistId);
    } else {
        $customerId = intval($input['customer_id']);
        $productId = intval($input['product_id']);
        $stmt = $conn->prepare("DELETE FROM wishlist WHERE customer_id = ? AND product_id = ?");
        $stmt->bind_param("ii", $customerId, $productId);
    }

    if (!$stmt->execute()) {
        throw new Exception('Failed to remove from wishlist: ' . $stmt->error);
    }

    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Wishlist item not found'
        ]);
        $stmt->close();
        return;
    }

    $stmt->close();

    echo json_encode([
        'success' => true,
        'message' => 'Item removed from wishlist'
    ]);
}
