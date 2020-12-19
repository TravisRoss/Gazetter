<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true) / 1000;

	$url='http://api.geonames.org/countryInfoJSON?&username=travyalonso&style=full';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);
	
	$result=curl_exec($ch);

	curl_close($ch);

    $decode = json_decode($result,true);

    $isoCode = $_REQUEST['isoCode'];
    
    $countryData = null;
	
    //loop through the array of features and return the one feature that matches the country code (iso_a3).
    foreach ($decode['geonames'] as $feature) {
        
        if($isoCode == $feature["countryCode"]){   
            $countryData = $feature;
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

