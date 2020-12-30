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
var countryDataMarker = null;
var wikipediaLinks = null;




//featureGroup
var myfeatureGroup = L.featureGroup().addTo(map);
var weatherFeatureGroup = L.featureGroup().addTo(map);

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
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                    
                    console.log("lat: " + lat + " and lng: " + lng);

                    $.ajax({

                        url: 'PHP/getCountryCode.php',
                        type: 'GET',
                        dataType: 'json',
                        data: { 
                            lat: lat,
                            lng: lng
                        },

                        success: function(response) { //response is the countryCode here.
                            if(response.status.name == "ok"){
                                console.log("country code");
                                console.log(response);

                                //set default select value
                                /*var defaultCountry = response['data'];
                                $('#selCountry').val(defaultCountry);*/
                                document.getElementById('selCountry').value = response.data;


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

                //country name1
                window.name = response.data.properties.name;
                
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
                        name: window.name 
                    },

                    success: function(response) { 

                        if(response.status.name == "ok"){

                            console.log("core info");
                            console.log(response);

                            //declare the bounds for flag placement
                            window.northeast = [response.data.bounds.northeast];
                            window.southwest = [response.data.bounds.southwest];

                            //the lat and long coordinates of the selected country
                            window.lat = response.data.geometry.lat;
                            window.lng = response.data.geometry.lng;

                            marker = L.marker([window.lat, window.lng]);

                            //store core info as global variables to be used later in the marker on the map
                            window.country = response.data.components.country;
                            window.currencyName =  response.data.annotations.currency.name;
                            window.currencySubunit = response.data.annotations.currency.subunit;
                            window.currencySymbol = response.data.annotations.currency.symbol;
                            window.isoCode = response.data.annotations.currency.iso_code;
                            window.driveOn = response.data.annotations.roadinfo.drive_on; 
                            window.speedIn = response.data.annotations.roadinfo.speed_in;
                            window.timeOffset = response.data.annotations.timezone.offset_string ;
                            window.timezoneShortName = response.data.annotations.timezone.short_name;
                            window.continent = response.data.components.continent;
                            window.politicalUnion = response.data.components.political_union;
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

                                    //store the capital and population as global variables to be used later
                                    window.capital = response.data.capital;
                                    window.population = response.data.population;
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

                                            wikipediaLinks = L.geoJson(response.data,{
                                                color: '#666666',
                                                weight: 2,
                                                opacity: 0.65
                                            }).addTo(map);         
                                        
                                            

                                            window.wikiLinks = response.data;
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

                                            window.earthquakeData = response.data;
                                        }

                                    },

                                    error: function(errorThrown){
                                        alert("error with earthquake activity: " + errorThrown);
                                    }

                                });

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

                                            window.exchangeRate = "USD: " + response.data.USD + " Euro: " + response.data.EUR + " GBP: " + response.data.GBP + " AUD: " + response.data.AUD + 
                                            " Yen: " + response.data.JPY;
                                        }

                                    },

                                    error: function(errorThrown){
                                        console.log("error with exchange rate: " + errorThrown);
                                    }

                                });
                                
                            },

                            error: function(errorThrown){
                                console.log("error: Base " + currencyCode + " is not supported. " + errorThrown);
                            }
                    
                        }); 

                        //get GeoNames nearby POIs (points of interest)
                        $.ajax({

                            url: 'PHP/getNearbyPOIs.php',
                            type: 'GET',
                            dataType: 'json',
                            data: { 
                                lat: window.lat,
                                lng: window.lng
                            },

                            success: function(response) {

                                if(response.status.name == "ok"){
                                    console.log("Geo Nearby POIs");
                                    console.log(response);

                                    window.nearbyPoi = response.data;
                                }

                            },

                            error: function(errorThrown){
                                console.log("error with nearby POIs: " + errorThrown);
                            }

                        });

                        //get weather using Open Weather API
                        $.ajax({

                            url: 'PHP/getWeather.php',
                            type: 'GET',
                            dataType: 'json',
                            data: { 
                                lat: window.lat,
                                lng: window.lng
                            },

                            success: function(response) {

                                if(response.status.name == "ok"){
                                    console.log("weather");
                                    console.log(response);

                                    window.weather = response.data.current;

                                    //declare weather variables to put on the marker with the rest of the core info about each country
                                    window.clouds = response.data.current.clouds;
                                    window.dewPoint = response.data.current.dew_point;
                                    window.dt = response.data.current.dt;
                                    window.feelsLike = response.data.current.feels_like;
                                    window.humidity = response.data.current.humidity;
                                    window.pressure = response.data.current.pressure;
                                    window.sunrise = response.data.current.sunrise;
                                    window.sunset = response.data.current.sunset;
                                    window.temp = response.data.current.temp;
                                    window.uvi = response.data.current.uvi;
                                    window.visibility = response.data.current.visibility;
                                    window.description = response.data.current.weather[0].description;
                                    window.dewPoint = response.data.current.weather[0].main;

                                    function onEachFeature(feature, layer) {
                                        // does this feature have a property named popupContent?
                                        if (feature.properties && feature.properties.popupContent) {
                                            layer.bindPopup(feature.properties.popupContent);
                                        }
                                    }

                                    /*
                                    var geojsonFeature = {
                                        
                                        "type": "FeatureCollection",
                                        "features": [
                                            {
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [ -12.35, 17.35 ]
                                            },
                                            "properties": {
                                                "wikipediaUrl": response.data[0].wikipediaUrl.toString(),
                                                "name": response.data[0].title.toString()
                                            }
                                            },
                                            {
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [ -92.7298, 30.7373 ]
                                            },
                                            "properties": {
                                                "name": "Martha",
                                                "gender": "Female"
                                            }
                                            },
                                            {
                                            "type": "Feature",
                                            "geometry": {
                                                "type": "Point",
                                                "coordinates": [ -91.1473, 30.4711 ]
                                            },
                                            "properties": {
                                                "name": "Zelda",
                                                "gender": "Female"
                                            }
                                            }
                                        ]
                                        
                                    };

                                    L.geoJSON(geojsonFeature, {
                                        onEachFeature: onEachFeature
                                    }).addTo(map);
                                    */
                                }

                            },

                            error: function(errorThrown){
                                alert("error with current weather: " + errorThrown);
                            }

                        });


                        //get flag info including the flag URL for each country
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

                                    window.flagUrl = response.data.flag;
                                    window.currencyName =  response.data.currencies[0].name;
                                    
                                    /*
                                    //get the flag
                                    var imageUrl = response.data.flag;
                                    
                                    //style the flag
                                    var flagIcon = L.icon({
                                        iconUrl: imageUrl,
                                        iconSize: [60, 60],
                                    });

                                    //create the flag marker
                                    marker2 = L.marker([window.lat, window.lng]).addTo(map);
                                    //, {icon: flagIcon} 

                                    marker2.bindPopup( "<img src='" + imageUrl + "' class='flag'/>").addTo(map);*/

                                    if (map.hasLayer(countryDataMarker)) {
                                        map.removeLayer(countryDataMarker);    
                                    }

                                    countryDataMarker = L.marker([window.lat, window.lng]);

                                    countryDataMarker.bindPopup("<h1>" + "<img src='" + window.flagUrl + "' class='flag'/>" + window.country + "</h1>" +
                                    "<br>Currency: " + window.currencyName +
                                    "<br>Subunit: " + window.currencySubunit +  
                                    "<br>Symbol: " + window.currencySymbol +
                                    "<br>ISO code: " + window.isoCode +
                                    "<br>Drive on: " + window.driveOn + 
                                    "<br>Speed in: " + window.speedIn +
                                    "<br>Timezone Offset: " + window.timeOffset +
                                    "<br>Timezone: " + window.timezoneShortName +
                                    "<br>Continent: " + window.continent +
                                    "<br>Political union: " + window.politicalUnion +
                                    "<br>Latitude: " + window.lat +
                                    "<br>Longitude" + window.lng +
                                    "<br>Capital: " + window.capital +
                                    "<br>Population: " + window.population +
                                    "<br>Current Exchange Rate: " + window.exchangeRate +
                                    "<br><br><table class='table'><th>Current Weather</th><tr><td>Clouds</td><td>" + window.clouds + "</td></tr>" +
                                    "<tr><td>Dew Point</td><td>" + window.dewPoint + "</td></tr>" +
                                    "<tr><td>DT</td><td>" + window.dt + "</td></tr>" +
                                    "<tr><td>Feels Like</td><td>" + window.feelsLike + "</td></tr>" +
                                    "<tr><td>Humidity</td><td>" + window.humidity + "</td></tr>" +
                                    "<tr><td>Pressure</td><td>" + window.pressure + "</td></tr>" +
                                    "<tr><td>Sunrise</td><td>" + window.sunrise + "</td></tr>" +
                                    "<tr><td>Sunset</td><td>" + window.sunset + "</td></tr>" +
                                    "<tr><td>Temperature</td><td>" + window.temp + "</td></tr>" +
                                    "<tr><td>UVI</td><td>" + window.uvi + "</td></tr>" +
                                    "<tr><td>Visibility</td><td>" + window.visibility + "</td></tr>" +
                                    "<tr><td>Description</td><td>" + window.description + "</td></tr>" +
                                    "<tr><td>Main</td><td>" + window.main + "</td></tr>" + "</table>"
                                    ).openPopup();

                                    myfeatureGroup.addLayer(countryDataMarker);
                                    
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

