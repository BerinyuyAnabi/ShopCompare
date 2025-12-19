<?php
// Simple router for PHP built-in server to test the app locally.
// - Serves existing static files
// - Routes /api/* requests to backend/api/*.php
// - Serves frontend/dist/index.html for SPA routes

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// map root path to frontend/dist
$docRoot = __DIR__;

$staticPath = $docRoot . $uri;
// If the request matches an existing file, let the server serve it.
if ($uri !== '/' && file_exists($staticPath) && is_file($staticPath)) {
    return false; // serve the requested resource as-is
}

// Route API requests: /api/... -> backend/api/...
if (strpos($uri, '/api/') === 0) {
    $apiPath = $docRoot . '/backend' . substr($uri, 4); // remove '/api' prefix -> /backend/api/...
    if (file_exists($apiPath) && is_file($apiPath)) {
        // Execute the API PHP script
        include $apiPath;
        return true;
    }
    // not found -> 404
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'API endpoint not found: ' . $uri]);
    return true;
}

// For anything else, serve the built SPA index (frontend/dist/index.html)
$spaIndex = $docRoot . '/frontend/dist/index.html';
if (file_exists($spaIndex)) {
    // Serve index.html
    header('Content-Type: text/html; charset=UTF-8');
    echo file_get_contents($spaIndex);
    return true;
}

// Fallback: plain 404
http_response_code(404);
echo "Not Found";
