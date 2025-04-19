/**
 * @file modules/poi.js - Contains functions for fetching and processing Points of Interest (POIs).
 */

import $ from 'jquery'
import * as L from 'leaflet'
import 'leaflet.markercluster' // Import leaflet plugins

// ClusterGroups
export const nearbyPizzaClusterGroup = L.markerClusterGroup()
export const nearbyShopsClusterGroup = L.markerClusterGroup()
export const evStationsClusterGroup = L.markerClusterGroup()

/**
 * Fetches Points of Interest (POIs) data from the specified endpoint.
 * @param {string} endpoint - The API endpoint to fetch POI data from.
 * @returns {Promise} - A promise that resolves with the POI data or rejects with an error.
 */
export async function fetchPOIData(endpoint) {
  if (!window.mapBounds || !window.countryCode) {
    throw new Error('Map boundaries and country code must be defined')
  }

  const params = {
    north: window.mapBounds.north,
    south: window.mapBounds.south,
    east: window.mapBounds.east,
    west: window.mapBounds.west,
    countrySet: window.countryCode,
  }

  console.log('Fetching POIs with params:', params)

  try {
    const response = await fetch(
      `PHP/${endpoint}?${new URLSearchParams(params)}`
    )
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

    const result = await response.json()
    console.log(`Response from ${endpoint}:`, result)
    return result
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error)
    throw error
  }
}

/**
 * Processes Points of Interest (POIs) data and adds markers to the map.
 * @param {string} endpoint - The API endpoint that provided the data.
 * @param {object} response - The response data containing POI information.
 */
export function processPOI(endpoint, response) {
  if (!response || !response.data) {
    console.warn(`Invalid data structure for ${endpoint}`, response)
    return
  }

  const isPizzaEndpoint = endpoint.includes('Pizza')
  const isShopsEndpoint = endpoint.includes('Shops')
  const isEVEndpoint = endpoint.includes('EVchargingStations')

  const clusterGroup = isPizzaEndpoint
    ? nearbyPizzaClusterGroup
    : isShopsEndpoint
      ? nearbyShopsClusterGroup
      : isEVEndpoint
        ? evStationsClusterGroup
        : window.nearbyPoisFeatureGroup

  let latLngArray, dataArray

  if (isPizzaEndpoint || isShopsEndpoint) {
    if (!response.array || !response.data) {
      console.warn(`Invalid data structure for ${endpoint}`, response)
      return
    }
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

  const evIcon = L.icon({
    iconUrl: 'images/evStations.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14],
  })

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

    let icon
    if (isPizzaEndpoint) icon = pizzaIcon
    else if (isShopsEndpoint) icon = shopIcon
    else if (isEVEndpoint) icon = evStationsIcon
    else icon = poiIcon

    const marker = L.marker([lat, lng], { icon }).bindPopup(
      `<strong>${item.poi?.name || 'EV Charging Station'}</strong><br>${
        item.poi?.categories?.join(', ') || ''
      }<br>${item.address?.freeformAddress || item.address?.streetName || ''}`
    )

    clusterGroup.addLayer(marker)
  })

  console.log(
    `Added ${dataArray.length} markers to ${
      isPizzaEndpoint
        ? 'Pizza'
        : isShopsEndpoint
          ? 'Shops'
          : isEVEndpoint
            ? 'EV Charging Stations'
            : 'Cafes'
    } layer`
  )
}
