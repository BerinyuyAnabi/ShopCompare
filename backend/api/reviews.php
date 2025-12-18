<?php

require_once __DIR__ . '/../config/cors.php';

session_start();

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

// Get reviews for a product
function handleGet($conn) {
    if (!isset($_GET['product_id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Product ID is required'
        ]);
        return;
    }

    $productId = intval($_GET['product_id']);

    $stmt = $conn->prepare("
        SELECT
            review_id,
            product_id,
            customer_id,
            rating,
            comment,
            verified_purchase,
            helpful_count,
            created_at
        FROM reviews
        WHERE product_id = ?
        ORDER BY created_at DESC
    ");

    $stmt->bind_param("i", $productId);

    if (!$stmt->execute()) {
        throw new Exception('Failed to fetch reviews: ' . $stmt->error);
    }

    $result = $stmt->get_result();
    $reviews = [];

    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }

    $stmt->close();

    echo json_encode([
        'success' => true,
        'reviews' => $reviews,
        'count' => count($reviews)
    ]);
}

// Increment helpful counter
function handlePost($conn) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['review_id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Review ID is required'
        ]);
        return;
    }

    $reviewId = intval($input['review_id']);

    // Increment helpful count
    $stmt = $conn->prepare("
        UPDATE reviews
        SET helpful_count = helpful_count + 1
        WHERE review_id = ?
    ");

    $stmt->bind_param("i", $reviewId);

    if (!$stmt->execute()) {
        throw new Exception('Failed to increment helpful count: ' . $stmt->error);
    }

    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Review not found'
        ]);
        $stmt->close();
        return;
    }

    // Get updated helpful count
    $stmt->close();
    $stmt = $conn->prepare("SELECT helpful_count FROM reviews WHERE review_id = ?");
    $stmt->bind_param("i", $reviewId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $helpfulCount = $row['helpful_count'];
    $stmt->close();

    echo json_encode([
        'success' => true,
        'message' => 'Helpful count incremented',
        'helpful_count' => $helpfulCount
    ]);
}
