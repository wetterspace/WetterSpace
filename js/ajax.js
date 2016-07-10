var currentStartDate;
var currentEndDate;
var currentLocation;

function addAjaxEvent() {
  document.getElementById("submit").onclick = function() {
    makeAjaxRequest();
  };
}

function makeAjaxRequest() {
  var location = document.getElementById("address").value;
  var start_date = document.getElementById("start_date").value;
  var end_date = document.getElementById("end_date").value;
  var elements;

  if(location != currentLocation) {
    elements = getRequestedElements();
    execAjaxForElements(elements, location, start_date, end_date);
  } else {
    // same location
    if(start_date != currentStartDate || end_date != currentEndDate) {
      elements = getRequestedElements();
      execAjaxForElements(elements, location, start_date, end_date);
    } else {
      // same location and same dates
      // check checkboxes
      elements = getNewRequestedElement();
      execAjaxForElements(elements, location, start_date, end_date);
    }
  }
  deleteNotUsedCharts();
  currentLocation = location;
  currentStartDate = start_date;
  currentEndDate = end_date;
}

function deleteNotUsedCharts(elements) {
  var chartsDiv = document.getElementById("charts");
  console.log(chartsDiv);
}

function execAjaxForElements(elements, location, start_date, end_date) {
  for (var i = 0; i < elements.length; i++) {
    sendAjaxRequest(elements[i], location, start_date, end_date);
  }
}

function sendAjaxRequest(element, location, start_date, end_date) {
  var request = new XMLHttpRequest();
  var url = "https://www.wetter.space/cgi-bin/jsonGenerator.cgi";

  var parameters = "location=" + location;
  parameters += "&start_date=" + start_date;
  parameters += "&end_date=" + end_date;
  if(element) parameters += "&element=" + element;

  request.open("POST", url, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send(parameters);

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      if (request.responseText) {
         console.log(request.responseText);
         handleResponse(request.responseText);
      }
    }
  }
}

function getRequestedElements() {
  var checkboxes = document.getElementsByClassName("metrics_checkbox");
  var requestElements = [];
  for (var i = 0; i < checkboxes.length; i++) {
    if(checkboxes[i].checked) requestElements.push(checkboxes[i].dataset.element);
  }
  return requestElements;
}

function getNewRequestedElement() {
  // only returns the elements for which no chart exists
  var checkboxes = document.getElementsByClassName("metrics_checkbox");
  var requestElements = [];
  for (var i = 0; i < checkboxes.length; i++) {
    var divID = document.getElementById(checkboxes[i].dataset.element + "_dashboard");
    if(checkboxes[i].checked && !divID) {
      requestElements.push(checkboxes[i].dataset.element);
    }
  }
  return requestElements;
}

function deleteNotUsedCharts() {
  var checkboxes = document.getElementsByClassName("metrics_checkbox");
  var chartsDiv = document.getElementById("charts");

  for (var i = 0; i < checkboxes.length; i++) {
    var dashboardDiv = document.getElementById(checkboxes[i].dataset.element + "_dashboard");
    if(!checkboxes[i].checked && dashboardDiv) {
      chartsDiv.removeChild(dashboardDiv);
    }
  }
}
