<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require_once __DIR__ . '/../config/cors.php';

// Start session 
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

    // Get user type (customer or shop_owner)
    $userType = isset($data["user_type"]) ? trim($data["user_type"]) : 'customer';

    // Common fields for all users
    $email = isset($data["email"]) ? trim($data["email"]) : '';
    $password = isset($data["password"]) ? $data["password"] : '';
    $confirmPassword = isset($data["confirm_password"]) ? $data["confirm_password"] : '';

    // Validate common inputs
    if (empty($email) || empty($password) || empty($confirmPassword)) {
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

    // Validate password match
    if ($password !== $confirmPassword) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Passwords do not match'
        ]);
        exit();
    }

    // Validate password strength (minimum 6 characters)
    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Password must be at least 6 characters long'
        ]);
        exit();
    }

    try {
        // Check if email already exists
        $checkStmt = $conn->prepare("SELECT user_id FROM shop_users WHERE email = ?");
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();

        if ($checkResult->num_rows > 0) {
            $checkStmt->close();
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'message' => 'An account with this email already exists'
            ]);
            exit();
        }
        $checkStmt->close();

        // Start transaction
        $conn->begin_transaction();

        // Hash password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        if ($userType == 'customer') {
            // Customer registration
            $firstName = isset($data["first_name"]) ? trim($data["first_name"]) : '';
            $lastName = isset($data["last_name"]) ? trim($data["last_name"]) : '';
            $phone = isset($data["phone"]) ? trim($data["phone"]) : '';

            if (empty($firstName) || empty($lastName)) {
                throw new Exception('First name and last name are required for customer registration');
            }

            // Generate username from email
            $username = explode('@', $email)[0];

            // Insert into shop_users table
            $userStmt = $conn->prepare("INSERT INTO shop_users (username, email, password_hash, user_type, is_active) VALUES (?, ?, ?, 'customer', 1)");
            $userStmt->bind_param("sss", $username, $email, $passwordHash);

            if (!$userStmt->execute()) {
                throw new Exception('Failed to create user account');
            }

            $userId = $conn->insert_id;
            $userStmt->close();

            // Insert into customers table
            $customerStmt = $conn->prepare("INSERT INTO customers (user_id, first_name, last_name, phone) VALUES (?, ?, ?, ?)");
            $customerStmt->bind_param("isss", $userId, $firstName, $lastName, $phone);

            if (!$customerStmt->execute()) {
                throw new Exception('Failed to create customer profile');
            }

            $customerId = $conn->insert_id;
            $customerStmt->close();

            // Commit transaction
            $conn->commit();

            // Set session variables
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;
            $_SESSION['user_type'] = 'customer';
            $_SESSION['customer_id'] = $customerId;
            $_SESSION['logged_in'] = true;

            // Generate authentication token
            $token = bin2hex(random_bytes(32));
            $_SESSION['auth_token'] = $token;

            // Return success response
            echo json_encode([
                'success' => true,
                'message' => 'Customer account created successfully',
                'token' => $token,
                'user' => [
                    'user_id' => $userId,
                    'username' => $username,
                    'email' => $email,
                    'user_type' => 'customer',
                    'customer_id' => $customerId,
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'phone' => $phone
                ]
            ]);

        } elseif ($userType == 'shop_owner') {
            // Shop owner registration
            $shopName = isset($data["shop_name"]) ? trim($data["shop_name"]) : '';
            $ownerFirstName = isset($data["owner_first_name"]) ? trim($data["owner_first_name"]) : '';
            $ownerLastName = isset($data["owner_last_name"]) ? trim($data["owner_last_name"]) : '';
            $phone = isset($data["phone"]) ? trim($data["phone"]) : '';
            $address = isset($data["address"]) ? trim($data["address"]) : '';
            $country = isset($data["country"]) ? trim($data["country"]) : '';

            if (empty($shopName) || empty($ownerFirstName) || empty($ownerLastName)) {
                throw new Exception('Shop name and owner details are required for shop registration');
            }

            // Generate username from shop name
            $username = preg_replace('/[^a-zA-Z0-9]/', '', strtolower($shopName)) . rand(100, 999);

            // Insert into shop_users table (created_at auto-generated by DEFAULT CURRENT_TIMESTAMP)
            $userStmt = $conn->prepare("INSERT INTO shop_users (username, email, password_hash, user_type, is_active) VALUES (?, ?, ?, 'shop_owner', 1)");
            $userStmt->bind_param("sss", $username, $email, $passwordHash);

            if (!$userStmt->execute()) {
                throw new Exception('Failed to create user account');
            }

            $userId = $conn->insert_id;
            $userStmt->close();

            // Insert into shops table
            $shopStmt = $conn->prepare("INSERT INTO shops (user_id, shop_name, owner_first_name, owner_last_name, email, phone, street_address, country, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)");
            $shopStmt->bind_param("isssssss", $userId, $shopName, $ownerFirstName, $ownerLastName, $email, $phone, $address, $country);

            if (!$shopStmt->execute()) {
                throw new Exception('Failed to create shop profile');
            }

            $shopId = $conn->insert_id;
            $shopStmt->close();

            // Commit transaction
            $conn->commit();

            // Set session variables
            $_SESSION['user_id'] = $userId;
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;
            $_SESSION['user_type'] = 'shop_owner';
            $_SESSION['shop_id'] = $shopId;
            $_SESSION['logged_in'] = true;

            // Generate authentication token
            $token = bin2hex(random_bytes(32));
            $_SESSION['auth_token'] = $token;

            // Return success response
            echo json_encode([
                'success' => true,
                'message' => 'Shop account created successfully',
                'token' => $token,
                'user' => [
                    'user_id' => $userId,
                    'username' => $username,
                    'email' => $email,
                    'user_type' => 'shop_owner',
                    'shop_id' => $shopId,
                    'shop_name' => $shopName,
                    'first_name' => $ownerFirstName,
                    'last_name' => $ownerLastName,
                    'phone' => $phone
                ]
            ]);

        } else {
            throw new Exception('Invalid user type');
        }

        $conn->close();
        exit();

    } catch (Exception $e) {
        // Rollback transaction on error
        if ($conn) {
            $conn->rollback();
            $conn->close();
        }

        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Registration error: ' . $e->getMessage()
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
