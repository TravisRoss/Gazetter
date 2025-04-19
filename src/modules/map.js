/**
 * @file modules/map.js - Contains functions for managing the Leaflet map.
 */

import $ from 'jquery'
import * as L from 'leaflet'

/**
 * Creates a custom button for displaying core information on the map.
 * @returns {L.Control.EasyButton} - A Leaflet EasyButton control.
 */
export function createCoreInfoButton() {
  return L.easyButton(
    '<img src="images/info.png" style="width:16px">',
    function () {
      $('#nationalModal').modal('show')
    },
    'Core Info'
  )
}

/**
 * Updates the map with the border of the selected country.
 * @param {object} borderResponse - The response object containing the border data.
 */
export function updateMapWithBorder(borderResponse) {
  if (!borderResponse?.data?.geometry) {
    console.error('Invalid border response:', borderResponse)
    return
  }

  if (window.border) {
    window.map.removeLayer(window.border)
  }

  window.border = L.geoJSON(borderResponse.data, {
    style: {
      color: 'red',
      weight: 3,
      opacity: 0.5,
    },
  }).addTo(window.map)

  window.map.fitBounds(window.border.getBounds())
}
