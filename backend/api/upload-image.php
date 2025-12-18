<?php

require_once __DIR__ . '/../config/cors.php';

// Database connection
require_once __DIR__ . '/../db/connect_db.php';

// Start session
session_start();

// Set content type to JSON
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    // Check if file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('No image file uploaded or upload error occurred');
    }

    $file = $_FILES['image'];
    $shopId = isset($_POST['shop_id']) ? intval($_POST['shop_id']) : 0;

    if ($shopId <= 0) {
        throw new Exception('Invalid shop ID');
    }

    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $fileType = mime_content_type($file['tmp_name']);

    if (!in_array($fileType, $allowedTypes)) {
        throw new Exception('Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed');
    }

    // Validate file size (max 5MB)
    $maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if ($file['size'] > $maxSize) {
        throw new Exception('File size exceeds maximum limit of 5MB');
    }

    // Read image file into binary data
    $imageData = file_get_contents($file['tmp_name']);

    if ($imageData === false) {
        throw new Exception('Failed to read image file');
    }

    // Store image in database
    $stmt = $conn->prepare("INSERT INTO product_images_store (shop_id, image_data, mime_type, file_size, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("issi", $shopId, $imageData, $fileType, $file['size']);

    if (!$stmt->execute()) {
        throw new Exception('Failed to store image in database: ' . $stmt->error);
    }

    $imageId = $conn->insert_id;
    $stmt->close();
    $conn->close();

    // Return image ID as URL reference
    $imageUrl = '/backend/api/get-image.php?id=' . $imageId;

    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully',
        'image_url' => $imageUrl,
        'image_id' => $imageId
    ]);

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->close();
    }

    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Upload error: ' . $e->getMessage()
    ]);
}
