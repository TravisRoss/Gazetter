//travel modal
travelInfo = L.easyButton(
  "<img src='images/travel.png' style='width:16px'>",
  function () {
    //set the title
    document.getElementById('travelTitle').innerHTML =
      "<img src='images/travel.png' alt='travel icon' width='35' height='35'>&nbsp;Travel Advice: " +
      window.country

    //set the content
    document.getElementById('travelBody').innerHTML = travelInfoData

    if (travelInfoData) {
      $('#travelModal').modal('show')
    }
  }
)

travelInfo.button.style.width = '35px'
travelInfo.button.style.height = '35px'
