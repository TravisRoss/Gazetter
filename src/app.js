/**
 * @file app.js - Main application script for the Gazetteer project.
 * Uses Leaflet for map display, jQuery for DOM manipulation, and various APIs
 * to display geographical data, weather, news, and points of interest.
 */

import { fetchCountryCode, makeAjaxCall } from './modules/api.js'
import { createCoreInfoButton, updateMapWithBorder } from './modules/map.js'
import { handleGeoData, handleWikiLinks } from './modules/data.js'
import {
  fetchPOIData,
  processPOI,
  nearbyPizzaClusterGroup,
  nearbyShopsClusterGroup,
  evStationsClusterGroup,
} from './modules/poi.js'
import {
  fetchWeatherDataForCapital,
  createWeatherButton,
  showWeatherModal,
} from './modules/weather.js'
import {
  clearMapLayers,
  earthquakeFeatureGroup,
  wikiLinksFeatureGroup,
  localWeatherFeatureGroup,
  nearbyPoisFeatureGroup,
  evStationsFeatureGroup,
  nearbyPizzaFeatureGroup,
  shopsFeatureGroup,
  earthquakes,
  wikiLinks,
  localWeather,
  nearbyPois,
  evChargingStations,
  nearbyPizza,
  nearbyShops,
} from './modules/layers.js'
import {
  earthquakeIcon,
  wikiIcon,
  poiIcon,
  weatherIcon,
  localWeatherIcon,
  evStationsIcon,
  pizzaIcon,
  shopIcon,
  updateIcon,
  scoreIcon,
  sourceIcon,
} from './modules/icons.js'

// Load a GIF while the page loads
$(window).on('load', function () {
  $('#loading').hide()
})

// Global variables (Minimize these as much as possible)
window.map = L.map('mapid').setView([0, 0], 2) // Initialize map
window.countryCode = null // Current country code

let storedWeatherData = null // Store weather data
let weatherButtonCreated = false // Flag for weather button
const popup = L.popup() // Reusable popup instance

// Initialize base layers and add the default one to the map
const worldStreetMap = L.tileLayer.provider('OpenStreetMap.DE', {
  maxZoom: 18,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})
const tonerMap = L.tileLayer.provider('Stamen.Toner', {
  maxZoom: 18,
  attribution:
    'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
})
const defaultMap = L.tileLayer
  .provider('Esri.WorldStreetMap', {
    maxZoom: 18,
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
  })
  .addTo(window.map)
const USGS_USImageryTopo = L.tileLayer.provider('USGS.USImageryTopo', {
  maxZoom: 18,
  attribution:
    'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
})

// Add the base maps to a control and add it to the map
const baseMaps = {
  'Default Map': defaultMap,
  'Toner Map': tonerMap,
  'World Street Map': worldStreetMap,
  'US Imagery': USGS_USImageryTopo,
}

const overlayMaps = {
  Earthquakes: earthquakes,
  'Wikipedia Links': wikiLinks,
  'Local Weather': localWeather,
  Cafes: nearbyPois,
  Pizza: nearbyPizza,
  Shops: nearbyShops,
  'EV Charging Stations': evChargingStations,
  'Extra Labels': L.tileLayer.provider('Stamen.TonerLabels'), // Direct use
  'Cycling Trails': L.tileLayer.provider('WaymarkedTrails.cycling'), // Direct use
  'Hiking Trails': L.tileLayer.provider('WaymarkedTrails.hiking'), // Direct use
}

L.control.layers(baseMaps, overlayMaps).addTo(window.map)

// Add core info button to the map
const coreInfoBtn = createCoreInfoButton()
coreInfoBtn.addTo(window.map)

/**
 * Populates the country select element with country names and codes from a PHP script.
 * Also handles geolocation to set the initial country.
 */
$(document).ready(function () {
  $.ajax({
    url: 'PHP/getCodeAndName.php',
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.status.name === 'ok') {
        const options = response.data.reduce((html, country) => {
          const code = /\d/.test(country.code) ? 'SO' : country.code
          return html + `<option value="${code}">${country.name}</option>`
        }, '')
        $('#selCountry').append(options)
        console.log('getCodeAndName successful')
        handleInitialGeolocation()
      }
    },
    error: function (errorThrown) {
      console.error('Error with code and name:', errorThrown)
    },
  })
})

/**
 * Handles the initial geolocation to set the country based on the user's location.
 */
function handleInitialGeolocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetchCountryCode(latitude, longitude)
          if (response.status.name === 'ok') {
            const countryCode = response.code
            $('#selCountry').val(countryCode).change()
            window.countryCode = countryCode
          }
        } catch (error) {
          console.error('Geolocation error:', error)
        }
      },
      function (error) {
        console.warn('Geolocation permission denied or unavailable:', error)
      }
    )
  } else {
    console.log('Your browser does not support geolocation!')
  }
}

/**
 * Validates if a bounds object contains valid latitude and longitude values.
 * @param {object} bounds - The bounds object with north, south, east, west properties.
 * @returns {boolean} - True if the bounds are valid, false otherwise.
 */
function isValidBounds(bounds) {
  return (
    bounds &&
    typeof bounds.north === 'number' &&
    typeof bounds.south === 'number' &&
    typeof bounds.east === 'number' &&
    typeof bounds.west === 'number' &&
    Number.isFinite(bounds.north) &&
    Number.isFinite(bounds.south) &&
    Number.isFinite(bounds.east) &&
    Number.isFinite(bounds.west)
  )
}

/**
 * Handles the selection of a country from the dropdown, fetching and displaying data.
 */
async function selectCountry() {
  console.log('Country selected')
  const isoCode = $('#selCountry').val()
  const countryName = $('#selCountry').find(':selected').text()
  console.log('Fetching data for:', isoCode, countryName)

  try {
    $('#selCountry').prop('disabled', true)
    clearMapLayers()

    // 1. Fetch essential data (country border and core info)
    const [borderResponse, coreInfoResponse] = await Promise.all([
      makeAjaxCall('PHP/getCountryBorder.php', { isoCode }),
      makeAjaxCall('PHP/getCoreInfo.php', {
        countryCode: isoCode,
        name: countryName,
      }),
    ])

    updateMapWithBorder(borderResponse)

    // 2. Extract map boundaries and validate
    const coordinates = borderResponse?.data?.geometry?.coordinates?.[0]
    if (!coordinates) {
      throw new Error('No coordinates found in border response')
    }

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

    if (!isValidBounds(bounds)) {
      throw new Error('Invalid bounds calculated from border data')
    }

    window.mapBounds = bounds
    window.countryCode = isoCode
    console.log(
      'Updated map boundaries:',
      window.mapBounds,
      'Country code:',
      window.countryCode
    )

    // 3. Process core information
    if (coreInfoResponse?.status?.name !== 'ok') {
      throw new Error('Invalid core info response')
    }
    Object.assign(window, coreInfoResponse.data)
    setCurrentCoreInfo(coreInfoResponse.data)

    // 4. Fetch and handle additional data
    await Promise.all([handleGeoData(isoCode), handleWikiLinks()])

    await handlePOIs()

    // 5. Fetch weather data
    const capital = coreInfoResponse.data.capital
    storedWeatherData = await fetchWeatherDataForCapital(capital)

    // 6. Create weather button (only once)
    if (!weatherButtonCreated) {
      createWeatherButton()
      weatherButtonCreated = true
    }
  } catch (error) {
    console.error('Error in selectCountry:', error)
  } finally {
    $('#selCountry').prop('disabled', false)
  }
}

/**
 * Handles the fetching and processing of Points of Interest (POIs).
 */
async function handlePOIs() {
  try {
    if (!window.mapBounds || !window.countryCode) {
      throw new Error('Map boundaries and country code must be defined')
    }

    // Fetch POI data
    const [cafesResponse, pizzaResponse, shopsResponse, evStationsResponse] =
      await Promise.all([
        fetchPOIData('getCafes.php'),
        fetchPOIData('getPizza.php'),
        fetchPOIData('getShops.php'),
        fetchPOIData('getEVchargingStations.php'),
      ])

    // Process POI data
    processPOI('getCafes.php', cafesResponse)
    processPOI('getPizza.php', pizzaResponse)
    processPOI('getShops.php', shopsResponse)
    processPOI('getEVchargingStations.php', evStationsResponse)
  } catch (error) {
    console.error('Error in handlePOIs:', error)
  }
}

// Attach the selectCountry function to the change event of the select element.
$('#selCountry').change(selectCountry)
