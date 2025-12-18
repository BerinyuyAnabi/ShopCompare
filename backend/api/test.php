<?php
/**
 * Simple test endpoint to verify PHP is working
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/../config/cors.php';

header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'PHP backend is working correctly',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
    ]
]);
