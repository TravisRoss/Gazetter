/* CREATE AND POPULATE MAP */
$(window).load(function() { // display a loading icon until the page loads
    $(".se-pre-con").fadeOut("slow");;
});

//once user agrees to share locstion, set the view to the user's location
var map = L.map('mapid').locate({
    setView: true,
    maxZoom: 6
});

//tileLayer
var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var popup = L.popup();

//add a click event to display the lat and lng of wherever the user clicks

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);

var border = null;

//Populate the select with country names and country codes.
$(document).ready(function() {
    
    $.ajax({
        url: 'PHP/getCodeAndName.php',
        type: 'GET',
        dataType: 'json',
        data: {},
        
        success: function(response){    //response is the country code and name

            if (response.status.name == "ok"){
                //loop through the response object and populate the select tag
                var options = '';
                for(var i = 0; i < 175; i++){
                    options += '<option value="' + response['data'][i]['code'] + '">' + response['data'][i]['name'] + '</option>';
                }
                $('#selCountry').append(options);
            }

            //Geolocate
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    window.lat = position.coords.latitude;
                    window.lng = position.coords.longitude;
                    
                    console.log("lat: " + window.lat + " and lng: " + window.lng);

                    $.ajax({

                        url: 'PHP/getCountryCode.php',
                        type: 'GET',
                        dataType: 'json',
                        data: { 
                            lat: window.lat,
                            lng: window.lng
                        },

                        success: function(response) { //response is the countryCode here.
                            if(response.status.name == "ok"){
                                console.log("country code");
                                console.log(response);

                                //update the select value

                                //set default border. will only work once we can update the select value

                            }
                        },

                        error: function(errorThrown) {
                            alert("Country code error: " + errorThrown);
                        }

                    });

            });

            } else {
            console.log("Your browser does not support geolocation!");
            }

            //error callback
            function show_error(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    alert("Permission denied by user.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert("Location position unavailable.");
                    break;
                case error.TIMEOUT:
                    alert("Request timeout.");
                    break;
                case error.UNKNOWN_ERROR:
                    alert("Unknown error.");
                    break;
            }
            }

        },

        error: function(errorThrown) {
            alert("Error with code and name: " + errorThrown);
        }

    });

});


//use the name, iso_a2 and iso_a3 values returned from the getCountryBorders.php routine to call the OpenCage API
//set map view to selected country and put a border around it
function selectCountry(){

    $.ajax({

        url: 'PHP/getCountryBorders.php',
        type: 'GET',
        dataType: 'json',
        data: {
            isoCode: $('#selCountry').val() 
        },
        
        success: function(response) {
            
            if (response.status.name == "ok") {     
                console.log("country borders");
                console.log(response);
                
                //set the selected border on the map
                if (map.hasLayer(border)) {
                    map.removeLayer(border);    //remove any previous borders and set the new border
                }
            
                border = L.geoJson(response.data,{
                    color: '#666666',
                    weight: 2,
                    opacity: 0.65
                }).addTo(map);         
            
                map.fitBounds(border.getBounds());

                //ajax call to get the core info
                $.ajax({

                    url: 'PHP/getCoreInfo.php',
                    type: 'GET',
                    dataType: 'json',
                    data: { 
                        isoCode: $('#selCountry').val(),
                    },

                    success: function(response) { 
                            
                        if(response.status.name == "ok"){
                            //log the country info matching the country code (isoCode) passed in
                            console.log("core info");
                            console.log(response);
                        }

                        //get GeoNames Data
                        $.ajax({

                            url: 'PHP/getGeoData.php',
                            type: 'GET',
                            dataType: 'json',
                            data: { 
                                isoCode: $('#selCountry').val(),
                            },

                            success: function(response) {
                                if(response.status.name == "ok"){
                                    console.log("Geo data");
                                    console.log(response);
                                }

                            },

                            error: function(errorThrown){
                                alert("error with geonames data: " + errorThrown);
                            }
                    
                        });

                        //get GeoNames Weather data
                        $.ajax({

                            url: 'PHP/getWeatherInfo.php',
                            type: 'GET',
                            dataType: 'json',
                            data: { 
                                lat: response.data.geometry.lat,
                                lng: response.data.geometry.lng
                            },

                            success: function(response) {

                                if(response.status.name == "ok"){
                                    console.log("Geo weather data");
                                    console.log(response);
                                }

                            },

                            error: function(errorThrown){
                                alert("error with weather data: " + errorThrown);
                            }

                        });

                        //get GeoNames nearby POIs (points of interest)
                        $.ajax({

                            url: 'PHP/getNearbyPOIs.php',
                            type: 'GET',
                            dataType: 'json',
                            data: { 
                                lat: response.data.geometry.lat,
                                lng: response.data.geometry.lng
                            },

                            success: function(response) {

                                if(response.status.name == "ok"){
                                    console.log("Geo Nearby POIs");
                                    console.log(response);
                                }

                            },

                            error: function(errorThrown){
                                alert("error with nearby POIs: " + errorThrown);
                            }

                        });

                        
                        
                    },

                    error: function(errorThrown){
                        alert("Core info failed: " + errorThrown);
                    }

                });//end ajax call

            }  

        },

        error: function(errorThrown) {
            alert("country borders failed: " + errorThrown);
        }

    });

}