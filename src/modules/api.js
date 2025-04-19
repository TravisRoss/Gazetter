/**
 * @file modules/api.js - Contains functions for making API requests.
 */

import $ from 'jquery'

/**
 * Makes an AJAX call to the specified URL with the given data.
 * @param {string} url - The URL to make the AJAX call to.
 * @param {object} data - The data to send with the AJAX call.
 * @returns {Promise} - A promise that resolves with the response data or rejects with an error.
 */
export function makeAjaxCall(url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      data: data,
      success: function (response) {
        if (response.status.name === 'ok') {
          resolve(response)
        } else {
          reject(new Error(`API error: ${response.status.name}`))
        }
      },
      error: function (errorThrown) {
        reject(errorThrown)
      },
    })
  })
}

/**
 * Fetches the country code based on the given latitude and longitude.
 * @param {number} latitude - The latitude of the location.
 * @param {number} longitude - The longitude of the location.
 * @returns {Promise} - A promise that resolves with the country code or rejects with an error.
 */
export function fetchCountryCode(latitude, longitude) {
  const url = 'PHP/getCountryCode.php'
  const data = { lat: latitude, lng: longitude }
  return makeAjaxCall(url, data)
}
