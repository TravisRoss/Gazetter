<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// Check if the latitude and longitude are provided
if (!isset($_REQUEST['lat']) || !isset($_REQUEST['lng'])) {
    echo json_encode(["status" => ["code" => 400, "name" => "Bad Request", "description" => "Missing latitude or longitude"]]);
    exit;
}

// Get latitude and longitude from the request
$lat = $_REQUEST['lat'];
$lng = $_REQUEST['lng'];

// Your WeatherAPI key
$apiKey = '2e82f88f32f54945bff130304251804';  // Replace with your WeatherAPI key

// Build the API URL for weather forecast (5-day forecast)
$apiUrl = "https://api.weatherapi.com/v1/forecast.json?key={$apiKey}&q={$lat},{$lng}&days=5&aqi=no&alerts=no";

// Use cURL to fetch the weather data
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $apiUrl);
$result = curl_exec($ch);
curl_close($ch);

// Decode the JSON response
$weatherData = json_decode($result, true);

// Check if the data was fetched successfully
if (isset($weatherData['error'])) {
    echo json_encode(["status" => ["code" => 500, "name" => "Internal Server Error", "description" => $weatherData['error']['message']]]);
    exit;
}

// Prepare the response
$response = [
    'status' => ['code' => 200, 'name' => 'ok'],
    'data' => $weatherData['forecast']['forecastday']
];

// Return the weather data as JSON
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($response);
?>
