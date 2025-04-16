coreInfo = L.easyButton(
  '<img src="images/info.png" style="width:16px">',
  function () {
    //document.getElementById("selCountry").style.visibility = "hidden";

    //set the title
    document.getElementById('coreInfoTitle').innerHTML =
      "<img src='images/info.png' alt='weather icon' width='35' height='35'>&nbsp;Background: " +
      window.country

    //set the content
    document.getElementById('coreInfoBody').innerHTML =
      "<table class='table table-hover table-striped table-md'" +
      "<tr><td><img src='images/capitol.png' width='35' height='35'>&nbsp;Capital</td><td class='right-align'>" +
      window.capital +
      '</td></tr>' +
      "<tr><td><img src='images/population.png' width='35' height='35'>&nbsp;Population</td><td class='right-align'>" +
      window.population +
      '</td></tr>' +
      "<tr><td><img src='images/continent.png' width='35' height='35'>&nbsp;Continent</td><td class='right-align'>" +
      window.continent +
      '</td></tr>' +
      "<tr><td><img src='images/timezone.png' width='35' height='35'>&nbsp;Timezone</td><td class='right-align'>" +
      window.timezoneName +
      ', ' +
      window.timezoneShortName +
      '</td></tr>' +
      "<tr><td><img src='images/currency.png' width='35' height='35'>&nbsp;Currency</td><td class='right-align'>" +
      window.currencyName +
      ' (' +
      window.currencySymbol +
      ')' +
      '</td></tr>' +
      "<tr><td><img src='images/currencySubunit.png' width='35' height='35'>&nbsp;Subunit</td><td class='right-align'>" +
      window.currencySubunit +
      '</td></tr>' +
      "<tr><td><img src='images/exchangeRate.png' width='35' height='35'>&nbsp;Current Exhange Rates</td><td class='right-align'>" +
      window.exchangeRate +
      '</td></tr>' +
      "<tr><td><img src='images/driveOn.png' width='35' height='35'>&nbsp;Drive on</td><td class='right-align'>" +
      window.driveOn +
      '</td></tr>' +
      "<tr><td><img src='images/speedIn.png' width='35' height='35'>&nbsp;Speed in</td><td class='right-align'>" +
      window.speedIn +
      '</td></tr>' +
      '</table>'

    //show the modal when clicked
    $('#coreInfoModal').modal('show')
  }
)

//style the buttons
coreInfo.button.style.width = '35px'
coreInfo.button.style.height = '35px'
