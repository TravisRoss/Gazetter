<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true) / 1000;

$north = round($_REQUEST['north']);
$south = round($_REQUEST['south']);
$east = round($_REQUEST['east']);
$west = round($_REQUEST['west']);

$url = 'http://api.geonames.org/wikipediaBoundingBoxJSON?north=' . $north . '&south=' . $south . '&east=' . $east . '&west=' . $west . '&username=travyalonso';

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
foreach ($decode['geonames'] as $feature) {
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
$output['data'] = $decode['geonames'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 

?>
