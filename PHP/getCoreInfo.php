<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true) / 1000;

	$isoCode = $_REQUEST['isoCode'];
	$countryName = $_REQUEST['name'];
	$newCountryName = str_replace(' ', '%20', $countryName);
	
	$url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $isoCode . '%2C%20' . $newCountryName . '&key=61d11ab3f64b472c96c9a8665cbcfe34&language=en&pretty=1';
	
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);
	
	$countryData = null;
	
    //loop through the array of features and return the one feature that matches the country code (iso_a3).
    foreach ($decode['results'] as $result) {
        
        if($isoCode == $result["components"]['ISO_3166-1_alpha-2']){   
            $countryData = $result;
        }

    }

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

	$output['data'] = $countryData;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
