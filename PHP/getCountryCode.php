<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true) / 1000;

	//specify the URL to which we will make a request.
	$url='http://api.geonames.org/countryCode?lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=travyalonso';

	//initiates the cURL object and sets some parameters
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	//executes the cURL object and stores the results to $result.
	$result=curl_exec($ch);

	curl_close($ch);

	//This particular API returns data as JSON and so we decode it as an associative array so that we can append it to $output. 
	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

	$output['data'] = $result;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
