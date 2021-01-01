<?php
//return an array of lat and lngs to be used for markers. also return the full earthquake data itself.

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true) / 1000;

$url = 'http://api.geonames.org/earthquakesJSON?north=' . $_REQUEST['north'] . '&south=' . $_REQUEST['south'] . '&east=' . $_REQUEST['east'] . '&west=' . $_REQUEST['west'] . '&username=travyalonso';

//create emoty array
$latsAndLngs = [];

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	

    //loop through the array of features and add the lat and lng data of each feature into the array
    foreach ($decode['earthquakes'] as $feature) {
        //create empty object to store the lat and lng values
        $temp = null;
        $temp['lat'] = $feature["lat"];
        $temp['lng'] = $feature["lng"];

        //add the object into the array
        array_push($latsAndLngs, $temp);
    }

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";

$output['array'] = $latsAndLngs;
$output['data'] = $decode['earthquakes'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 

?>
