<?php
/**
 * Database Connection using MySQLi
 * MAMP MySQL Configuration
 */

// Database credentials
$host = "localhost";
$port = "8889"; // Default MAMP MySQL port
$db_name = "shopare";
$username = "root";
$password = "root"; // Default MAMP password

// Create connection
$conn = new mysqli($host, $username, $password, $db_name, $port);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Set charset to utf8mb4
$conn->set_charset("utf8mb4");
