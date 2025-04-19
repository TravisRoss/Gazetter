/**
 * @file modules/layers.js - Contains functions and variables for managing map layers.
 */

import * as L from 'leaflet'
import 'leaflet.markercluster' // Import leaflet plugins

// FeatureGroups
export const earthquakeFeatureGroup = L.featureGroup()
export const wikiLinksFeatureGroup = L.featureGroup()
export const localWeatherFeatureGroup = L.featureGroup()
export const nearbyPoisFeatureGroup = L.featureGroup()
export const evStationsFeatureGroup = L.featureGroup()
export const nearbyPizzaFeatureGroup = L.featureGroup()
export const shopsFeatureGroup = L.featureGroup()

// LayerGroups
export const earthquakes = L.layerGroup([earthquakeFeatureGroup])
export const wikiLinks = L.layerGroup([wikiLinksFeatureGroup])
export const localWeather = L.layerGroup([localWeatherFeatureGroup])
export const nearbyPois = L.layerGroup([nearbyPoisFeatureGroup])
export const evChargingStations = L.layerGroup([evStationsFeatureGroup])
export const nearbyPizza = L.layerGroup([nearbyPizzaFeatureGroup])
export const nearbyShops = L.layerGroup([shopsFeatureGroup])

/**
 * Clears all marker layers from the map.
 */
export function clearMapLayers() {
  if (window.nearbyPizzaClusterGroup)
    window.nearbyPizzaClusterGroup.clearLayers()
  if (window.nearbyShopsClusterGroup)
    window.nearbyShopsClusterGroup.clearLayers()
  if (window.evStationsClusterGroup) window.evStationsClusterGroup.clearLayers()
  if (window.nearbyPoisFeatureGroup) window.nearbyPoisFeatureGroup.clearLayers()
  earthquakeFeatureGroup.clearLayers()
  wikiLinksFeatureGroup.clearLayers()
  localWeatherFeatureGroup.clearLayers()
  evStationsFeatureGroup.clearLayers()
  nearbyPizzaFeatureGroup.clearLayers()
  shopsFeatureGroup.clearLayers()
}
