/**
 * @file modules/weather.js - Contains functions for handling weather data and the weather modal.
 */

import $ from 'jquery'
import * as L from 'leaflet'

/**
 * Fetches weather data for the specified capital city.
 * @param {string} capital - The name of the capital city.
 * @returns {Promise} - A promise that resolves with the weather data or rejects with an error.
 */
export async function fetchWeatherDataForCapital(capital) {
  if (!capital) {
    console.error('No capital provided')
    return null
  }

  const apiKey = '2e82f88f32f54945bff130304251804'
  const weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${capital}&days=3`

  try {
    const response = await fetch(weatherApiUrl)
    const weatherData = await response.json()
    console.log('Weather Data for Capital:', weatherData)
    return weatherData
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return null
  }
}

/**
 * Shows the weather modal with the provided weather data.
 * @param {object} weatherData - The weather data to display in the modal.
 */
export function showWeatherModal(weatherData) {
  if (!weatherData) {
    alert('Weather data is not available.')
    return
  }
  const weatherModalTitle = document.getElementById('nationalWeatherTitle')
  const weatherModalBody = document.getElementById('nationalWeatherBody')

  weatherModalTitle.innerHTML =
    "<img src='images/weather.png' alt='weather icon' width='35' height='35'>&nbsp;Weather Forecast"

  const forecast = weatherData.forecast.forecastday
    .map((day) => {
      return `
      <tr>
        <td>${day.date}</td>
        <td>${day.day.condition.text}</td>
        <td>${day.day.avgtemp_c}°C</td>
        <td>${day.day.maxwind_kph} km/h</td>
        <td>${day.day.avghumidity}%</td>
      </tr>
    `
    })
    .join('')

  weatherModalBody.innerHTML = `
    <table class='table table-hover table-striped'>
      <thead>
        <tr>
          <th>Date</th>
          <th>Condition</th>
          <th>Avg Temp (°C)</th>
          <th>Max Wind (km/h)</th>
          <th>Humidity (%)</th>
        </tr>
      </thead>
      <tbody>
        ${forecast}
      </tbody>
    </table>
  `

  $('#nationalWeatherModal').modal('show')
}

/**
 * Creates a button for displaying weather information.
 * @returns {L.Control.EasyButton} - A Leaflet EasyButton control.
 */
export function createWeatherButton() {
  const weatherButton = L.easyButton(
    "<img src='images/weather.png' style='width:16px'>",
    function () {
      showWeatherModal(window.storedWeatherData)
    }
  )

  weatherButton.button.style.width = '35px'
  weatherButton.button.style.height = '35px'
  window.map.addControl(weatherButton)
  return weatherButton
}
