function addDateValidation() {
  var start_date = document.getElementById("start_date");
  var end_date = document.getElementById("end_date");
  var today = new Date();

  start_date.value = makeDateString(calcDate(today, -366));
  end_date.value = makeDateString(today);

  end_date.onchange = function() {
    var startDate = new Date(start_date.value);
    var startDateTime = startDate.getTime();
    var endDate = new Date(end_date.value);
    var endDateTime = endDate.getTime();

    if (startDateTime > endDateTime) {
      end_date.value = makeDateString(startDate);
    }
  }

  start_date.onchange = function () {
    var startDate = new Date(start_date.value);
    var startDateTime = startDate.getTime();
    var endDate = new Date(end_date.value);
    var endDateTime = endDate.getTime();

    if (startDateTime > endDateTime) {
      start_date.value = makeDateString(endDate);
    }
  }
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

function checkDates(start_date, end_date) {
  var startDate = new Date(start_date.value);
  var startDateTime = startDate.getTime();
  var endDate = new Date(end_date.value);
  var endDateTime = endDate.getTime();

  if (startDateTime > endDateTime) {
    start_date.value = makeDateString(endDate);
    end_date.value = makeDateString(start_date);
  }
}

function addEnterEvent() {
  var form = document.getElementById("floating-panel");
  var location = document.getElementById("address");

  form.onkeypress = function(event) {
    if (event.keyCode == 13) {
        makeAjaxRequest();
        location.blur();
        return false;
    }
  }
}
