//news modal
news = L.easyButton(
  "<img src='images/news.png' style='width:16px'>",
  function () {
    //set the title
    document.getElementById('newsTitle').innerHTML =
      "<img src='images/news.png' alt='news icon' width='35' height='35'>&nbsp;Top Headlines: " +
      window.country

    //set the content
    document.getElementById('newsBody').innerHTML = newsData

    //if the news response is valid ie if there is news tobe displayed, display it.
    if (newsData) {
      $('#newsModal').modal('show')
    } else {
      //otherwise show a message to say "news unavailable".
      document.getElementById('noNewsDiv').style.visibility = 'visible'
    }
  }
)

news.button.style.width = '35px'
news.button.style.height = '35px'
