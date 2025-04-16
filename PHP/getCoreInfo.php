<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

$isoCode = $_REQUEST['isoCode'] ?? null;
$countryName = $_REQUEST['name'] ?? null;

if (!$isoCode || !$countryName) {
	die(json_encode([
		'status' => [
			'code' => 400,
			'name' => 'Bad Request',
			'description' => 'Missing required parameters.',
		]
	]));
}

$newCountryName = str_replace(' ', '%20', $countryName);

$url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $isoCode . '%2C%20' . $newCountryName . '&key=ff85bdf4a8be4c119522594082225ebb&language=en&pretty=1';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

if ($result === false) {
	die(json_encode([
		'status' => [
			'code' => 500,
			'name' => 'Internal Server Error',
			'description' => curl_error($ch),
		]
	]));
}

curl_close($ch);

$decode = json_decode($result, true);

if (json_last_error() !== JSON_ERROR_NONE) {
	die(json_encode([
		'status' => [
			'code' => 500,
			'name' => 'Invalid JSON',
			'description' => json_last_error_msg(),
		]
	]));
}

$countryData = null;

foreach ($decode['results'] as $result) {
	if ($isoCode == ($result['components']['ISO_3166-1_alpha-2'] ?? null)) {
		$countryData = $result;
	}
}

$output = [
	'status' => [
		'code' => 200,
		'name' => 'ok',
		'description' => 'mission saved',
		'returnedIn' => (microtime(true) - $executionStartTime) . " ms",
	],
	'data' => $countryData,
];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);

?>