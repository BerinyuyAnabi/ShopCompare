<?php
/**
 * Authentication Middleware
 * Checks if user is logged in and has the required permissions
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return isset($_SESSION['user_id']) && isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
}

/**
 * Require authentication - redirect to login if not authenticated
 */
function requireAuth() {
    if (!isAuthenticated()) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Authentication required',
            'redirect' => '/login'
        ]);
        exit();
    }
}


function requireUserType($requiredType) {
    requireAuth();

    if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== $requiredType) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Access denied. Insufficient permissions.',
            'required_type' => $requiredType,
            'current_type' => $_SESSION['user_type'] ?? 'none'
        ]);
        exit();
    }
}


function requireCustomer() {
    requireUserType('customer');
}


function requireShopOwner() {
    requireUserType('shop_owner');
}


function getCurrentUser() {
    if (!isAuthenticated()) {
        return null;
    }

    return [
        'user_id' => $_SESSION['user_id'] ?? null,
        'username' => $_SESSION['username'] ?? null,
        'email' => $_SESSION['email'] ?? null,
        'user_type' => $_SESSION['user_type'] ?? null,
        'customer_id' => $_SESSION['customer_id'] ?? null,
        'shop_id' => $_SESSION['shop_id'] ?? null
    ];
}


function checkSession() {
    header('Content-Type: application/json');

    if (!isAuthenticated()) {
        echo json_encode([
            'success' => false,
            'authenticated' => false,
            'message' => 'Not authenticated'
        ]);
        exit();
    }

    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'user' => getCurrentUser()
    ]);
    exit();
}
