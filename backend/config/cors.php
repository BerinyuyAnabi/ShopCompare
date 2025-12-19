<?php
/**
 * CORS Configuration
 * Allows React frontend to communicate with PHP backend
 */

// Determine the origin
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8000',
    // 'http://169.239.251.102:3410',
    'http://169.239.251.102',
    // origin/port where the app is hosted
    'http://169.239.251.102:341'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // For university server, allow same-origin requests
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
