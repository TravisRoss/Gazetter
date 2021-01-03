//loading gif while page loads
/*$(window).load(function() {
    $('#loading').hide();
});*/

//global variables
var border = null;
var weatherMarker = null;
var popup = L.popup();

//ClusterGroups
var markerClusterGroup = L.markerClusterGroup();
var wikiClusterGroup = L.markerClusterGroup();
var earthquakeClusterGroup = L.markerClusterGroup();
var localWeatherClusterGroup = L.markerClusterGroup();

//featureGroups.
var earthquakeFeatureGroup = L.featureGroup();
var wikiLinksFeatureGroup = L.featureGroup();
var localWeatherFeatureGroup = L.featureGroup();
var overallWeatherFeatureGroup = L.featureGroup();

//combines all the markers into one layer so you can add or remove them from the map at once.
var earthquakes = L.layerGroup([earthquakeFeatureGroup]);
var wikiLinks = L.layerGroup([wikiLinksFeatureGroup]);
var localWeather = L.layerGroup([localWeatherFeatureGroup]);
var overallWeather = L.layerGroup([overallWeatherFeatureGroup])

var map = L.map('mapid').locate({
    setView: true,
    maxZoom: 6,
    layers: [defaultMap, earthquakes, wikiLinks, localWeather, overallWeather]
});

//create base layers and add the default one to the map:
var defaultMap = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {id: 'mapid', maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
var frostMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {id: 'mapid', maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'});
var darkMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {id: 'mapid', maxZoom: 18, attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'});

var baseMaps = {
    "Default": defaultMap,
    "Frost": frostMap,
    "Dark mode": darkMap
};

var overlayMaps = {
    "Earthquakes": earthquakes,
    "Wikipedia Links": wikiLinks,
    "Local Weather": localWeather,
    "Overall Weather": overallWeather
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

//icons
var earthquakeIcon = L.icon({
    iconUrl: 'images/earthquake.png',
    iconRetinaUrl: 'images/earthquake.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var wikiIcon = L.icon({
    iconUrl: 'images/wikiIcon.png',
    iconRetinaUrl: 'images/wikiIcon.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14],
});

var poiIcon = L.icon({
    iconUrl: 'images/pois.png',
    iconRetinaUrl: 'images/pois.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var weatherIcon = L.icon({
    iconUrl: 'images/weather.png',
    iconRetinaUrl: 'images/weather.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var localWeatherIcon = L.icon({
    iconUrl: 'images/localweather.png',
    iconRetinaUrl: 'images/localweather.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

//GBP
L.easyButton( '&pound;', function(){
    map.setView([55, -2], 6);
}).addTo(map);

//Japanese Yen (JPY)
L.easyButton( '&yen;', function(){
    map.setView([38, 139], 5);
}).addTo(map);

//USD
L.easyButton( '&dollar;', function(){
    map.setView([37.8, -96], 5);
}).addTo(map);

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

                    $.ajax({

                        url: 'PHP/getCountryCode.php',
                        type: 'GET',
                        dataType: 'json',
                        data: { 
                            lat: lat,
                            lng: lng
                        },

                        success: function(response) {
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

                window.name = response.data.properties.name;
                
                if (map.hasLayer(border)) {
                    map.removeLayer(border);    
                }

                //clear any previous markers and layers
                markerClusterGroup.clearLayers();
                
                border = L.geoJson(response.data,{
                    color: '#666666',
                    weight: 3,
                    opacity: 1
                }).addTo(map);         
            
                map.fitBounds(border.getBounds()); 

                //if dark map is activated, change the border color to white to make it visible

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
                                console.log(err);
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

                                            //put the data on the map as markers with popups
                                            for (var i = 0; i < response.data.length; ++i) {
                                                var popup = "<table class='table'>" +
                                                "<tr><td>Summary</td><td>" + response.data[i].summary + "</td></tr>" +
                                                "<tr><td>URL</td><td>" + response.data[i].wikipediaUrl + "</td></tr>" +
                                                "<tr><td>Title</td><td>" + response.data[i].title + "</td></tr>" +
                                                "<tr><td>Type</td><td>" + response.data[i].feature + "</td></tr>" + "</table>";

                                                var m = L.marker( [response.array[i].lat, response.array[i].lng], {icon: wikiIcon, title:"Wikipedia Links"} )
                                                    .bindPopup(popup, {maxWidth: "auto"});
                                                
                                                    wikiClusterGroup.addLayer(m);
                                            }
                                            wikiLinksFeatureGroup.addLayer(wikiClusterGroup);
                                        }

                                    },

                                    error: function(errorThrown){
                                        console.log("error with wiki links: " + errorThrown);
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

                                            //put the data on the map as markers with popups
                                            for (var i = 0; i < response.data.length; ++i) {
                                                //put the popup earthquake data in a table
                                                var popup = "<table class='table'>" +
                                                "<tr><td>Magnitude</td><td>" + response.data[i].magnitude + "</td></tr>" +
                                                "<tr><td>Depth</td><td>" + response.data[i].depth + "</td></tr>" +
                                                "<tr><td>Date and time</td><td>" + response.data[i].datetime + "</td></tr>" + "</table>";
                                                
                                                var earthquakeActivity = L.marker( [response.array[i].lat, response.array[i].lng], {icon: earthquakeIcon, title: "Earthquake Activity"} )
                                                    .bindPopup(popup);
                                                
                                                    earthquakeClusterGroup.addLayer(earthquakeActivity);
                                            }
                                            earthquakeFeatureGroup.addLayer(earthquakeClusterGroup);
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

                                });

                                //get local weather from GeoNames API (points of interest)
                                $.ajax({

                                    url: 'PHP/getLocalWeather.php',
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
                                            console.log("local weather");
                                            console.log(response);
                                            
                                            //put the data on the map as markers with popups
                                            for (var i = 0; i < response.data.length; ++i) {
                                                var popup = "<table class='table'>" +
                                                "<tr><td>Temperature</td><td>" + response.data[i].temperature + "</td></tr>" +
                                                "<tr><td>Date And Time</td><td>" + response.data[i].datetime + "</td></tr>" +
                                                "<tr><td>Humidity</td><td>" + response.data[i].humidity + "</td></tr>" +
                                                "<tr><td>Station Name</td><td>" + response.data[i].stationName + "</td></tr>" +
                                                "<tr><td>Clouds</td><td>" + response.data[i].clouds + "</td></tr>" +
                                                "<tr><td>Wind Speed</td><td>" + response.data[i].windSpeed + "</td></tr>" + "</table>";
                                                
                                                var localWeatherMarkers = L.marker( [response.array[i].lat, response.array[i].lng], {icon: localWeatherIcon, title: "Local Weather"} )
                                                    .bindPopup(popup);
                                                
                                                    localWeatherClusterGroup.addLayer(localWeatherMarkers);
                                            }
                                            
                                            localWeatherFeatureGroup.addLayer(localWeatherClusterGroup);
                                        }

                                    },

                                    error: function(errorThrown){
                                        console.log("error with POIs");
                                    }

                                });

                                
                                
                            },

                            error: function(errorThrown){
                                console.log("error: Base " + currencyCode + " is not supported. " + errorThrown);
                            }
                    
                        }); //end geo data ajax call

                        

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

                                    //get covid data from https://apify.com/covid-19
                                    $.ajax({

                                        url: 'PHP/getCovidData.php',
                                        type: 'GET',
                                        dataType: 'json',
                                        data: {
                                            countryName: window.country
                                        },

                                        success: function(response) {

                                            if(response.status.name == "ok"){
                                                console.log("Covid data");
                                                console.log(response);
                                                
                                                try{
                                                    window.infected = response.data.infected;
                                                    window.deceased = response.data.deceased;
                                                    window.recovered = response.data.recovered;
                                                    window.lastUpdatedApify = response.data.lastUpdatedApify;
                                                    window.sourceUrl = response.data.sourceUrl;
                                                } catch(err){
                                                    console.log("error with covid data: posssible null value");
                                                }
                                            }

                                        },

                                        error: function(errorThrown){
                                            console.log("error with Covid data: " + errorThrown);
                                        }

                                    });

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

                                    if (map.hasLayer(weatherMarker)) {
                                        map.removeLayer(weatherMarker);    
                                    }

                                    weatherMarker = L.marker([response.data.lat, response.data.lon], {
                                        elevation: 260.0,
                                        title: "Current weather here",
                                        icon: weatherIcon
                                    });

                                    //add overall weather to the overallWeather feature group
                                    overallWeatherFeatureGroup.addLayer(weatherMarker);
                                
                                    weatherMarker.bindPopup("<br><table class='table'>" +
                                    "<tr><td>Temperature (Kelvin)</td><td>" + window.temp + "</td></tr>" +
                                    "<tr><td>Description</td><td>" + window.description + "</td></tr>" +
                                    "<tr><td>Humidity</td><td>" + window.humidity + "</td></tr>" +
                                    "<tr><td>Feels Like</td><td>" + window.feelsLike + "</td></tr>" +
                                    "<tr><td>Clouds</td><td>" + window.clouds + "</td></tr>" +
                                    "<tr><td>DT</td><td>" + window.dt + "</td></tr>" +
                                    "<tr><td>Pressure</td><td>" + window.pressure + "</td></tr>" +
                                    "<tr><td>Sunrise</td><td>" + window.sunrise + "</td></tr>" +
                                    "<tr><td>Sunset</td><td>" + window.sunset + "</td></tr>" +
                                    "<tr><td>UVI</td><td>" + window.uvi + "</td></tr>" +
                                    "<tr><td>Visibility</td><td>" + window.visibility + "</td></tr>" +
                                    "<tr><td>Dew Point</td><td>" + window.dewPoint + "</td></tr>" + "</table>");

                                    //set the modal title to the name  of the country that is clicked
                                    document.getElementById("coreInfoTitle").innerHTML = window.country;

                                    //set the modal content for the country selected
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
                                    "<tr><td>Speed In</td><td>" + window.speedIn + "</td></tr>" +
                                    "<tr><td>Exhange Rate</td><td>" + window.exchangeRate + "</td></tr>" +
                                    "<tr><td>Covid 19 Infected</td><td>" + window.infected + "</td></tr>" + 
                                    "<tr><td>Covid 19 Deceased</td><td>" + window.deceased + "</td></tr>" +
                                    "<tr><td>Covid 19 Recovered</td><td>" + window.recovered + "</td></tr>" + 
                                    "<tr><td>Covid 19 Source URL</td><td>" + window.sourceUrl + "</td></tr>" + "</table>";

                                    //show the modal when the country border is clicked
                                    border.on('click', function () {
                                        $('#exampleModal').modal('show');
                                    })

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