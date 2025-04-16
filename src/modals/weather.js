//weather modal
weather = L.easyButton(
  "<img src='images/weather.png' style='width:16px'>",
  function () {
    //set the title
    document.getElementById('nationalWeatherTitle').innerHTML =
      "<img src='images/weather.png' alt='weather icon' width='35' height='35'>&nbsp;Forecast: " +
      window.country

    //set the content
    document.getElementById('nationalWeatherBody').innerHTML = weatherData

    $('#nationalWeatherModal').modal('show')
  }
)

weather.button.style.width = '35px'
weather.button.style.height = '35px'
