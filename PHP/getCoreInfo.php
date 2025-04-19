<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

if (!isset($_REQUEST['countryCode'])) {
    echo json_encode(["status" => ["code" => 400, "name" => "Bad Request", "description" => "Missing 'countryCode' parameter"]]);
    exit;
}

$countryCode = $_REQUEST['countryCode'];

// OpenCage API Key
$apiKey = 'ff85bdf4a8be4c119522594082225ebb';  // Replace with your OpenCage API Key

$apiUrl = "https://api.opencagedata.com/geocode/v1/json?q={$countryCode}&key={$apiKey}";

// Fetch data from OpenCage API
$countryData = file_get_contents($apiUrl);

if ($countryData === FALSE) {
    echo json_encode(["status" => ["code" => 500, "name" => "Internal Server Error", "description" => "Failed to fetch country data"]]);
    exit;
}

$countryInfo = json_decode($countryData, true);

if (empty($countryInfo) || $countryInfo['status']['code'] !== 200) {
    echo json_encode(["status" => ["code" => 404, "name" => "Not Found", "description" => "Country data not found"]]);
    exit;
}

$countryDetails = $countryInfo['results'][0];

// Extract necessary details from OpenCage API
$countryName = $countryDetails['components']['country'] ?? 'N/A';
$capital = 'N/A'; // Capital info is not provided by OpenCage
$population = 'N/A'; // Population info is not provided by OpenCage
$continent = $countryDetails['components']['continent'] ?? 'N/A';
$timezoneName = $countryDetails['annotations']['timezone']['name'] ?? 'N/A';
$timezoneShortName = $countryDetails['annotations']['timezone']['short_name'] ?? 'N/A';
$currencyName = $countryDetails['annotations']['currency']['name'] ?? 'N/A';
$currencySymbol = $countryDetails['annotations']['currency']['symbol'] ?? 'N/A';
$currencySubunit = $countryDetails['annotations']['currency']['subunit'] ?? 'N/A';
$driveOn = $countryDetails['annotations']['roadinfo']['drive_on'] ?? 'N/A';
$speedIn = $countryDetails['annotations']['roadinfo']['speed_in'] ?? 'N/A';

// Fetch additional details (capital, population) using the RestCountries API
$restCountriesUrl = "https://restcountries.com/v3.1/all";
$restCountriesData = file_get_contents($restCountriesUrl);
$restCountries = json_decode($restCountriesData, true);

foreach ($restCountries as $country) {
    if (strtolower($country['cca2']) === strtolower($countryCode)) {
        $capital = $country['capital'][0] ?? 'N/A';
        $population = $country['population'] ?? 'N/A';
        break;
    }
}

// Build the response
$response = [
    'status' => ['code' => 200, 'name' => 'ok'],
    'data' => [
        'country' => $countryName,
        'capital' => $capital,
        'population' => $population,
        'continent' => $continent,
        'timezoneName' => $timezoneName,
        'timezoneShortName' => $timezoneShortName,
        'currency' => [
            'name' => $currencyName,
            'symbol' => $currencySymbol,
            'subunit' => $currencySubunit
        ],
        'roadInfo' => [
            'driveOn' => $driveOn,
            'speedIn' => $speedIn
        ]
    ]
];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($response);
