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

//declare global variables
var border = null;
var marker = null;
var marker2 = null;

//featureGroup
var myfeatureGroup = L.featureGroup().addTo(map);

/*
var greenIcon = L.icon({
    iconUrl: 'images/infoIcon.png',
    shadowUrl: 'leaf-shadow.png',

    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);*/

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

        },

        error: function(errorThrown) {
            alert("Error with code and name: " + errorThrown);
        }

    });

});

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
                
                if (map.hasLayer(border)) {
                    map.removeLayer(border);    
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

                            console.log("core info");
                            console.log(response);

                            window.lat = response.data.geometry.lat;
                            window.lat = response.data.geometry.lat;

                            marker = L.marker([response.data.geometry.lat, response.data.geometry.lng]);

                            marker.bindPopup("<h1>" + response.data.components.country + "</h1>" + 
                            "<br>Currency: " + response.data.annotations.currency.name +
                            "<br>Subunit: " + response.data.annotations.currency.subunit +  
                            "<br>Symbol: " + response.data.annotations.currency.symbol +
                            "<br>Country code: " + response.data.annotations.currency.iso_code +
                            "<br>Drive on: " + response.data.annotations.roadinfo.drive_on + 
                            "<br>Speed in: " + response.data.annotations.roadinfo.speed_in +
                            "<br>Timezone Offset: " + response.data.annotations.timezone.offset_string +
                            "<br>Timezone: " + response.data.annotations.timezone.short_name +
                            "<br>Continent: " + response.data.components.continent +
                            "<br>Political union: " + response.data.components.political_union +
                            "<br>Latitude: " + response.data.geometry.lat +
                            "<br>Longitude" + response.data.geometry.lng).openPopup();

                            myfeatureGroup.addLayer(marker);

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

                                    marker2 = L.marker([response.data.geometry.lat, response.data.geometry.lng]);

                                    marker2.bindPopup(
                                    "<br>Capital: "  + response.data.capital +
                                    "<br>Area in Square Kilometres: " + response.data.areaInSqKm + 
                                    "<br>Languages: " + response.data.languages +
                                    "<br>Population" + response.data.population
                                    ).openPopup();

                                    myfeatureGroup.addLayer(marker2);

                                }

                                //get wikipedia links using GeoNames API
                                $.ajax({

                                    url: 'PHP/getWikiLinks.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: { 
                                        north: response.data.north,
                                        south: response.data.south,
                                        east: response.data.east,
                                        west: response.data.west
                                    },

                                    success: function(response) {

                                        if(response.status.name == "ok"){
                                            console.log("wikipedia links");
                                            console.log(response);
                                        }

                                    },

                                    error: function(errorThrown){
                                        alert("error with wiki links: " + errorThrown);
                                    }

                                });

                                //get earthquake activity using GeoNames API
                                $.ajax({

                                    url: 'PHP/getEarthquakeActivity.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: { 
                                        north: response.data.north,
                                        south: response.data.south,
                                        east: response.data.east,
                                        west: response.data.west
                                    },

                                    success: function(response) {

                                        if(response.status.name == "ok"){
                                            console.log("earthquake activity");
                                            console.log(response);
                                        }

                                    },

                                    error: function(errorThrown){
                                        alert("error with earthquake activity: " + errorThrown);
                                    }

                                });

                                //get current exchange rate using the currencyCode returned from the getGeoData.php routine
                                $.ajax({

                                    url: 'PHP/getCurrentExchangeRate.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: { 
                                        currencyCode: response.data.currencyCode
                                    },

                                    success: function(response) {

                                        if(response.status.name == "ok"){
                                            console.log("exchange rate");
                                            console.log(response);
                                        }

                                    },

                                    error: function(errorThrown){
                                        alert("error with exchange rate: " + errorThrown);
                                    }

                                });
                                
                            },

                            error: function(errorThrown){
                                alert("error with geonames data: " + errorThrown);
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

                        //get weather using Open Weather API
                        $.ajax({

                            url: 'PHP/getWeather.php',
                            type: 'GET',
                            dataType: 'json',
                            data: { 
                                lat: response.data.geometry.lat,
                                lng: response.data.geometry.lng
                            },

                            success: function(response) {

                                if(response.status.name == "ok"){
                                    console.log("weather");
                                    console.log(response);
                                }

                            },

                            error: function(errorThrown){
                                alert("error with current weather: " + errorThrown);
                            }

                        });

                        $.ajax({

                            url: 'PHP/getFlags.php',
                            type: 'GET',
                            dataType: 'json',
                            data: { 
                                isoCode: $('#selCountry').val(),
                            },

                            success: function(response) {

                                if(response.status.name == "ok"){
                                    console.log("flags");
                                    console.log(response);
                                }

                            },

                            error: function(errorThrown){
                                alert("error with flags: " + errorThrown);
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