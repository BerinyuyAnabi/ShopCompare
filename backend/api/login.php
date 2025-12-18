<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// CORS configuration 
require_once __DIR__ . '/../config/cors.php';

session_start();

// error handler to return JSON errors
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $errstr . ' in ' . basename($errfile) . ':' . $errline
    ]);
    exit();
});

// Database connection
require_once __DIR__ . '/../db/connect_db.php';

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // form inputs from JSON
    $email = isset($data["email"]) ? trim($data["email"]) : '';
    $password = isset($data["password"]) ? $data["password"] : '';

    // Validate inputs
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Email and password are required'
        ]);
        exit();
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Please enter a valid email address'
        ]);
        exit();
    }

    try {
        // Query users table
        $stmt = $conn->prepare("SELECT user_id, username, email, password_hash, user_type, is_active FROM users WHERE email = ? AND is_active = 1");

        if (!$stmt) {
            throw new Exception('Database error occurred');
        }

        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        // Check if user exists
        if ($result->num_rows == 1) {
            $user = $result->fetch_assoc();

            // Verify password
            if (password_verify($password, $user['password_hash'])) {

                // Update last login time
                $updateStmt = $conn->prepare("UPDATE users SET last_login = NOW() WHERE user_id = ?");
                $updateStmt->bind_param("i", $user['user_id']);
                $updateStmt->execute();
                $updateStmt->close();

                // Set session variables
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['user_type'] = $user['user_type'];
                $_SESSION['logged_in'] = true;

                // Get additional user details based on user type
                $userDetails = [];

                if ($user['user_type'] == 'customer') {
                    // Get customer details
                    $customerStmt = $conn->prepare("SELECT customer_id, first_name, last_name, phone FROM customers WHERE user_id = ?");
                    $customerStmt->bind_param("i", $user['user_id']);
                    $customerStmt->execute();
                    $customerResult = $customerStmt->get_result();

                    if ($customerResult->num_rows == 1) {
                        $customer = $customerResult->fetch_assoc();
                        $userDetails = [
                            'customer_id' => $customer['customer_id'],
                            'first_name' => $customer['first_name'],
                            'last_name' => $customer['last_name'],
                            'phone' => $customer['phone']
                        ];
                        $_SESSION['customer_id'] = $customer['customer_id'];
                    }
                    $customerStmt->close();

                } elseif ($user['user_type'] == 'shop_owner') {
                    // Get shop details
                    $shopStmt = $conn->prepare("SELECT shop_id, shop_name, owner_first_name, owner_last_name FROM shops WHERE user_id = ?");
                    $shopStmt->bind_param("i", $user['user_id']);
                    $shopStmt->execute();
                    $shopResult = $shopStmt->get_result();

                    if ($shopResult->num_rows == 1) {
                        $shop = $shopResult->fetch_assoc();
                        $userDetails = [
                            'shop_id' => $shop['shop_id'],
                            'shop_name' => $shop['shop_name'],
                            'first_name' => $shop['owner_first_name'],
                            'last_name' => $shop['owner_last_name']
                        ];
                        $_SESSION['shop_id'] = $shop['shop_id'];
                    }
                    $shopStmt->close();
                }

                $stmt->close();
                $conn->close();

                // Generate authentication token 
                $token = bin2hex(random_bytes(32));
                $_SESSION['auth_token'] = $token;

                // Return success response
                echo json_encode([
                    'success' => true,
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => array_merge([
                        'user_id' => $user['user_id'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'user_type' => $user['user_type']
                    ], $userDetails)
                ]);
                exit();

            } else {
                // Invalid password
                $stmt->close();
                $conn->close();

                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid email or password'
                ]);
                exit();
            }

        } else {
            // No user found
            $stmt->close();
            $conn->close();

            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid email or password'
            ]);
            exit();
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'An error occurred. Please try again later.'
        ]);
        exit();
    }

} else {
    // Not a POST request
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}