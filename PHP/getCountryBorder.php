<?php

    $executionStartTime = microtime(true);

    //decoding the file using json_decode gives an array of features
    $countryData = json_decode(file_get_contents("../countryBorders.geo.json"), true);

    $countryCode = $_REQUEST['isoCode'];

    $countryBorder = null;

    //loop through the array of features and return the one feature that matches the country code (iso_a3).
    foreach ($countryData['features'] as $feature) {
        
        if($countryCode == $feature["properties"]['iso_a2']){   
            $countryBorder = $feature;
        }

    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $countryBorder;
    
    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>
