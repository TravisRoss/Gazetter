<?php
	//need to return the lat and lng of each feature to be put on the map at that location (lat and lon)
	//also need to return the current weather. (current)

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

    $executionStartTime = microtime(true) / 1000;

	$url='http://newsapi.org/v2/top-headlines?country=' . $_REQUEST['countryCode'] . '&apiKey=8f9188d70cb24d2baf2dcc1d9dff9f85';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

	$output['data'] = $decode['articles'];

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>
