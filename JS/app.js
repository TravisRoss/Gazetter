//load a gif while page loads
$(window).load(function () {
  $('#loading').hide()
})

//global variables
var border = null
var weatherMarker = null
var popup = L.popup()

//declare modals and their data
var coreInfo = null //modal
var covid = null //modal
var weather = null //modal
var weatherData = null //data
var news = null //modal
var newsData = null //data
var travelInfo = null //modal
var travelInfoData = null //data

//ClusterGroups
var wikiClusterGroup = L.markerClusterGroup()
var earthquakeClusterGroup = L.markerClusterGroup()
var localWeatherClusterGroup = L.markerClusterGroup()
var nearbyPoisClusterGroup = L.markerClusterGroup()
var evStationsClusterGroup = L.markerClusterGroup()
var nearbyPizzaClusterGroup = L.markerClusterGroup()
var nearbyShopsClusterGroup = L.markerClusterGroup()

//featureGroups
var earthquakeFeatureGroup = L.featureGroup()
var wikiLinksFeatureGroup = L.featureGroup()
var localWeatherFeatureGroup = L.featureGroup()
var nearbyPoisFeatureGroup = L.featureGroup()
var evStationsFeatureGroup = L.featureGroup()
var nearbyPizzaFeatureGroup = L.featureGroup()
var shopsFeatureGroup = L.featureGroup()

//combines all the feature groups into one layer so you can add or remove them from the map at once.
var earthquakes = L.layerGroup([earthquakeFeatureGroup])
var wikiLinks = L.layerGroup([wikiLinksFeatureGroup])
var localWeather = L.layerGroup([localWeatherFeatureGroup])
var nearbyPois = L.layerGroup([nearbyPoisFeatureGroup])
var evChargingStations = L.layerGroup([evStationsFeatureGroup])
var nearbyPizza = L.layerGroup([nearbyPizzaFeatureGroup])
var nearbyShops = L.layerGroup([shopsFeatureGroup])

//toner labels
var Stamen_TonerLabels = L.tileLayer.provider('Stamen.TonerLabels', {
  attribution:
    'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png',
})

//hiking trails
var WaymarkedTrails_hiking = L.tileLayer.provider('WaymarkedTrails.hiking', {
  maxZoom: 18,
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
})

//cycling trails
var WaymarkedTrails_cycling = L.tileLayer.provider('WaymarkedTrails.cycling', {
  maxZoom: 18,
  attribution:
    'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
})

//initialise the map and get user location
var map = L.map('mapid').locate({
  setView: true,
  maxZoom: 6,
  layers: [defaultMap, earthquakes, wikiLinks, localWeather, nearbyPois],
})

//create base layers and add the default one to the map:
var worldStreetMap = L.tileLayer.provider('OpenStreetMap.DE', {
  id: 'mapid',
  maxZoom: 18,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})
var tonerMap = L.tileLayer.provider('Stamen.Toner', {
  id: 'mapid',
  maxZoom: 18,
  attribution:
    'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})
var defaultMap = L.tileLayer
  .provider('Esri.WorldStreetMap', {
    id: 'mapid',
    maxZoom: 18,
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
  })
  .addTo(map)
var USGS_USImageryTopo = L.tileLayer.provider('USGS.USImageryTopo', {
  id: 'mapid',
  maxZoom: 18,
  attribution:
    'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
})

//add the base maps
var baseMaps = {
  'Default Map': defaultMap,
  'Toner Map': tonerMap,
  'World Street Map': worldStreetMap,
  'US Imagery': USGS_USImageryTopo,
}

var overlayMaps = {
  Earthquakes: earthquakes,
  'Wikipedia Links': wikiLinks,
  'Local Weather': localWeather,
  Cafes: nearbyPois,
  Pizza: nearbyPizzaClusterGroup,
  Shops: nearbyShopsClusterGroup,
  'EV Charging Stations': evChargingStations,
  'Extra Labels': Stamen_TonerLabels,
  'Cycling Trails': WaymarkedTrails_cycling,
  'Hiking Trails': WaymarkedTrails_hiking,
}

L.control.layers(baseMaps, overlayMaps).addTo(map)

//icons
var earthquakeIcon = L.icon({
  iconUrl: 'images/earthquake.png',
  iconRetinaUrl: 'images/earthquake.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var wikiIcon = L.icon({
  iconUrl: 'images/wikiIcon.png',
  iconRetinaUrl: 'images/wikiIcon.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var poiIcon = L.icon({
  iconUrl: 'images/cafe.png',
  iconRetinaUrl: 'images/cafe.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var weatherIcon = L.icon({
  iconUrl: 'images/weather.png',
  iconRetinaUrl: 'images/weather.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var localWeatherIcon = L.icon({
  iconUrl: 'images/localweather.png',
  iconRetinaUrl: 'images/localweather.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var evStationsIcon = L.icon({
  iconUrl: 'images/evStations.png',
  iconRetinaUrl: 'images/evStations.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var pizzaIcon = L.icon({
  iconUrl: 'images/pizzaIcon.png',
  iconRetinaUrl: 'images/pizzaIcon.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var shopIcon = L.icon({
  iconUrl: 'images/shopIcon.png',
  iconRetinaUrl: 'images/shopIcon.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var updateIcon = L.icon({
  iconUrl: 'images/update.png',
  iconRetinaUrl: 'images/update.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var scoreIcon = L.icon({
  iconUrl: 'images/score.png',
  iconRetinaUrl: 'images/score.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

var sourceIcon = L.icon({
  iconUrl: 'images/source.png',
  iconRetinaUrl: 'images/source.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14],
})

//format date and time
function toJSDate(dateTime) {
  var dateTime = dateTime.split(' ') //dateTime[0] = date, dateTime[1] = time
  var date = dateTime[0].split('-')
  var time = dateTime[1].split(':')
  //(year, month, day, hours, minutes, seconds, milliseconds)
  //month is 0 indexed so date[1] - 1 corrected format
  return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2], 0)
}

//format datetime
function formatDatetime(date) {
  //Date.parse() returns a Number, then use new Date() to parse it:
  var thedate = new Date(Date.parse(date))
  return thedate
}

//format big numbers, seperating thousands with commas
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

//convert time in seconds to HHMMSS
function secondsToHHMMSS(seconds) {
  return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]
}

//rounds the number passed in to 2 decimal places
function roundNum2(num) {
  return (Math.round(num * 100) / 100).toFixed(2)
}

//rounds the number passed in to 1 decimal places
function roundNum1(num) {
  return (Math.round(num * 100) / 100).toFixed(1)
}

//convert K to C and give 1 dp
function convertKelvinToCelsius(num) {
  return roundNum1(num - 273.15)
}

//add a certain number of days to todays data. to be used for the weather forecast
function addDaysToCurrentDate(num) {
  var someDate = new Date()
  var numberOfDaysToAdd = num
  someDate.setDate(someDate.getDate() + numberOfDaysToAdd)

  //format to dd//mm/yy
  var dd = someDate.getDate()
  var mm = someDate.getMonth() + 1
  var y = someDate.getFullYear()

  var someFormattedDate = dd + '/' + mm + '/' + y
  return someFormattedDate
}

//Populate the select with country names and country codes.
$(document).ready(function () {
  $.ajax({
    url: 'PHP/getCodeAndName.php',
    type: 'GET',
    dataType: 'json',
    data: {},

    success: function (response) {
      if (response.status.name == 'ok') {
        //check if the country code contains a number
        function hasNumber(myString) {
          return /\d/.test(myString)
        }

        var options = ''
        //loop through the response object and populate the select tag
        for (var i = 0; i < 175; i++) {
          if (hasNumber(response['data'][i]['code'])) {
            options +=
              '<option value="' +
              'SO' +
              '">' +
              response['data'][i]['name'] +
              '</option>'
          } else {
            options +=
              '<option value="' +
              response['data'][i]['code'] +
              '">' +
              response['data'][i]['name'] +
              '</option>'
          }
        }
        $('#selCountry').append(options)
        console.log('getCodeAndName sucessful')
      }

      //Geolocate
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(function (position) {
          lat = position.coords.latitude
          lng = position.coords.longitude

          $.ajax({
            url: 'PHP/getCountryCode.php',
            type: 'GET',
            dataType: 'json',
            data: {
              lat: lat,
              lng: lng,
            },

            success: function (response) {
              if (response.status.name == 'ok') {
                console.log('country code')
                console.log(response.code)
                $('#selCountry').val(response.code).change()
                window.countryCode = response.code
              }
            },

            error: function (errorThrown) {
              console.log('Country code error: ' + errorThrown)
            },
          })
        })
      } else {
        console.log('Your browser does not support geolocation!')
      }
    },

    error: function (errorThrown) {
      console.log('Error with code and name: ' + errorThrown)
    },
  })
}) //end on document ready function

async function selectCountry() {
  const isoCode = $('#selCountry').val()
  const name = $('#selCountry').find('option:selected').text()
  console.log('Fetching data for:', isoCode)

  try {
    // Disable UI during processing
    $('#selCountry').prop('disabled', true)
    clearMapLayers()

    // 1. Fetch essential data first (country border + core info)
    const [borderResponse, coreInfoResponse] = await Promise.all([
      makeAjaxCall('PHP/getCountryBorder.php', { isoCode }),
      makeAjaxCall('PHP/getCoreInfo.php', { isoCode, name }),
    ])

    console.log('Border response:', borderResponse)

    // Update map with border
    updateMapWithBorder(borderResponse)

    // Extract and assign map boundaries to window.mapBounds
    const coordinates = borderResponse?.data?.geometry?.coordinates?.[0]
    if (coordinates) {
      const bounds = coordinates.reduce(
        (acc, [lng, lat]) => {
          acc.north = Math.max(acc.north, lat)
          acc.south = Math.min(acc.south, lat)
          acc.east = Math.max(acc.east, lng)
          acc.west = Math.min(acc.west, lng)
          return acc
        },
        { north: -Infinity, south: Infinity, east: -Infinity, west: Infinity }
      )

      window.mapBounds = bounds
      console.log('Updated map boundaries:', window.mapBounds)
    } else {
      throw new Error('Failed to extract boundaries from borderResponse')
    }

    if (coreInfoResponse?.status?.name !== 'ok') {
      throw new Error('Invalid core info response')
    }

    // Process core info and prepare subsequent requests
    Object.assign(window, coreInfoResponse.data)

    // 2. Fetch dependent data sequentially
    await handleGeoData(isoCode)
    await handleWikiLinks()
    await handlePOIs()
  } catch (error) {
    console.error('Error in workflow:', error)
  } finally {
    // Re-enable UI after processing
    $('#selCountry').prop('disabled', false)
  }
}

async function fetchPOIData(endpoint) {
  // Validate required parameters with fallbacks
  const params = {
    north: window.mapBounds?.north || 0,
    south: window.mapBounds?.south || 0,
    east: window.mapBounds?.east || 0,
    west: window.mapBounds?.west || 0,
    countrySet: window.countryCode || 'US',
  }

  // Validate critical parameters
  if (!params.countrySet || !window.mapBounds) {
    throw new Error('Missing required map boundaries or country code')
  }

  try {
    const response = await fetch(
      `PHP/${endpoint}?${new URLSearchParams(params)}`
    )
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

    const result = await response.json()
    console.log(`Response from ${endpoint}:`, result) // Debugging
    return result
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error)
    throw error
  }
}

async function handlePOIs() {
  try {
    if (!window.mapBounds || !window.countryCode) {
      throw new Error('Map boundaries and country code must be defined')
    }

    // Add EV charging stations to the Promise.all array
    const [cafesResponse, pizzaResponse, shopsResponse, evStationsResponse] =
      await Promise.all([
        fetchPOIData('getCafes.php'),
        fetchPOIData('getPizza.php'),
        fetchPOIData('getShops.php'),
        fetchPOIData('getEVchargingStations.php'), // NEW
      ])

    console.log('Cafes response:', cafesResponse)
    console.log('Pizza response:', pizzaResponse)
    console.log('Shops response:', shopsResponse)
    console.log('EV Charging Stations response:', evStationsResponse) // NEW

    if (cafesResponse?.data) {
      processPOI('getCafes.php', cafesResponse)
    } else {
      console.warn('Invalid cafes response structure', cafesResponse)
    }

    if (pizzaResponse?.array && pizzaResponse?.data) {
      processPOI('getPizza.php', pizzaResponse)
    } else {
      console.warn('Invalid pizza response structure', pizzaResponse)
    }

    if (shopsResponse?.array && shopsResponse?.data) {
      processPOI('getShops.php', shopsResponse)
    } else {
      console.warn('Invalid shops response structure', shopsResponse)
    }

    // Process EV charging stations
    if (evStationsResponse?.data) {
      processPOI('getEVchargingStations.php', evStationsResponse)
    } else {
      console.warn(
        'Invalid EV charging stations response structure',
        evStationsResponse
      )
    }
  } catch (error) {
    console.error('Error in handlePOIs:', error)
  }
}

function processPOI(endpoint, response) {
  const isPizzaEndpoint = endpoint.includes('Pizza')
  const isShopsEndpoint = endpoint.includes('Shops')
  const isEVEndpoint = endpoint.includes('EVchargingStations') // NEW

  // Define or use an existing cluster group for EV stations
  const clusterGroup = isPizzaEndpoint
    ? nearbyPizzaClusterGroup
    : isShopsEndpoint
      ? nearbyShopsClusterGroup
      : isEVEndpoint
        ? nearbyEVClusterGroup // Define this elsewhere if not already
        : nearbyPoisFeatureGroup

  let latLngArray, dataArray

  if (isPizzaEndpoint || isShopsEndpoint) {
    latLngArray = response.array
    dataArray = response.data
  } else {
    latLngArray = response.data.map((item) => ({
      lat: item.lat,
      lon: item.lng,
    }))
    dataArray = response.data
  }

  if (!Array.isArray(latLngArray) || !Array.isArray(dataArray)) {
    console.warn(`Invalid data structure for ${endpoint}`, response)
    return
  }

  // Use a custom icon for EV charging stations
  const evIcon = L.icon({
    iconUrl: 'ev-charger.png', // Provide the path to your EV icon image
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -28],
  }) // See [3] for custom icons

  dataArray.forEach((item, index) => {
    const latLng =
      isPizzaEndpoint || isShopsEndpoint ? item.position : latLngArray[index]

    if (
      !latLng ||
      typeof latLng.lat === 'undefined' ||
      typeof latLng.lon === 'undefined'
    ) {
      console.warn(`Skipping POI at index ${index}: Missing coordinates`, item)
      return
    }

    const lat = latLng.lat
    const lng = latLng.lon

    // Choose icon
    let icon
    if (isPizzaEndpoint) icon = pizzaIcon
    else if (isShopsEndpoint) icon = shopIcon
    else if (isEVEndpoint) icon = evIcon
    else icon = poiIcon

    // Create the marker and bind the popup with POI details
    const marker = L.marker([lat, lng], { icon }).bindPopup(
      `<strong>${item.poi?.name || 'EV Charging Station'}</strong><br>${item.poi?.categories?.join(', ') || ''}<br>${item.address?.freeformAddress || item.address?.streetName || ''}`
    )

    clusterGroup.addLayer(marker)
  })

  console.log(
    `Added ${dataArray.length} markers to ${isPizzaEndpoint ? 'Pizza' : isShopsEndpoint ? 'Shops' : isEVEndpoint ? 'EV Charging Stations' : 'Cafes'} layer`
  )
}

// Helper function for sequential GeoData processing
async function handleGeoData(isoCode) {
  try {
    const response = await makeAjaxCall('PHP/getGeoData.php', { isoCode })
    if (response?.status?.name === 'ok') {
      Object.assign(window, { geoData: response.data })
      console.log('GeoData processed successfully.')
    } else {
      throw new Error('GeoData request failed')
    }
  } catch (error) {
    console.error('Error in handleGeoData:', error)
  }
}

// Add this utility function
const sanitizeCircular = (data) => {
  const seen = new WeakSet()
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return undefined // Remove circular references
        seen.add(value)
      }
      return value
    })
  )
}

// Updated handleWikiLinks
async function handleWikiLinks() {
  try {
    const response = await makeAjaxCall('PHP/getWikiLinks.php', {
      geoData: window.geoData,
      userSettings: window.userSettings,
    })
    if (response?.status?.name === 'ok') {
      const safeData = sanitizeCircular(response.data) // Sanitize here
      processWikiLinks(safeData)
    }
  } catch (error) {
    console.error('Error in handleWikiLinks:', error)
  }
}

// Helper function for UUID generation
function generateUUID() {
  return (
    crypto.randomUUID?.() ||
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    )
  )
}

// Generic AJAX helper with caching and retry logic
const ajaxCache = new Map()

async function makeAjaxCall(url, data, retries = 2) {
  const cacheKey = `${url}-${JSON.stringify(data)}`
  if (ajaxCache.has(cacheKey)) {
    return ajaxCache.get(cacheKey) // Return cached result
  }

  try {
    const response = await $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      data: data,
      timeout: 10000, // 10-second timeout
    })

    if (!response || response.status?.name !== 'ok') {
      throw new Error(`Invalid response from ${url}`)
    }

    ajaxCache.set(cacheKey, response) // Cache the result
    return response
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying ${url}... (${retries} retries left)`)
      return makeAjaxCall(url, data, retries - 1) // Retry logic
    }
    console.error(`AJAX Error (${url}):`, error)
    throw error
  }
}

// Helper functions for processing responses

function updateMapWithBorder(response) {
  if (response?.status?.name === 'ok') {
    if (map.hasLayer(border)) map.removeLayer(border)

    border = L.geoJson(response.data, {
      color: '#FF0000',
      weight: 4,
      opacity: 1,
    }).addTo(map)
    map.fitBounds(border.getBounds())

    console.log('Map updated with country border.')
  } else {
    console.error('Failed to update map with border:', response)
  }
}

function processWikiLinks(data) {
  data.forEach((item) => {
    const marker = L.marker([item.lat, item.lng], { icon: wikiIcon }).bindPopup(
      `<strong>${item.title}</strong><br>${item.summary}<br><a href="${item.wikipediaUrl}" target="_blank">Read more</a>`
    )

    wikiClusterGroup.addLayer(marker)
  })

  wikiLinksFeatureGroup.addLayer(wikiClusterGroup)
}

function clearMapLayers() {
  ;[wikiClusterGroup, nearbyPizzaClusterGroup, nearbyPoisClusterGroup].forEach(
    (group) => group.clearLayers()
  )
}
