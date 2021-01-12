//load a gif while page loads
$(window).load(function() {
    $('#loading').hide();
});

//global variables
var border = null;
var weatherMarker = null;
var popup = L.popup();

//declare modals and their data
var coreInfo = null;    //modal
var covid = null;       //modal
var weather = null;     //modal
var weatherData = null;   //data
var news = null;        //modal
var newsData = null;    //data
var travelInfo = null;  //modal
var travelInfoData = null;  //data

//ClusterGroups
var wikiClusterGroup = L.markerClusterGroup();
var earthquakeClusterGroup = L.markerClusterGroup();
var localWeatherClusterGroup = L.markerClusterGroup();
var nearbyPoisClusterGroup = L.markerClusterGroup();
var evStationsClusterGroup = L.markerClusterGroup();
var nearbyPizzaClusterGroup = L.markerClusterGroup();
var shopsClusterGroup = L.markerClusterGroup();

//featureGroups
var earthquakeFeatureGroup = L.featureGroup();
var wikiLinksFeatureGroup = L.featureGroup();
var localWeatherFeatureGroup = L.featureGroup();
var nearbyPoisFeatureGroup = L.featureGroup();
var evStationsFeatureGroup = L.featureGroup();
var nearbyPizzaFeatureGroup = L.featureGroup();
var shopsFeatureGroup = L.featureGroup();

//combines all the feature groups into one layer so you can add or remove them from the map at once.
var earthquakes = L.layerGroup([earthquakeFeatureGroup]);
var wikiLinks = L.layerGroup([wikiLinksFeatureGroup]);
var localWeather = L.layerGroup([localWeatherFeatureGroup]);
var nearbyPois = L.layerGroup([nearbyPoisFeatureGroup]);
var evChargingStations = L.layerGroup([evStationsFeatureGroup]);
var nearbyPizza = L.layerGroup([nearbyPizzaFeatureGroup]);
var nearbyShops = L.layerGroup([shopsFeatureGroup]);

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

//initialise the map and get user location
var map = L.map('mapid').locate({
    setView: true,
    maxZoom: 6,
    layers: [defaultMap, earthquakes, wikiLinks, localWeather, nearbyPois]
});

//create base layers and add the default one to the map:
var worldStreetMap = L.tileLayer.provider('OpenStreetMap.DE', {id: 'mapid', maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
var tonerMap = L.tileLayer.provider('Stamen.Toner', {id: 'mapid', maxZoom: 18, attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
var defaultMap = L.tileLayer.provider('Esri.WorldStreetMap', {id: 'mapid', maxZoom: 18, attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'}).addTo(map);
var USGS_USImageryTopo = L.tileLayer.provider('USGS.USImageryTopo', {id: 'mapid', maxZoom: 18, attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'});

//add the base maps
var baseMaps = {
    "Default Map": defaultMap,
    "Toner Map": tonerMap,
    "World Street Map": worldStreetMap,
    "US Imagery": USGS_USImageryTopo
};

//add the layer groups
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Wikipedia Links": wikiLinks,
    "Local Weather": localWeather,
    "Cafes": nearbyPois,
    "Pizza": nearbyPizza,
    "Shops": nearbyShops,
    "EV Charging Stations": evChargingStations,
    "Toner Labels": Stamen_TonerLabels,
    "Cycling Trails": WaymarkedTrails_cycling,
    "Hiking Trails": WaymarkedTrails_hiking
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
    iconUrl: 'images/poi.png',
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

var evStationsIcon = L.icon({
    iconUrl: 'images/evStations.png',
    iconRetinaUrl: 'images/evStations.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var pizzaIcon = L.icon({
    iconUrl: 'images/pizzaIcon.png',
    iconRetinaUrl: 'images/pizzaIcon.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var shopIcon = L.icon({
    iconUrl: 'images/shopIcon.png',
    iconRetinaUrl: 'images/shopIcon.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var updateIcon = L.icon({
    iconUrl: 'images/update.png',
    iconRetinaUrl: 'images/update.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var scoreIcon = L.icon({
    iconUrl: 'images/score.png',
    iconRetinaUrl: 'images/score.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var sourceIcon = L.icon({
    iconUrl: 'images/source.png',
    iconRetinaUrl: 'images/source.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

//format date and time
function toJSDate (dateTime) {
    var dateTime = dateTime.split(" ");//dateTime[0] = date, dateTime[1] = time
    var date = dateTime[0].split("-");
    var time = dateTime[1].split(":");
    //(year, month, day, hours, minutes, seconds, milliseconds)
    //month is 0 indexed so date[1] - 1 corrected format
    return new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2], 0);
}

//format datetime
function formatDatetime(date){
    var thedate = new Date(Date.parse(date));
    return thedate;
}

//format big numbers, seperating thousands with commas
function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

//convert time in seconds to HHMMSS
function secondsToHHMMSS(seconds) {
    return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}

//rounds the number passed in to 2 decimal places
function roundNum2(num){
    return (Math.round(num * 100) / 100).toFixed(2);
}

//rounds the number passed in to 1 decimal places
function roundNum1(num){
    return (Math.round(num * 100) / 100).toFixed(1);
}

//convert K to C and give 1 dp
function convertKelvinToCelsius(num){
    return roundNum1(num - 273.15);
}

//add a certain number of days to todays data. to be used for the weather forecast
function addDaysToCurrentDate (num){
    var someDate = new Date();
    var numberOfDaysToAdd = num;
    someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

    //format to dd//mm/yy
    var dd = someDate.getDate();
    var mm = someDate.getMonth() + 1;
    var y = someDate.getFullYear();

    var someFormattedDate = dd + '/'+ mm + '/'+ y;
    return someFormattedDate;
}

//Populate the select with country names and country codes.
$(document).ready(function() {

    $.ajax({
        url: 'PHP/getCodeAndName.php',
        type: 'GET',
        dataType: 'json',
        data: {},

        success: function(response){

            if (response.status.name == "ok"){

                //check if the country code contains a number
                function hasNumber(myString) {
                    return /\d/.test(myString);
                }

                var options = '';
                //loop through the response object and populate the select tag
                for(var i = 0; i < 175; i++){
                    if(hasNumber(response['data'][i]['code'])){
                        options += '<option value="' + "SO" + '">' + response['data'][i]['name'] + '</option>';
                    } else {
                        options += '<option value="' + response['data'][i]['code'] + '">' + response['data'][i]['name'] + '</option>';
                    }
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
                                console.log(response)
                                console.log(response['data']);
                                //$('#selCountry').val(response.data).change();
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

        url: 'PHP/getCountryBorder.php',
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

                document.getElementById("noNewsDiv").style.visibility = "hidden";

                //clear any previous markers and layers
                wikiClusterGroup.clearLayers();
                earthquakeClusterGroup.clearLayers();
                localWeatherClusterGroup.clearLayers();
                evStationsClusterGroup.clearLayers();
                shopsClusterGroup.clearLayers();
                nearbyPizzaClusterGroup.clearLayers();
                nearbyPoisClusterGroup.clearLayers();

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
                                window.driveOn = response.data.annotations.roadinfo.drive_on;
                                window.speedIn = response.data.annotations.roadinfo.speed_in;
                                window.timezoneName = response.data.annotations.timezone.name;
                            } catch (err){
                                console.log(err);
                            }

                        }

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
                                    window.population = formatNumber(response.data.population);
                                    window.north = response.data.north;
                                    window.south = response.data.south;
                                    window.east = response.data.east;
                                    window.west = response.data.west;
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
                                    },

                                    success: function(response) {

                                        if(response.status.name == "ok"){
                                            console.log("wikipedia links");
                                            console.log(response);

                                            //put the data on the map as markers with popups
                                            for (var i = 0; i < response.data.length; ++i) {
                                                var popup = "<table class='table table-hover table-striped table-md table-responsive' id='wiki'>" +
                                                "<tr><td class='left-align'>Title</td><td class='right-align'>" + response.data[i].title + "</td></tr>" +
                                                "<tr><td class='left-align'>Type</td><td class='right-align'>" + response.data[i].feature + "</td></tr>" +
                                                "<tr><td class='left-align'>Summary</td><td class='right-align'>" + response.data[i].summary + "</td></tr>" +
                                                "<tr><td class='left-align'>URL</td><td class='right-align'>" + "<a href='" + response.data[i].wikipediaUrl + "' >Read more</a>" + "</td></tr>" + "</table>";

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

                                //cafes
                                $.ajax({

                                    url: 'PHP/getCafes.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        north: window.north,
                                        south: window.south,
                                        east: window.east,
                                        west: window.west,
                                        countrySet: $('#selCountry').val()
                                    },

                                    success: function(response) {

                                        if(response.status.name == "ok"){
                                            console.log("cafes");
                                            console.log(response);

                                            //put the data on the map as markers with popups
                                            for (var i = 0; i < response.data.length; ++i) {
                                                var popup = "<table class='table table-hover table-striped table-sm table-responsive'>" +
                                                "<tr><td class='left-align'>Name</td><td class='right-align'>" + response.data[i].poi.name + "</td></tr>" +
                                                "<tr><td class='left-align'>Category</td><td class='right-align'>" + response.data[i].poi.categories[0] + "</td></tr>" +
                                                "<tr><td class='left-align'>Freeform Address</td><td class='right-align'>" + response.data[i].address.freeformAddress + "</td></tr>" +
                                                "<tr><td class='left-align'>Foursquare score</td><td class='right-align'>" + roundNum1(response.data[i].score) + "/10</td></tr>" +
                                                "<tr><td class='left-align'>Street</td><td class='right-align'>" + response.data[i].address.streetName + "</td></tr>" +
                                                "<tr><td class='left-align'>City</td><td class='right-align'>" + response.data[i].address.localName + "</td></tr>" + "</table>";

                                                var nearbyPois = L.marker( [response.array[i].lat, response.array[i].lng], {icon: poiIcon, title: "Cafe"} )
                                                    .bindPopup(popup);

                                                nearbyPoisClusterGroup.addLayer(nearbyPois);
                                            }
                                            nearbyPoisFeatureGroup.addLayer(nearbyPoisClusterGroup);
                                        }

                                    },

                                    error: function(xhr, status, error){
                                        console.log(xhr + "\n" + status + "\n" + error);
                                        console.warn(xhr.responseText)
                                    }

                                });

                                //pizza
                                $.ajax({

                                    url: 'PHP/getPizza.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        north: window.north,
                                        south: window.south,
                                        east: window.east,
                                        west: window.west,
                                        countrySet: $('#selCountry').val()
                                    },

                                    success: function(response) {

                                        if(response.status.name == "ok"){
                                            console.log("pizza");
                                            console.log(response);

                                            //put the data on the map as markers with popups
                                            for (var i = 0; i < response.data.length; ++i) {
                                                var popup = "<table class='table table-hover table-striped table-sm table-responsive'>" +
                                                "<tr><td class='left-align'>Name</td><td class='right-align'>" + response.data[i].poi.name + "</td></tr>" +
                                                "<tr><td class='left-align'>Category</td><td class='right-align'>" + response.data[i].poi.categories[0] + "</td></tr>" +
                                                "<tr><td class='left-align'>Freeform Address</td><td class='right-align'>" + response.data[i].address.freeformAddress + "</td></tr>" +
                                                "<tr><td class='left-align'>Foursquare score</td><td class='right-align'>" + roundNum1(response.data[i].score) + "/10</td></tr>" +
                                                "<tr><td class='left-align'>Street</td><td class='right-align'>" + response.data[i].address.streetName + "</td></tr>" +
                                                "<tr><td class='left-align'>City</td><td class='right-align'>" + response.data[i].address.localName + "</td></tr>" + "</table>";

                                                var nearbyPizza = L.marker( [response.array[i].lat, response.array[i].lng], {icon: pizzaIcon, title: "Pizza"} )
                                                    .bindPopup(popup);

                                                nearbyPizzaClusterGroup.addLayer(nearbyPizza);
                                            }
                                            nearbyPizzaFeatureGroup.addLayer(nearbyPizzaClusterGroup);
                                        }

                                    },

                                    error: function(xhr, status, error){
                                        console.log(xhr + "\n" + status + "\n" + error);
                                        console.warn(xhr.responseText)
                                    }

                                });

                                //shops
                                $.ajax({

                                    url: 'PHP/getShops.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        north: window.north,
                                        south: window.south,
                                        east: window.east,
                                        west: window.west,
                                        countrySet: $('#selCountry').val()
                                    },

                                    success: function(response) {

                                        if(response.status.name == "ok"){
                                            console.log("shops");
                                            console.log(response);

                                            //put the data on the map as markers with popups
                                            for (var i = 0; i < response.data.length; ++i) {
                                                var popup = "<table class='table table-hover table-striped table-sm table-responsive'>" +
                                                "<tr><td class='left-align'>Name</td><td class='right-align'>" + response.data[i].poi.name + "</td></tr>" +
                                                "<tr><td class='left-align'>Category</td><td class='right-align'>" + response.data[i].poi.categories[0] + "</td></tr>" +
                                                "<tr><td class='left-align'>Freeform Address</td><td class='right-align'>" + response.data[i].address.freeformAddress + "</td></tr>" +
                                                "<tr><td class='left-align'>Foursquare score</td><td class='right-align'>" + roundNum1(response.data[i].score) + "/10</td></tr>" +
                                                "<tr><td class='left-align'>Street</td><td class='right-align'>" + response.data[i].address.streetName + "</td></tr>" +
                                                "<tr><td class='left-align'>City</td><td class='right-align'>" + response.data[i].address.localName + "</td></tr>" + "</table>";

                                                var shops = L.marker( [response.array[i].lat, response.array[i].lng], {icon: shopIcon, title: "Shop"} )
                                                    .bindPopup(popup);

                                                shopsClusterGroup.addLayer(shops);
                                            }
                                            shopsFeatureGroup.addLayer(shopsClusterGroup);
                                        }

                                    },

                                    error: function(xhr, status, error){
                                        console.log(xhr + "\n" + status + "\n" + error);
                                        console.warn(xhr.responseText)
                                    }

                                });

                                //Electric Vehicle (EV) charging stations
                                $.ajax({

                                    url: 'PHP/getEVChargingStations.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        north: window.north,
                                        south: window.south,
                                        east: window.east,
                                        west: window.west,
                                        countrySet: $('#selCountry').val()
                                    },

                                    success: function(response) {

                                        if(response.status.name == "ok"){
                                            console.log("charging stations");
                                            console.log(response);

                                            //put the data on the map as markers with popups
                                            for (var i = 0; i < response.data.length; i++) {
                                                var popup = "<table class='table table-hover table-striped table-sm table-responsive'>" +
                                                "<tr><td class='left-align'>Name</td><td class='right-align'>" + response.data[i].poi.name + "</td></tr>" +
                                                "<tr><td class='left-align'>Phone</td><td class='right-align'>" + response.data[i].poi.phone + "</td></tr>" +
                                                "<tr><td class='left-align'>Category</td><td class='right-align'>" + response.data[i].poi.categories[0] + "</td></tr>" +
                                                "<tr><td class='left-align'>Freeform Address</td><td class='right-align'>" + response.data[i].address.freeformAddress + "</td></tr>" +
                                                "<tr><td class='left-align'>Foursquare score</td><td class='right-align'>" + roundNum1(response.data[i].score) + "/10</td></tr>" +
                                                "<tr><td class='left-align'>City</td><td class='right-align'>" + response.data[i].address.localName + "</td></tr>" + + "</table>";

                                                var evStations = L.marker( [response.array[i].lat, response.array[i].lng], {icon: evStationsIcon, title: "EV Charging Station"} )
                                                    .bindPopup(popup);

                                                evStationsClusterGroup.addLayer(evStations);
                                            }
                                            evStationsFeatureGroup.addLayer(evStationsClusterGroup);
                                        }

                                    },

                                    error: function(xhr, status, error){
                                        console.log(xhr + "\n" + status + "\n" + error);
                                        console.warn(xhr.responseText)
                                    }

                                });

                                //news
                                $.ajax({

                                    url: 'PHP/getNews.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        countryCode: $('#selCountry').val()
                                    },

                                    success: function(response) {

                                        if(response.status.name == "ok"){
                                            console.log("news");
                                            console.log(response);

                                            //clear any previous news
                                            newsData = "";

                                            //populate one string with all of the top headlines
                                            for (var i = 0; i < response.data.length; ++i) {
                                                newsData += "<table class='table table-hover table-striped table-sm table-responsive'>" +
                                                "<tr><td class='centre-align' colspan='2'><img  src='" + response.data[i].urlToImage + "' width='200' height='100'></td></tr>" +
                                                "<tr><td class='centre-align' colspan='2'><a href='" + response.data[i].url + "' target='_blank'>" + response.data[i].title + "</a>" + "</td></tr>" +
                                                "<tr><td class='centre-align' colspan='2'>" + response.data[i].description + "</td></tr>" +
                                                "<tr><td class='centre-align' colspan='2'>" + formatDatetime(response.data[i].publishedAt) + "</td></tr>" + "</table><hr class='hr1'>";
                                            }

                                        }

                                    },

                                    error: function(xhr, status, error){
                                        console.log(xhr + "\n" + status + "\n" + error);
                                        console.warn(xhr.responseText)
                                    }

                                });

                                //travel advisory - is it safe to travel?
                                $.ajax({

                                    url: 'PHP/getTravelAdvisory.php',
                                    type: 'GET',
                                    dataType: 'json',
                                    data: {
                                        isoCode: $('#selCountry').val()
                                    },

                                    success: function(response) {

                                        if(response.status.name == "ok"){
                                            console.log("travel");
                                            console.log(response);

                                            //populate one string with all of the travel info
                                            travelInfoData = "<table class='table table-hover table-striped table-sm table-responsive'>" +
                                            "<tr><td class='centre-align' colspan='2'>" + response.data.advisory.message + "</h1></td></tr>" +
                                            "<tr><td class='left-align'><img src='images/score.png' width='35' height='35'>&nbsp;Safety Score</td><td class='right-align'>" + response.data.advisory.score + "/5</td></tr>" +
                                            "<tr><td class='left-align'><img src='images/source.png' width='35' height='35'>&nbsp;Source</td><td class='right-align'><a href='" + response.data.advisory.source + "'>" + response.data.advisory.source + "</a></td></tr>" +
                                            "<tr><td class='left-align'><img src='images/update.png' width='35' height='35'>&nbsp;Updated</td><td class='right-align'>" + response.data.advisory.updated + "</td></tr>" + "</table>";
                                        }

                                    },

                                    error: function(xhr, status, error){
                                        console.log(xhr + "\n" + status + "\n" + error);
                                        console.warn(xhr.responseText)
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
                                                var popup = "<table class='table table-hover table-striped table-sm table-responsive'>" +
                                                "<tr><td class='left-align'>Magnitude</td><td class='right-align'>" + response.data[i].magnitude + "</td></tr>" +
                                                "<tr><td class='left-align'>Depth</td><td class='right-align'>" + response.data[i].depth + "</td></tr>" +
                                                "<tr><td class='left-align'>Date and time</td><td class='right-align'>" + toJSDate(response.data[i].datetime) + "</td></tr>" + "</table>";

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

                                            //if exchange rate data is avilable
                                            if(response.data){
                                                window.exchangeRate = "USD: " + roundNum2(response.data.USD) + "<br>EUR: " + roundNum2(response.data.EUR) + "<br>GBP: " + roundNum2(response.data.GBP)
                                                + "<br>AUD: " + roundNum2(response.data.AUD) + "<br>JPY: " + roundNum2(response.data.JPY);
                                            } else {
                                                window.exchangeRate = "unavailable";
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
                                                var popup = "<table class='table table-hover table-striped table-sm table-responsive'>" +
                                                "<tr><td class='left-align'>Station Name</td><td class='right-align'>" + response.data[i].stationName + "</td></tr>" +
                                                "<tr><td class='left-align'>Temperature</td><td class='right-align'>" + response.data[i].temperature + "°C" + "</td></tr>" +
                                                "<tr><td class='left-align'>Humidity</td><td class='right-align'>" + response.data[i].humidity + "%" + "</td></tr>" +
                                                "<tr><td class='left-align'>Wind Speed</td><td class='right-align'>" + response.data[i].windSpeed + "mph" + "</td></tr>" +
                                                "<tr><td class='left-align'>Clouds</td><td class='right-align'>" + response.data[i].clouds + "</td></tr>" +
                                                "<tr><td class='left-align'>Date And Time</td><td class='right-align'>" + toJSDate(response.data[i].datetime) + "</td></tr>" + "</table>";

                                                var localWeatherMarkers = L.marker( [response.array[i].lat, response.array[i].lng], {icon: localWeatherIcon, title: "Local Weather"} )
                                                    .bindPopup(popup);

                                                    localWeatherClusterGroup.addLayer(localWeatherMarkers);
                                            }

                                            localWeatherFeatureGroup.addLayer(localWeatherClusterGroup);
                                        }

                                    },

                                    error: function(){
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

                                    //current day weather
                                    var clouds = response.data.current.clouds;
                                    var feelsLike = response.data.current.feels_like;
                                    var humidity = response.data.current.humidity;
                                    var pressure = response.data.current.pressure;
                                    var sunrise = response.data.current.sunrise;
                                    var sunset = response.data.current.sunset;
                                    var temp = response.data.current.temp;
                                    var description = response.data.current.weather[0].description;

                                    //populate the weather modal with the curent weather plus 8 days in advance
                                    for(var i = 0; i < response.data.daily.length; i++){

                                    weatherData = "<table class='table table-hover table-striped table-md table-responsive' id='forecast'>" +
                                    "<thead><tr><th>" + "</th><th>Today</th><th>Tomorrow</th><th>" + addDaysToCurrentDate(2) + "</th><th>" + addDaysToCurrentDate(3) + "</th><th>" +
                                    addDaysToCurrentDate(4) + "</th><th>" + addDaysToCurrentDate(5) + "</th><th>" + addDaysToCurrentDate(6) + "</th><th>" + addDaysToCurrentDate(7) + "</th><th>" + addDaysToCurrentDate(8) + "</th>" +
                                    "</tr></thead><tbody><tr><td><img src='images/temperature.png' width='35' height='35'>Temperature</td><td>"  + convertKelvinToCelsius(temp) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[0].temp.day) + "°C</td>" +
                                    "<td>" + convertKelvinToCelsius(response.data.daily[1].temp.day) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[2].temp.day) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[3].temp.day) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[4].temp.day) + "°C</td><td>" +
                                    convertKelvinToCelsius(response.data.daily[5].temp.day) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[6].temp.day) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[7].temp.day) + "°C</td></tr>" +
                                    "<tr><td><img src='images/feelsLike.png' width='35' height='35'>&nbsp;Feels Like</td><td>" + convertKelvinToCelsius(feelsLike) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[0].feels_like.day) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[1].feels_like.day) + "°C</td>" +
                                    "<td>" + convertKelvinToCelsius(response.data.daily[2].feels_like.day) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[3].feels_like.day) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[4].feels_like.day) + "</td><td>" + convertKelvinToCelsius(response.data.daily[5].feels_like.day) + "°C</td>" +
                                    "<td>" + convertKelvinToCelsius(response.data.daily[6].feels_like.day) + "°C</td><td>" + convertKelvinToCelsius(response.data.daily[7].feels_like.day) + "°C</td></tr><tr><td><img src='images/description.png' width='35' height='35'>&nbsp;Description</td><td>" + description + "</td>" +
                                    "<td>" + response.data.daily[0].weather[0].description + "</td><td>" + response.data.daily[1].weather[0].description + "</td><td>" + response.data.daily[2].weather[0].description + "</td><td>" + response.data.daily[3].weather[0].description + "</td>" +
                                    "<td>" + response.data.daily[4].weather[0].description + "</td><td>" + response.data.daily[5].weather[0].description + "</td><td>" + response.data.daily[6].weather[0].description + "</td><td>" + response.data.daily[7].weather[0].description + "</td></tr>" +
                                    "<tr><td><img src='images/humidity.png' width='35' height='35'>&nbsp;Humidity</td><td>" + humidity + "%</td><td>" + response.data.daily[0].humidity + "%</td><td>" + response.data.daily[1].humidity + "%</td><td>" + response.data.daily[2].humidity + "%</td><td>" + response.data.daily[3].humidity + "%</td>" +
                                    "<td>" + response.data.daily[4].humidity + "%</td><td>" + response.data.daily[5].humidity + "%</td><td>" + response.data.daily[6].humidity + "%</td><td>" + response.data.daily[7].humidity + "%</td></tr><tr><td><img src='images/clouds.png' width='35' height='35'>&nbsp;Clouds</td>" +
                                    "<td>" + clouds + "</td><td>" + response.data.daily[0].clouds + "</td><td>" + response.data.daily[1].clouds + "</td><td>" + response.data.daily[2].clouds + "</td><td>" + response.data.daily[3].clouds + "</td><td>" + response.data.daily[4].clouds + "</td>" +
                                    "<td>" + response.data.daily[5].clouds + "</td><td>" + response.data.daily[6].clouds + "</td><td>" + response.data.daily[7].clouds + "</td></tr><tr><td><img src='images/pressure.png' width='35' height='35'>&nbsp;Pressure</td><td>" + pressure + "mb</td><td>" + response.data.daily[0].pressure + "mb</td>" +
                                    "<td>" + response.data.daily[1].pressure + "mb</td><td>" + response.data.daily[2].pressure + "mb</td><td>" + response.data.daily[3].pressure + "mb</td><td>" + response.data.daily[4].pressure + "mb</td><td>" + response.data.daily[5].pressure + "mb</td><td>" + response.data.daily[6].pressure + "mb</td>" +
                                    "<td>" + response.data.daily[7].pressure + "mb</td></tr><tr><td><img src='images/sunrise.png' width='35' height='35'>&nbsp;Sunrise</td><td>" + secondsToHHMMSS(sunrise) + "</td><td>" + secondsToHHMMSS(response.data.daily[0].sunrise) + "</td><td>" + secondsToHHMMSS(response.data.daily[1].sunrise) + "</td><td>" + secondsToHHMMSS(response.data.daily[2].sunrise) + "</td><td>" + secondsToHHMMSS(response.data.daily[3].sunrise) + "</td>" +
                                    "<td>" + secondsToHHMMSS(response.data.daily[4].sunrise) + "</td><td>" + secondsToHHMMSS(response.data.daily[5].sunrise) + "</td><td>" + secondsToHHMMSS(response.data.daily[6].sunrise) + "</td><td>" + secondsToHHMMSS(response.data.daily[7].sunrise) + "</td></tr><tr><td><img src='images/sunset.png' width='35' height='35'>&nbsp;Sunset</td><td>" + secondsToHHMMSS(sunset) + "</td>" +
                                    "<td>" + secondsToHHMMSS(response.data.daily[0].sunset) + "</td><td>" + secondsToHHMMSS(response.data.daily[1].sunset) + "</td><td>" + secondsToHHMMSS(response.data.daily[2].sunset) + "</td><td>" + secondsToHHMMSS(response.data.daily[3].sunset) + "</td><td>" + secondsToHHMMSS(response.data.daily[4].sunset) + "</td><td>" + secondsToHHMMSS(response.data.daily[5].sunset) + "</td>" +
                                    "<td>" + secondsToHHMMSS(response.data.daily[6].sunset) + "</td><td>" + secondsToHHMMSS(response.data.daily[7].sunset) + "</td></tr></tbody></table>";

                                    }

                                    //covid data from https://apify.com/covid-19
                                    $.ajax({

                                        url: 'PHP/getCovidData.php',
                                        type: 'GET',
                                        dataType: 'json',
                                        data: {
                                            countryName: window.country,
                                            countryCode: $('#selCountry').val()
                                        },

                                        success: function(response) {

                                            if(response.status.name == "ok"){
                                                console.log("Covid data");
                                                console.log(response);
                                                window.confirmed = response.data.latest_data.confirmed;
                                                window.deaths = response.data.latest_data.deaths;
                                                window.recovered = response.data.latest_data.recovered;
                                                window.confirmedToday = response.data.today.confirmed;
                                                window.deathsToday = response.data.today.deaths;
                                                window.casesPerMillion = response.data.latest_data.calculated.cases_per_million_population;
                                                window.deathRate = response.data.latest_data.calculated.death_rate;
                                                window.recoveryRate = response.data.latest_data.calculated.recovery_rate;
                                                window.updatedAt = response.data.updated_at;
                                            }

                                            coreInfo.addTo(map);
                                            covid.addTo(map);
                                            weather.addTo(map);
                                            news.addTo(map);
                                            travelInfo.addTo(map);

                                        },//end success

                                    error: function(errorThrown){
                                        console.log("error with Covid data: " + errorThrown);
                                    }

                                    });//end covid ajax call

                                }//end if

                            },//end success

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

//core info modal
coreInfo = L.easyButton('<img src="images/info.png" style="width:16px">', function(){

    //document.getElementById("selCountry").style.visibility = "hidden";

    //set the title
    document.getElementById("coreInfoTitle").innerHTML = "<img src='images/info.png' alt='weather icon' width='35' height='35'>&nbsp;Background: " + window.country;

    //set the content
    document.getElementById("coreInfoBody").innerHTML = "<table class='table table-hover table-striped table-md table-responsive' id='coreInfoTable'>" +
    "<tr><td><img src='images/capitol.png' width='35' height='35'>&nbsp;Capital</td><td class='right-align'>" + window.capital + "</td></tr>" +
    "<tr><td><img src='images/population.png' width='35' height='35'>&nbsp;Population</td><td class='right-align'>" + window.population + "</td></tr>" +
    "<tr><td><img src='images/continent.png' width='35' height='35'>&nbsp;Continent</td><td class='right-align'>" + window.continent + "</td></tr>" +
    "<tr><td><img src='images/timezone.png' width='35' height='35'>&nbsp;Timezone</td><td class='right-align'>" + window.timezoneName + ", " + window.timezoneShortName + "</td></tr>" +
    "<tr><td><img src='images/currency.png' width='35' height='35'>&nbsp;Currency</td><td class='right-align'>" + window.currencyName + " (" + window.currencySymbol + ")" + "</td></tr>" +
    "<tr><td><img src='images/currencySubunit.png' width='35' height='35'>&nbsp;Subunit</td><td class='right-align'>" + window.currencySubunit + "</td></tr>" +
    "<tr><td><img src='images/exchangeRate.png' width='35' height='35'>&nbsp;Current Exhange Rates</td><td class='right-align'>" + window.exchangeRate + "</td></tr>" +
    "<tr><td><img src='images/driveOn.png' width='35' height='35'>&nbsp;Drive on</td><td class='right-align'>" + window.driveOn + "</td></tr>" +
    "<tr><td><img src='images/speedIn.png' width='35' height='35'>&nbsp;Speed in</td><td class='right-align'>" + window.speedIn + "</td></tr>" + "</table>";

    //show the modal when clicked
    $('#coreInfoModal').modal('toggle');
    //$( "#selCountry" ).hide();

});

//style the buttons
coreInfo.button.style.width = '35px';
coreInfo.button.style.height = '35px';

//Covid 19 modal
covid = L.easyButton("<img src='images/covid.png' style='width:16px'>", function(){    //virus png from pngtree.com

    //set the title
    document.getElementById("covidTitle").innerHTML = "<img src='images/covid.png' alt='virus icon' width='35' height='35'>&nbsp;Covid 19: " + window.country;

    //set the content
    document.getElementById("covidBody").innerHTML = "<table class='table table-hover table-striped table-md table-responsive'>" +
    "<tr><td><img src='images/cases.png' width='35' height='35'>Cases</td><td class='right-align'>" + formatNumber(window.confirmed )+"</td></tr>" +
    "<tr><td><img src='images/deaths.png' width='35' height='35'>Deaths</td><td class='right-align'>" + formatNumber(window.deaths) + "</td></tr>" +
    "<tr><td><img src='images/recovered.png' width='35' height='35'>Recovered</td><td class='right-align'>" + formatNumber(window.recovered) + "</td></tr>" +
    "<tr><td><img src='images/casesToday.png' width='35' height='35'>Cases Today</td><td class='right-align'>" + formatNumber(window.confirmedToday) + "</td></tr>" +
    "<tr><td><img src='images/deaths.png' width='35' height='35'>Deaths Today</td><td class='right-align'>" + formatNumber(window.deathsToday) + "</td></tr>" +
    "<tr><td><img src='images/caseRate.png' width='35' height='35'>Case&nbspRate</td><td class='right-align'>" + window.casesPerMillion + "/mil" + "</td></tr>" +
    "<tr><td><img src='images/deathRate.png' width='35' height='35'>Death Rate</td><td class='right-align'>" + roundNum1(window.deathRate) + "%" + "</td></tr>" +
    "<tr><td><img src='images/recoveryRate.png' width='35' height='35'>Recovery Rate</td><td class='right-align'>" + roundNum1(window.recoveryRate) + "%" + "</td></tr>" +
    "<tr><td><img src='images/updatedAt.png' width='35' height='35'>&nbsp;Updated</td><td class='right-align'>" + formatDatetime(window.updatedAt) + "</td></tr>" + "</table>";

    $('#covidModal').modal('show');

});

covid.button.style.width = '35px';
covid.button.style.height ='35px';

//weather modal
weather = L.easyButton("<img src='images/weather.png' style='width:16px'>", function(){

    //set the title
    document.getElementById("nationalWeatherTitle").innerHTML = "<img src='images/weather.png' alt='weather icon' width='35' height='35'>&nbsp;Forecast: " + window.country;

    //set the content
    document.getElementById("nationalWeatherBody").innerHTML = weatherData;

    $('#nationalWeatherModal').modal('show');

});

weather.button.style.width = '35px';
weather.button.style.height = '35px';

//news modal
news = L.easyButton("<img src='images/news.png' style='width:16px'>", function(){

    //set the title
    document.getElementById("newsTitle").innerHTML = "<img src='images/news.png' alt='news icon' width='35' height='35'>&nbsp;Top Headlines: " + window.country;

    //set the content
    document.getElementById("newsBody").innerHTML = newsData;

    //if the news response is valid ie if there is news tobe displayed, display it.
    if(newsData){
        $('#newsModal').modal('show');
    } else {
        //otherwise show a message to say "news unavailable".
        document.getElementById("noNewsDiv").style.visibility = "visible";
    }

});

news.button.style.width = '35px';
news.button.style.height = '35px';

//travel modal
travelInfo = L.easyButton("<img src='images/travel.png' style='width:16px'>", function(){

    //set the title
    document.getElementById("travelTitle").innerHTML = "<img src='images/travel.png' alt='travel icon' width='35' height='35'>&nbsp;Travel Advice: " + window.country;

    //set the content
    document.getElementById("travelBody").innerHTML = travelInfoData;

    if(travelInfoData){
        $('#travelModal').modal('show');
    }

});

travelInfo.button.style.width = '35px';
travelInfo.button.style.height = '35px';