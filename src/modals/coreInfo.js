import { getCurrentCoreInfo } from './coreInfoButton.js'

export function createCoreInfoButton() {
  const coreInfo = L.easyButton(
    '<img src="images/info.png" style="width:16px">',
    function () {
      const {
        country,
        capital,
        population,
        continent,
        timezoneName,
        timezoneShortName,
        currencyName,
        currencySymbol,
        currencySubunit,
        exchangeRate,
        driveOn,
        speedIn,
      } = getCurrentCoreInfo()

      if (!country) {
        alert('No country data available yet.')
        return
      }

      document.getElementById('coreInfoTitle').innerHTML =
        "<img src='images/info.png' alt='info icon' width='35' height='35'>&nbsp;Background: " +
        country

      document.getElementById('coreInfoBody').innerHTML =
        "<table class='table table-hover table-striped table-md'>" +
        `<tr><td><img src='images/capitol.png' width='35' height='35'>&nbsp;Capital</td><td class='right-align'>${capital}</td></tr>` +
        `<tr><td><img src='images/population.png' width='35' height='35'>&nbsp;Population</td><td class='right-align'>${population}</td></tr>` +
        `<tr><td><img src='images/continent.png' width='35' height='35'>&nbsp;Continent</td><td class='right-align'>${continent}</td></tr>` +
        `<tr><td><img src='images/timezone.png' width='35' height='35'>&nbsp;Timezone</td><td class='right-align'>${timezoneName}, ${timezoneShortName}</td></tr>` +
        `<tr><td><img src='images/currency.png' width='35' height='35'>&nbsp;Currency</td><td class='right-align'>${currencyName} (${currencySymbol})</td></tr>` +
        `<tr><td><img src='images/currencySubunit.png' width='35' height='35'>&nbsp;Subunit</td><td class='right-align'>${currencySubunit}</td></tr>` +
        `<tr><td><img src='images/exchangeRate.png' width='35' height='35'>&nbsp;Current Exchange Rates</td><td class='right-align'>${exchangeRate}</td></tr>` +
        `<tr><td><img src='images/driveOn.png' width='35' height='35'>&nbsp;Drive on</td><td class='right-align'>${driveOn}</td></tr>` +
        `<tr><td><img src='images/speedIn.png' width='35' height='35'>&nbsp;Speed in</td><td class='right-align'>${speedIn}</td></tr>` +
        '</table>'

      $('#coreInfoModal').modal('show')
    }
  )

  coreInfo.button.style.width = '35px'
  coreInfo.button.style.height = '35px'

  return coreInfo
}
