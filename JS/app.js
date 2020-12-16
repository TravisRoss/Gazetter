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
map.once('click', onMapClick);


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

                        success: function(response) { //response is the countryCode here
                            if(response.status.name == "ok"){
                                console.log(response);
                                console.log("Country Code load successful");
                                
                                //update the value of the select to the users location using the country code value ie if it's GB set it to United Kingdom
                                
                                
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

//set map view to selected country and put a border around it
function selectCountry(){

    $.ajax({

        url: 'PHP/getCoordinates.php',
        type: 'GET',
        dataType: 'json',
        data: {
            isoCode: $('#selCountry').val()
        },
        
        success: function(response) {
            
            if (response.status.name == "ok") {     //response is the coordinates here.
                //should log the coordinates of the selected tag
                console.log(response);
                console.log("country borders loaded successfully");

                //set the selected border on the map
                L.geoJson(response['data']).setStyle().addTo(map);
                
                
                //ajax call to a php routine that gets all of the APIs, one after another
                $.ajax({

                    url: 'PHP/getCoreInfo.php',
                    type: 'GET',
                    dataType: 'json',
                    data: { 
                        lat: window.lat,
                        lng: window.lng
                    },

                    success: function(response) {   //response is the core info here
                            
                        if(response.status.name == "ok"){
                                
                            console.log(response);
                            console.log("Core Information load successful");
                            
                            //set the map view to the selected country
                            
                            //setView(<LatLng> center, <Number> zoom, <Zoom/pan options> options?)
                            
                        }
                        
                    },

                    error: function(errorThrown){
                        alert("Core info loading failed: " + errorThrown);
                    }

                });//end ajax call

            }  

        },

        error: function(errorThrown) {
            alert("Error: " + errorThrown);
        }

    });

}