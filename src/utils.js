function toJSDate(dateTime) {
  var dateTime = dateTime.split(' ')
  var date = dateTime[0].split('-')
  var time = dateTime[1].split(':')
  //(year, month, day, hours, minutes, seconds, milliseconds)
  //month is 0 indexed so date[1] - 1 corrected format
  return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2], 0)
}

function formatDatetime(date) {
  //Date.parse() returns a Number, then use new Date() to parse it:
  var thedate = new Date(Date.parse(date))
  return thedate
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function secondsToHHMMSS(seconds) {
  return new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]
}

function roundNum2(num) {
  return (Math.round(num * 100) / 100).toFixed(2)
}

function roundNum1(num) {
  return (Math.round(num * 100) / 100).toFixed(1)
}

function convertKelvinToCelsius(num) {
  return roundNum1(num - 273.15)
}

function addDaysToCurrentDate(num) {
  var someDate = new Date()
  var numberOfDaysToAdd = num
  someDate.setDate(someDate.getDate() + numberOfDaysToAdd)

  //format to dd//mm/yy
  var dd = someDate.getDate()
  var mm = someDate.getMonth() + 1
  var y = someDate.getFullYear()

  var someFormattedDate = dd + '/' + mm + '/' + y
  return someFormattedDate
}
