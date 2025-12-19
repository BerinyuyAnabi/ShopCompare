<?php
// Disable error display to prevent non-JSON output
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/../config/cors.php';

session_start();

// Load authentication middleware
require_once __DIR__ . '/../middleware/auth.php';

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
            // Require shop owner authentication for creating products
            requireShopOwner();
            handlePost($conn);
            break;
        case 'PUT':
            // Require shop owner authentication for updating products
            requireShopOwner();
            handlePut($conn);
            break;
        case 'DELETE':
            // Require shop owner authentication for deleting products
            requireShopOwner();
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

// Fetch products for a specific shop or all products
function handleGet($conn) {
    // If shop_id is provided, fetch products for that shop only
    // Otherwise, fetch all products with shop information
    if (isset($_GET['shop_id'])) {
        $shopId = intval($_GET['shop_id']);

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
                p.updated_at
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            WHERE p.shop_id = ?
            ORDER BY p.created_at DESC
        ");

        $stmt->bind_param("i", $shopId);
    } else {
        // Fetch all products with shop information
        $stmt = $conn->prepare("
            SELECT
                p.product_id,
                p.shop_id,
                s.shop_name,
                p.name,
                p.description,
                p.price,
                p.stock_quantity,
                p.category_id,
                c.category_name as category,
                p.image_url,
                p.is_active,
                p.created_at,
                p.updated_at
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            LEFT JOIN shops s ON p.shop_id = s.shop_id
            WHERE p.is_active = 1
            ORDER BY p.created_at DESC
        ");
    }

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
    $categoryId = isset($input['category_id']) ? intval($input['category_id']) : null;
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
            category_id,
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
        $categoryId,
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

    if (isset($input['category_id'])) {
        $updateFields[] = "category_id = ?";
        $params[] = intval($input['category_id']);
        $types .= 'i';
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
