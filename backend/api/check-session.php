<?php

error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/../config/cors.php';

session_start();

// Set content type to JSON
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode([
        'success' => false,
        'authenticated' => false,
        'message' => 'Not authenticated'
    ]);
    exit();
}

// Return user session data
echo json_encode([
    'success' => true,
    'authenticated' => true,
    'user' => [
        'user_id' => $_SESSION['user_id'],
        'username' => $_SESSION['username'] ?? null,
        'email' => $_SESSION['email'] ?? null,
        'user_type' => $_SESSION['user_type'] ?? null,
        'customer_id' => $_SESSION['customer_id'] ?? null,
        'shop_id' => $_SESSION['shop_id'] ?? null
    ]
]);
