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
        case 'PUT':
            handlePut($conn);
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

// Fetch products for a specific shop
function handleGet($conn) {
    if (!isset($_GET['shop_id'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Shop ID is required'
        ]);
        return;
    }

    $shopId = intval($_GET['shop_id']);

    $stmt = $conn->prepare("
        SELECT
            product_id,
            shop_id,
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url,
            is_active,
            created_at,
            updated_at
        FROM products
        WHERE shop_id = ?
        ORDER BY created_at DESC
    ");

    $stmt->bind_param("i", $shopId);

    if (!$stmt->execute()) {
        throw new Exception('Failed to fetch products: ' . $stmt->error);
    }

    $result = $stmt->get_result();
    $products = [];

    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    $stmt->close();

    echo json_encode([
        'success' => true,
        'products' => $products,
        'count' => count($products)
    ]);
}

// Create a new product
function handlePost($conn) {
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    $requiredFields = ['shop_id', 'name', 'price', 'stock_quantity'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || $input[$field] === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => "Missing required field: $field"
            ]);
            return;
        }
    }

    $shopId = intval($input['shop_id']);
    $name = trim($input['name']);
    $description = isset($input['description']) ? trim($input['description']) : null;
    $price = floatval($input['price']);
    $stockQuantity = intval($input['stock_quantity']);
    $category = isset($input['category']) ? trim($input['category']) : null;
    $imageUrl = isset($input['image_url']) ? trim($input['image_url']) : null;

    // Validate price and stock
    if ($price < 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Price cannot be negative'
        ]);
        return;
    }

    if ($stockQuantity < 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Stock quantity cannot be negative'
        ]);
        return;
    }

    $stmt = $conn->prepare("
        INSERT INTO products (
            shop_id,
            name,
            description,
            price,
            stock_quantity,
            category,
            image_url,
            is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    ");

    $stmt->bind_param(
        "issdiis",
        $shopId,
        $name,
        $description,
        $price,
        $stockQuantity,
        $category,
        $imageUrl
    );

    if (!$stmt->execute()) {
        throw new Exception('Failed to create product: ' . $stmt->error);
    }

    $productId = $conn->insert_id;
    $stmt->close();

    echo json_encode([
        'success' => true,
        'message' => 'Product created successfully',
        'product_id' => $productId
    ]);
}

// PUT - Update an existing product
function handlePut($conn) {
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate product_id
    if (!isset($input['product_id']) || $input['product_id'] === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Product ID is required'
        ]);
        return;
    }

    $productId = intval($input['product_id']);

    //  update query 
    $updateFields = [];
    $params = [];
    $types = '';

    if (isset($input['name']) && $input['name'] !== '') {
        $updateFields[] = "name = ?";
        $params[] = trim($input['name']);
        $types .= 's';
    }

    if (isset($input['description'])) {
        $updateFields[] = "description = ?";
        $params[] = trim($input['description']);
        $types .= 's';
    }

    if (isset($input['price']) && $input['price'] !== '') {
        $price = floatval($input['price']);
        if ($price < 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Price cannot be negative'
            ]);
            return;
        }
        $updateFields[] = "price = ?";
        $params[] = $price;
        $types .= 'd';
    }

    if (isset($input['stock_quantity']) && $input['stock_quantity'] !== '') {
        $stockQuantity = intval($input['stock_quantity']);
        if ($stockQuantity < 0) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Stock quantity cannot be negative'
            ]);
            return;
        }
        $updateFields[] = "stock_quantity = ?";
        $params[] = $stockQuantity;
        $types .= 'i';
    }

    if (isset($input['category'])) {
        $updateFields[] = "category = ?";
        $params[] = trim($input['category']);
        $types .= 's';
    }

    if (isset($input['image_url'])) {
        $updateFields[] = "image_url = ?";
        $params[] = trim($input['image_url']);
        $types .= 's';
    }

    if (isset($input['is_active'])) {
        $updateFields[] = "is_active = ?";
        $params[] = intval($input['is_active']);
        $types .= 'i';
    }

    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'No fields to update'
        ]);
        return;
    }

    // Add updated_at timestamp
    $updateFields[] = "updated_at = CURRENT_TIMESTAMP";

    // Add product_id to params
    $params[] = $productId;
    $types .= 'i';

    $sql = "UPDATE products SET " . implode(", ", $updateFields) . " WHERE product_id = ?";
    $stmt = $conn->prepare($sql);

    // Bind parameters 
    $stmt->bind_param($types, ...$params);

    if (!$stmt->execute()) {
        throw new Exception('Failed to update product: ' . $stmt->error);
    }

    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Product not found or no changes made'
        ]);
        $stmt->close();
        return;
    }

    $stmt->close();

    echo json_encode([
        'success' => true,
        'message' => 'Product updated successfully'
    ]);
}

// DELETE - Delete a product
function handleDelete($conn) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['product_id']) || $input['product_id'] === '') {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Product ID is required'
        ]);
        return;
    }

    $productId = intval($input['product_id']);

    $stmt = $conn->prepare("DELETE FROM products WHERE product_id = ?");
    $stmt->bind_param("i", $productId);

    if (!$stmt->execute()) {
        throw new Exception('Failed to delete product: ' . $stmt->error);
    }

    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Product not found'
        ]);
        $stmt->close();
        return;
    }

    $stmt->close();

    echo json_encode([
        'success' => true,
        'message' => 'Product deleted successfully'
    ]);
}
