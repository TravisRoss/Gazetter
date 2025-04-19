/**
 * @file modules/data.js - Contains functions for handling geographical and Wikipedia data.
 */

import $ from 'jquery'
import * as L from 'leaflet'

/**
 * Handles the retrieval and display of geographical data for a given country.
 * @param {string} isoCode - The ISO code of the country.
 */
export async function handleGeoData(isoCode) {
  // Implementation for fetching and processing geographical data
  // Example: Fetch earthquake data and display it on the map
  // You will need to implement the logic to fetch and display the data
  console.log('Handling geo data for', isoCode)
}

/**
 * Handles the retrieval and display of Wikipedia links for a given country.
 */
export async function handleWikiLinks() {
  // Implementation for fetching and processing Wikipedia links
  // Example: Fetch Wikipedia links and display them on the map
  // You will need to implement the logic to fetch and display the data
  console.log('Handling Wikipedia links')
}

/**
 * Sets the current core information for the selected country and updates the modal.
 * @param {object} data - The core information data for the selected country.
 */
export function setCurrentCoreInfo(data) {
  coreInfo = data
  $('#nationalTitle').html(
    "<img src='images/info.png' alt='info icon' width='35' height='35'>&nbsp;" +
      data.name
  )
  $('#nationalCapital').html(
    "<img src='images/ruler.png' alt='ruler icon' width='35' height='35'>&nbsp;" +
      data.capital +
      ' (' +
      data.location.lat +
      ', ' +
      data.location.lng +
      ')'
  )
  $('#nationalCurrency').html(
    "<img src='images/currency.png' alt='currency icon' width='35' height='35'>&nbsp;" +
      data.currencyCode +
      ' (' +
      data.currencyName +
      ')'
  )
  $('#nationalLanguage').html(
    "<img src='images/language.png' alt='language icon' width='35' height='35'>&nbsp;" +
      data.languageCode +
      ' (' +
      data.languageName +
      ')'
  )
  $('#nationalPopulation').html(
    "<img src='images/population.png' alt='population icon' width='35' height='35'>&nbsp;" +
      data.population
  )
}
