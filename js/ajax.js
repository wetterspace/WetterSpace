var currentStartDate;
var currentEndDate;
var currentLocation;
var numberOfAjaxRequests = 0;

function addAjaxEvent() {
  var submitButtons = document.getElementsByClassName("submit");
  for (var i = 0; i < submitButtons.length; i++) {
    submitButtons[i].onclick = function() {
      makeAjaxRequest();
    };
  }
}

function makeAjaxRequest() {
  var location = document.getElementById("address").value;
  var start_date = document.getElementById("start_date").value;
  var end_date = document.getElementById("end_date").value;
  var elements = getRequestedElements();

  if(start_date == "") {
    handleResponse(JSON.stringify({"errors":{"start_date":"Kein gültiges Start-Datum"}}));
  } else if(end_date == "") {
    handleResponse(JSON.stringify({"errors":{"end_date":"Kein gültiges Start-Datum"}}));
  } else if(location != currentLocation || start_date != currentStartDate || end_date != currentEndDate) {
    // Changed seach parameters. all charts have to be redrawn
    // delete all dashboards and get all checked elements
    deleteAllDashboards();
    elements = getRequestedElements();
    if(elements.length > 0) {
      execAjaxForElements(elements, location, start_date, end_date);
    }
    // update stored search parameters
    currentLocation = location;
    currentStartDate = start_date;
    currentEndDate = end_date;
  } else if(elements.length > 0) {
    // Same search parameters but there are new elements checked
    execAjaxForElements(elements, location, start_date, end_date);
  } else {
    // no new elements no changed search parameters. just check if element is checked off
    deleteNotUsedDashboards();
  }
}

function deleteAllDashboards() {
  var dashboards = document.getElementsByClassName("dashboardDivArea");
  for (var i = dashboards.length -1; i >= 0; i--) {
    dashboards[i].parentNode.removeChild(dashboards[i]);
  }
}

function execAjaxForElements(elements, location, start_date, end_date) {
  unhideLoader();

  if(isNaN(location)) {
    // if the location is not a number we use the geocoder to get the lat and lang of the city name
    geocoder.geocode({ 'address': location, componentRestrictions: {country: 'DE'}}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if(results[0].partial_match == null) {
          // first result is the best result, google returns more locations and turn the partial_match boolean true
          var lat = results[0].geometry.location.lat();
          var lng = results[0].geometry.location.lng();
          var latlng = {"lat": lat, "lng": lng};

          for (var i = 0; i < elements.length; i++) {
            numberOfAjaxRequests++;
            // Ajax request using geodata instead of zipcode
            sendAjaxRequest(elements[i], latlng, start_date, end_date);
          }
        } else {
          // one single request to make sure that this location results in an error
          numberOfAjaxRequests++;
          sendAjaxRequest(elements[0], location, start_date, end_date);
        }
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  } else {
    // location is a number, probably a zip code
    for (var i = 0; i < elements.length; i++) {
      numberOfAjaxRequests++;
      sendAjaxRequest(elements[i], location, start_date, end_date);
    }
  };
}

function unhideLoader() {
  var loader = document.getElementById("loader");
  loader.style.display = "block";
}

function hideLoader() {
  numberOfAjaxRequests--;
  if(numberOfAjaxRequests == 0) {
    var loader = document.getElementById("loader");
    loader.style.display = "none";
  }
}

function sendAjaxRequest(element, location, start_date, end_date) {
  var request = new XMLHttpRequest();
  var url = "https://www.wetter.space/cgi-bin/jsonGenerator.cgi";

  var parameters = "";
  if(typeof location === "object") {
    parameters += "lat=" + location.lat;
    parameters += "&long=" + location.lng;
  } else {
    parameters += "location=" + location;
  }
  parameters += "&start_date=" + start_date;
  parameters += "&end_date=" + end_date;
  parameters += "&element=" + element;

  url = url + "?"+ parameters;

  console.log(url);

  request.open("GET", url, true);
  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  request.send();

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == 200) {
      if (request.responseText) {
        //  console.log(request.responseText);
         handleResponse(request.responseText);
      }
    }
  }
}

function getRequestedElements() {
  // only returns the elements for which no chart exists
  var checkboxes = document.getElementsByClassName("metrics_checkbox");
  var requestElements = [];
  for (var i = 0; i < checkboxes.length; i++) {
    var dashboardID = document.getElementById(checkboxes[i].dataset.element + "_dashboard");
    if(checkboxes[i].checked && dashboardID == null) {
      requestElements.push(checkboxes[i].dataset.element);
    }
  }
  return requestElements;
}

function deleteNotUsedDashboards() {
  var checkboxes = document.getElementsByClassName("metrics_checkbox");
  var chartsDiv = document.getElementById("charts");

  for (var i = 0; i < checkboxes.length; i++) {
    var dashboardDiv = document.getElementById(checkboxes[i].dataset.element + "_dashboard");
    if(!checkboxes[i].checked && dashboardDiv) {
      chartsDiv.removeChild(dashboardDiv);
    }
  }
}
