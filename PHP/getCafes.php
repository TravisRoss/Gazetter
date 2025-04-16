<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
header('Content-Type: application/json; charset=UTF-8');

$executionStartTime = microtime(true);

// Replace with your actual TomTom API key
$apiKey = 'GUNgzfJPa2UkxGojgYA4w9GtwyeWateP';

try {
    // Validate required parameters
    $requiredParams = ['north', 'south', 'east', 'west', 'countrySet'];
    foreach ($requiredParams as $param) {
        if (!isset($_REQUEST[$param])) {
            throw new Exception("Missing required parameter: $param");
        }
    }

    // Build the TomTom API URL
    $url = sprintf(
        'https://api.tomtom.com/search/2/poiSearch/coffee.json?%s',
        http_build_query([
            'limit' => 100,
            'countrySet' => $_REQUEST['countrySet'],
            'topLeft' => "{$_REQUEST['north']},{$_REQUEST['west']}",
            'btmRight' => "{$_REQUEST['south']},{$_REQUEST['east']}",
            'key' => $apiKey
        ])
    );

    // Initialize cURL
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_URL => $url,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_FAILONERROR => true, // Fail on HTTP errors (e.g., 400/500)
    ]);

    // Execute cURL request
    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        throw new Exception("cURL error: " . curl_error($ch));
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($httpCode !== 200) {
        throw new Exception("HTTP error code: $httpCode");
    }

    curl_close($ch);

    // Decode and validate API response
    $result = json_decode($response, true);
    if (!$result || !isset($result['results'])) {
        throw new Exception("Invalid API response: " . print_r($result, true));
    }

    // Process results into a structured format
    $processedResults = array_map(function ($feature) {
        return [
            'lat' => $feature['position']['lat'] ?? null,
            'lng' => $feature['position']['lon'] ?? null,
            'poi' => [
                'name' => $feature['poi']['name'] ?? 'Unnamed Cafe',
                'categories' => $feature['poi']['categories'] ?? []
            ],
            'address' => [
                'freeformAddress' => $feature['address']['freeformAddress'] ?? 'Address unavailable'
            ]
        ];
    }, $result['results']);

    // Build success response
    $output = [
        'status' => [
            'code' => 200,
            'name' => "ok",
            'description' => "success",
            'returnedIn' => round((microtime(true) - $executionStartTime) * 1000, 3) . " ms"
        ],
        'data' => $processedResults
    ];

    echo json_encode($output);

} catch (Exception $e) {
    // Handle errors and build error response
    $output = [
        'status' => [
            'code' => 400,
            'name' => "error",
            'description' => $e->getMessage(),
            'returnedIn' => round((microtime(true) - $executionStartTime) * 1000, 3) . " ms"
        ]
    ];

    http_response_code(400);
    echo json_encode($output);
}
