<?php

require_once __DIR__ . '/../config/cors.php';

// Database connection
require_once __DIR__ . '/../db/connect_db.php';

// Get image ID from query parameter
$imageId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($imageId <= 0) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Invalid image ID'
    ]);
    exit();
}

try {
    // Fetch image from database
    $stmt = $conn->prepare("SELECT image_data, mime_type FROM product_images_store WHERE image_id = ?");
    $stmt->bind_param("i", $imageId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Image not found'
        ]);
        $stmt->close();
        $conn->close();
        exit();
    }

    $row = $result->fetch_assoc();
    $imageData = $row['image_data'];
    $mimeType = $row['mime_type'];

    $stmt->close();
    $conn->close();

    // Set appropriate headers
    header('Content-Type: ' . $mimeType);
    header('Content-Length: ' . strlen($imageData));
    header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
    header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');

    // Output image data
    echo $imageData;

} catch (Exception $e) {
    if (isset($conn)) {
        $conn->close();
    }

    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Error retrieving image: ' . $e->getMessage()
    ]);
}
