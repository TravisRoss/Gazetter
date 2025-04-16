<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Validate and sanitize coordinates
$north = isset($_REQUEST['north']) ? (float) $_REQUEST['north'] : 0;
$south = isset($_REQUEST['south']) ? (float) $_REQUEST['south'] : 0;
$east = isset($_REQUEST['east']) ? (float) $_REQUEST['east'] : 0;
$west = isset($_REQUEST['west']) ? (float) $_REQUEST['west'] : 0;

$url = 'http://api.geonames.org/wikipediaBoundingBoxJSON?' . http_build_query([
    'north' => $north,
    'south' => $south,
    'east' => $east,
    'west' => $west,
    'username' => 'travyalonso'
]);

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_URL => $url,
    CURLOPT_FAILONERROR => true
]);

$result = curl_exec($ch);

if (curl_errno($ch)) {
    $output = [
        'status' => [
            'code' => '400',
            'name' => 'Bad Request',
            'description' => curl_error($ch),
            'returnedIn' => (microtime(true) - $executionStartTime) . " ms"
        ]
    ];
} else {
    $decode = json_decode($result, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $output = [
            'status' => [
                'code' => '400',
                'name' => 'Invalid JSON',
                'description' => json_last_error_msg(),
                'returnedIn' => (microtime(true) - $executionStartTime) . " ms"
            ]
        ];
    } elseif (empty($decode['geonames'])) {
        $output = [
            'status' => [
                'code' => '404',
                'name' => 'Not Found',
                'description' => 'No Wikipedia entries found in this area',
                'returnedIn' => (microtime(true) - $executionStartTime) . " ms"
            ]
        ];
    } else {
        // Process valid data
        $output = [
            'status' => [
                'code' => '200',
                'name' => 'ok',
                'description' => 'mission saved',
                'returnedIn' => (microtime(true) - $executionStartTime) . " ms"
            ],
            'data' => array_map(function ($entry) {
                return [
                    'title' => $entry['title'] ?? 'Untitled',
                    'summary' => $entry['summary'] ?? '',
                    'lat' => (float) ($entry['lat'] ?? 0),
                    'lng' => (float) ($entry['lng'] ?? 0),
                    'wikipediaUrl' => $entry['wikipediaUrl'] ?? ''
                ];
            }, $decode['geonames'])
        ];
    }
}

curl_close($ch);

// Set JSON header and output
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);



?>