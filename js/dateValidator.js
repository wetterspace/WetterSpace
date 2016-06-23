window.onload = function() {
  var start_date = document.getElementById("start_date");
  var end_date = document.getElementById("end_date");
  var today = new Date();

  start_date.value = makeDateString(calcDate(today, -10));
  end_date.value = makeDateString(today);


  start_date.setAttribute("max", end_date.value);

  end_date.onchange = function() {
    setDateMax(start_date, end_date);
  }
}

function setDateMax(start_date, end_date) {
  start_date.setAttribute("max", end_date.value);
}

function makeDateString(date) {
  var year  = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  if(month < 10) month = "0" + month;
  if(day < 10) day = "0" + day;

  var dateString = year + "-" + month + "-" + day;

  return dateString;
}

function calcDate(date, days) {
  var milliseconds = date.getTime();
  var daysInMilliseconds = milliseconds + (days * 24 * 60 * 60 * 1000);

  var newDate = new Date();
  newDate.setTime(daysInMilliseconds);
  return newDate;
}
