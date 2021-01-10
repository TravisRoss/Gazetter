<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

    $executionStartTime = microtime(true) / 1000;

    $api = 'GUNgzfJPa2UkxGojgYA4w9GtwyeWateP';

    //create empty array
    $latsAndLngs = [];
    $north = $_REQUEST['north'];
    $south = $_REQUEST['south'];
    $east = $_REQUEST['east'];
    $west = $_REQUEST['west'];

    $url='https://api.tomtom.com/search/2/poiSearch/coffee.json?limit=100&countrySet=' . $_REQUEST['countrySet'] .
    '&radius=100000&topLeft=' . $north . '%2C%20' . $west . '&btmRight=' . $south . '%2C%20' . $east . '&key=GUNgzfJPa2UkxGojgYA4w9GtwyeWateP';

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

    $decode = json_decode($result,true);

    //loop through the array of features and add the lat and lng data of each feature into the array
    foreach ($decode['results'] as $feature) {
        //create empty object to store the lat and lng values
        $temp = null;
        $temp['lat'] = $feature['position']['lat'];
        $temp['lng'] = $feature['position']['lon'];

        //add the object into the array
        array_push($latsAndLngs, $temp);
    }

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "mission saved";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

    $output['data'] = $decode['results'];
    $output['array'] = $latsAndLngs;

	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output);

?>
