<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=UTF-8');

$executionStartTime = microtime(true);
$isoCode = $_REQUEST['isoCode'] ?? '';

error_log("getFlags.php called with isoCode: " . $isoCode); // ADD THIS

if (!$isoCode) {
	$output = [
		"status" => [
			"code" => 400,
			"name" => "error",
			"description" => "Missing isoCode parameter",
			"returnedIn" => (microtime(true) - $executionStartTime) * 1000 . " ms"
		],
		"data" => null
	];
	echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	exit;
}

$url = 'https://restcountries.com/v3.1/alpha/' . $isoCode;

try {
	$ch = curl_init();

	// REMOVE these two lines for production environments.
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL, $url);

	$result = curl_exec($ch);

	if ($result === false) {
		$error = curl_error($ch);
		$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		throw new Exception('CURL error: ' . $error . ' (HTTP code: ' . $http_code . ')');
	}

	curl_close($ch);

	$decode = json_decode($result, true);

	if ($decode === null && json_last_error() !== JSON_ERROR_NONE) {
		throw new Exception('JSON decode error: ' . json_last_error_msg());
	}

	// Restcountries API returns an array even for a single country
	$countryData = $decode[0] ?? null;


	if ($countryData === null) {
		$output = [
			"status" => [
				"code" => 404,
				"name" => "error",
				"description" => "Country not found with ISO code: " . $isoCode,
				"returnedIn" => (microtime(true) - $executionStartTime) * 1000 . " ms"
			],
			"data" => null
		];
	} else {

		$output = [
			"status" => [
				"code" => 200,
				"name" => "ok",
				"description" => "mission saved",
				"returnedIn" => (microtime(true) - $executionStartTime) * 1000 . " ms"
			],
			"data" => [
				"name" => $countryData['name']['common'],
				"flag" => $countryData['flags']['png'],
				"currencies" => $countryData['currencies'] ?? null, // Handle potential null
				"capital" => $countryData['capital'][0] ?? null  //Take the first capital
			]
		];
	}

	echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
	$output = [
		"status" => [
			"code" => 500,
			"name" => "error",
			"description" => $e->getMessage(),
			"returnedIn" => (microtime(true) - $executionStartTime) * 1000 . " ms"
		],
		"data" => null
	];
	echo json_encode($output, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	exit;
}
