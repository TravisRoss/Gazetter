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

//earthquake icon
var myIcon = L.icon({
    iconUrl: 'images/earthquake.jpg',
    iconRetinaUrl: 'images/earthquake.jpg',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var markerClusters = L.markerClusterGroup();

//declare global variables
var border = null;

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

                                document.getElementById('selCountry').value = response.data;
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

//run each time a country is selected from the dropdown
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

                //ajax call to return the country flag url and currency name
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

                            try {
                                window.flagUrl = response.data.flag;
                                window.currencyName =  response.data.currencies[0].name;
                            } catch (err){
                                console.log("error with flag url or currency name: " + err);
                            }
                            

                            /*
                            countryDataMarker.bindPopup("<h1>" + "<img src='" + window.flagUrl + "' class='flag'/>" + window.country + "</h1>" +
                            "<br>Currency: " + window.currencyName +
                            "<br>Subunit: " + window.currencySubunit +  
                            "<br>Symbol: " + window.currencySymbol +
                            "<br>ISO code: " + window.isoCode +
                            "<br>Drive on: " + window.driveOn + 
                            "<br>Speed in: " + window.speedIn +
                            "<br>Timezone: " + window.timezoneShortName +
                            "<br>Continent: " + window.continent +
                            "<br>Political union: " + window.politicalUnion +
                            "<br>Latitude: " + window.lat +
                            "<br>Longitude" + window.lng +
                            "<br>Capital: " + window.capital +
                            "<br>Population: " + window.population +
                            "<br>Current Exchange Rate: " + window.exchangeRate +
                            "<br><br><table class='table'><th colspan='2'>Current Weather</th><tr><td>Clouds</td><td>" + window.clouds + "</td></tr>" +
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
                            ).openPopup();*/

                            
                        }

                    },

                    error: function(errorThrown){
                        alert("error with flags: " + errorThrown);
                    }

                });
                
                
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

                            //store core info as global variables
                            try{
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
                            } catch (err){
                                console.log(err.message());
                            }

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

                                    window.capital = response.data.capital;
                                    window.population = response.data.population;

                                    //set the modal title to the name  of the country that is clicked
                                    document.getElementById("coreInfoTitle").innerHTML = window.country;

                                    //set the modal content to the core info for the country selected
                                    document.getElementById("coreInfoBody").innerHTML = 
                                    "<img src='" + window.flagUrl + "' class='img-fluid'/>" +
                                    "<br><table class='table'>" +
                                    "<tr><td>Capital</td><td>" + window.capital + "</td></tr>" +
                                    "<tr><td>Population</td><td>" + window.population + "</td></tr>" +
                                    "<tr><td>Continent</td><td>" + window.continent + "</td></tr>" +
                                    "<tr><td>Timezone</td><td>" + window.timezoneShortName + "</td></tr>" +
                                    "<tr><td>Political Union</td><td>" + window.politicalUnion + "</td></tr>" +
                                    "<tr><td>ISO Code</td><td>" + window.isoCode + "</td></tr>" +
                                    "<tr><td>Currency Name</td><td>" + window.currencyName + "</td></tr>" +
                                    "<tr><td>Currency Symbol</td><td>" + window.currencySymbol + "</td></tr>" +
                                    "<tr><td>Currency Subunit</td><td>" + window.currencySubunit + "</td></tr>" +
                                    "<tr><td>Drive On</td><td>" + window.driveOn + "</td></tr>" +
                                    "<tr><td>Speed In</td><td>" + window.speedIn + "</td></tr>" + "</table>";

                                    //show the modal when the country border is clicked
                                    border.on('click', function () {
                                        $('#exampleModal').modal('show');
                                    })
                                        
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
                                        west: response.data.west,
                                        isoCode: window.isoCode
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
                                            //window.earthquakeData = response.data;

                                            //put the data on the map as markers with popups
                                            for (var i = 0; i < response.data.length; ++i)
                                                {
                                                //put the popup earthquake data in a table
                                                var popup = "<table class='table'>" +
                                                "<tr><td>Magnitude</td><td>" + response.data[i].magnitude + "</td></tr>" +
                                                "<tr><td>Depth</td><td>" + response.data[i].depth + "</td></tr>" +
                                                "<tr><td>Date and time</td><td>" + response.data[i].datetime + "</td></tr>" + "</table>";
                                                
                                                var m = L.marker( [response.array[i].lat, response.array[i].lng], {icon: myIcon} )
                                                    .bindPopup( popup );
                                                
                                                markerClusters.addLayer( m );
                                                }
                                                
                                            map.addLayer( markerClusters );
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

                        //get nearby POIs from GeoNames API (points of interest)
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
                                }

                            },

                            error: function(errorThrown){
                                alert("error with current weather: " + errorThrown);
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

