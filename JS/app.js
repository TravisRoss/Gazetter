//load a gif while page loads
$(window).load(function() {
    $('#loading').hide();
});

//global variables
var border = null;
var weatherMarker = null;
var popup = L.popup();

//ClusterGroups
var wikiClusterGroup = L.markerClusterGroup();
var earthquakeClusterGroup = L.markerClusterGroup();
var localWeatherClusterGroup = L.markerClusterGroup();

//featureGroups
var earthquakeFeatureGroup = L.featureGroup();
var wikiLinksFeatureGroup = L.featureGroup();
var localWeatherFeatureGroup = L.featureGroup();
var overallWeatherFeatureGroup = L.featureGroup();

//combines all the markers into one layer so you can add or remove them from the map at once.
var earthquakes = L.layerGroup([earthquakeFeatureGroup]);
var wikiLinks = L.layerGroup([wikiLinksFeatureGroup]);
var localWeather = L.layerGroup([localWeatherFeatureGroup]);
var overallWeather = L.layerGroup([overallWeatherFeatureGroup])

//toner labels
var Stamen_TonerLabels = L.tileLayer.provider('Stamen.TonerLabels', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

//hiking trails
var WaymarkedTrails_hiking = L.tileLayer.provider('WaymarkedTrails.hiking', {
	maxZoom: 18,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//cycling trails
var WaymarkedTrails_cycling = L.tileLayer.provider('WaymarkedTrails.cycling', {
	maxZoom: 18,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

var map = L.map('mapid').locate({
    setView: true,
    maxZoom: 6,
    layers: [defaultMap, earthquakes, wikiLinks, localWeather, overallWeather]
});

//create base layers and add the default one to the map:
var defaultMap = L.tileLayer.provider('OpenStreetMap.DE', {id: 'mapid', maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
var tonerMap = L.tileLayer.provider('Stamen.Toner', {id: 'mapid', maxZoom: 18, attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
var worldStreetMap = L.tileLayer.provider('Esri.WorldStreetMap', {id: 'mapid', maxZoom: 18, attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'});
var USGS_USImageryTopo = L.tileLayer.provider('USGS.USImageryTopo', {id: 'mapid', maxZoom: 18, attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'});

var baseMaps = {
    "Default Map": defaultMap,
    "Toner Map": tonerMap,
    "World Street Map": worldStreetMap,
    "US Imagery": USGS_USImageryTopo
};

var overlayMaps = {
    "Earthquakes": earthquakes,
    "Wikipedia Links": wikiLinks,
    "Local Weather": localWeather,
    "Overall Weather": overallWeather,
    "Toner labels": Stamen_TonerLabels,
    "Cycling": WaymarkedTrails_cycling,
    "Hiking": WaymarkedTrails_hiking
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

//format date and time
function toJSDate (dateTime) {
    var dateTime = dateTime.split(" ");//dateTime[0] = date, dateTime[1] = time
    var date = dateTime[0].split("-");
    var time = dateTime[1].split(":");
    //(year, month, day, hours, minutes, seconds, milliseconds)
    //month is 0 indexed so date[1] - 1 corrected format
    return new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2], 0);
}

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
                                var temp = response.data; 
                                $("#selCountry").val(temp);
                                
                            }
                        },

                        error: function(errorThrown) {
                            console.log("Country code error: " + errorThrown);
                        }

                    });

            });

            } else {
                console.log("Your browser does not support geolocation!");
            }

        },

        error: function(errorThrown) {
            console.log("Error with code and name: " + errorThrown);
        }

    });

});//end on document ready function

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
                overallWeatherFeatureGroup.clearLayers();
                wikiClusterGroup.clearLayers();
                earthquakeClusterGroup.clearLayers();
                localWeatherClusterGroup.clearLayers();
                
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
                        console.log("error with flags: " + errorThrown);
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
                                window.timeOffset = response.data.annotations.timezone.offset_string;
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

                                    function formatNumber(num) {
                                        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                    }
                                      
                                      //console.info(formatNumber(2665)) // 2,665

                                    window.population = formatNumber(response.data.population);
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

                                                //format date and time
                                                function toJSDate (dateTime) {
                                                    var dateTime = dateTime.split(" ");//dateTime[0] = date, dateTime[1] = time
                                                    var date = dateTime[0].split("-");
                                                    var time = dateTime[1].split(":");
                                                    //(year, month, day, hours, minutes, seconds, milliseconds)
                                                    //month is 0 indexed so date[1] - 1 corrected format
                                                    return new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2], 0);
                                                        
                                                }

                                                //put the popup earthquake data in a table
                                                var popup = "<table class='table'>" +
                                                "<tr><td>Magnitude</td><td>" + response.data[i].magnitude + "</td></tr>" +
                                                "<tr><td>Depth</td><td>" + response.data[i].depth + "</td></tr>" +
                                                "<tr><td>Date and time</td><td>" + toJSDate(response.data[i].datetime) + "</td></tr>" + "</table>";
                                                
                                                var earthquakeActivity = L.marker( [response.array[i].lat, response.array[i].lng], {icon: earthquakeIcon, title: "Earthquake Activity"} )
                                                    .bindPopup(popup);
                                                
                                                    earthquakeClusterGroup.addLayer(earthquakeActivity);
                                            }
                                            earthquakeFeatureGroup.addLayer(earthquakeClusterGroup);
                                        }

                                    },

                                    error: function(errorThrown){
                                        console.log("error with earthquake activity: " + errorThrown);
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

                                            if(response){
                                                window.usd = response.data.USD;
                                                window.eur = response.data.EUR;
                                                window.gbp = response.data.GBP;
                                                window.aud = response.data.AUD;
                                                window.jpy = response.data.JPY;
                                            } else {
                                                window.usd = "unavailable";
                                                window.eur = "unavailable";
                                                window.gbp = "unavailable";
                                                window.aud = "unavailable";
                                                window.jpy = "unavailable";
                                            }
                                            
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
                                                "<tr><td>Temperature</td><td>" + response.data[i].temperature + "°C" + "</td></tr>" +
                                                "<tr><td>Date And Time</td><td>" + toJSDate(response.data[i].datetime) + "</td></tr>" +
                                                "<tr><td>Humidity</td><td>" + response.data[i].humidity + "%" + "</td></tr>" +
                                                "<tr><td>Station Name</td><td>" + response.data[i].stationName + "</td></tr>" +
                                                "<tr><td>Clouds</td><td>" + response.data[i].clouds + "</td></tr>" +
                                                "<tr><td>Wind Speed</td><td>" + response.data[i].windSpeed + "mph" + "</td></tr>" + "</table>";
                                                
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
                                    
                                    //format time in seconds to time in HHMMSS
                                    var sunrise = new Date(0);
                                    sunrise.setSeconds(window.sunrise); // specify value for SECONDS here
                                    var formattedSunrise = sunrise.toISOString().substr(11, 8);

                                    var sunset = new Date(0);
                                    sunset.setSeconds(window.sunrise); // specify value for SECONDS here
                                    var formattedSunset = sunset.toISOString().substr(11, 8);
                                    
                                    weatherMarker.bindPopup("<br><table class='table'>" +
                                    "<tr><td>Temperature</td><td>" + window.temp + "K" +"</td></tr>" +
                                    "<tr><td>Description</td><td>" + window.description + "</td></tr>" +
                                    "<tr><td>Humidity</td><td>" + window.humidity + "%" + "</td></tr>" +
                                    "<tr><td>Feels Like</td><td>" + window.feelsLike + "°C" + "</td></tr>" +
                                    "<tr><td>Clouds</td><td>" + window.clouds + "</td></tr>" +
                                    "<tr><td>Pressure</td><td>" + window.pressure + "mb" + "</td></tr>" +
                                    "<tr><td>Sunrise</td><td>" + formattedSunrise + "</td></tr>" +
                                    "<tr><td>Sunset</td><td>" + formattedSunset + "</td></tr>" +
                                    "<tr><td>Visibility</td><td>" + window.visibility/1000 + "km" + "</td></tr>" +
                                    "<tr><td>Dew Point</td><td>" + window.dewPoint + "</td></tr>" + "</table>");

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
                                                    var infected = response.data.infected;
                                                    var deceased = response.data.deceased;
                                                    var recovered = response.data.recovered;
                                                    //var lastUpdatedApify = response.data.lastUpdatedApify;
                                                    var sourceUrl = response.data.sourceUrl;
                                                } catch(err){
                                                    console.log("Covid 19 data is unavailable for this country.");
                                                }

                                                //set the modal title to the name  of the country that is clicked
                                                document.getElementById("coreInfoTitle").innerHTML = window.country;

                                                //set the modal content for the country selected
                                                document.getElementById("coreInfoBody").innerHTML = 
                                                "<table class='table table-striped'><thead><tr> <th scope='col'>#</th><th scope='col'>First</th><th scope='col'>Last</th><th scope='col'>Handle</th></tr></thead><tbody><tr><th scope='row'>1</th><td>Mark</td><td>Otto</td><td>@mdo</td></tr><tr><th scope='row'>2</th><td>Jacob</td><td>Thornton</td><td>@fat</td></tr><tr><th scope='row'>3</th><td>Larry</td><td>the Bird</td><td>@twitter</td></tr></tbody></table>";

                                                /*"<img src='" + window.flagUrl + "' class='img-fluid'/>" +
                                                "<br><table class='table'>" +
                                                "<tr><td>Capital</td><td>" + window.capital + "</td></tr>" +
                                                "<tr><td>Population</td><td>" + window.population + "</td></tr>" +
                                                "<tr><td>Continent</td><td>" + window.continent + "</td></tr>" +
                                                "<tr><td>Timezone</td><td>" + window.timezoneShortName + "</td></tr>" +
                                                "<tr><td>Currency</td><td>" + window.currencyName + " (" + window.currencySymbol + ")" + "</td></tr>" +
                                                "<tr><td>Currency Subunit</td><td>" + window.currencySubunit + "</td></tr>" +
                                                "<tr><td>Current Exhange Rate</td><td>" + "USD: " + window.usd + "<br>EUR: " + window.eur + "<br>GBP: " + window.gbp + "<br>AUD: " + window.aud + "<br>JPY: " + window.jpy +
                                                "</td></tr>" + "</table>" + 
                                                "<table class='table'><th>Covid19</th>" + 
                                                "<tr><td>Infected</td><td>" + infected + "</td></tr>" + 
                                                "<tr><td>Deceased</td><td>" + deceased + "</td></tr>" +
                                                "<tr><td>Recovered</td><td>" + recovered + "</td></tr>" + 
                                                "<tr><td>Source</td><td>" + sourceUrl + "</td></tr>" + "</table>";*/
                                                //show the modal when the country border is clicked
                                                border.on('click', function () {
                                                    $('#coreInfoModal').modal('show');
                                                })

                                            }//end if

                                        },//end success function

                                    error: function(errorThrown){
                                        console.log("error with Covid data: " + errorThrown);
                                    }

                                });//end covid ajax call

                                }

                            },

                            error: function(errorThrown){
                                console.log("error with current weather: " + errorThrown);
                            }

                        });//end getWeather ajax call

                        

                    },

                    error: function(errorThrown){
                        console.log("Core info failed: " + errorThrown);
                    }

                });//end ajax call

            }  

        },

        error: function(errorThrown) {
            console.log("country borders failed: " + errorThrown);
        }

    });

}//end select country function