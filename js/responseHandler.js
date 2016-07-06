function handleResponse(input) {
  var response = JSON.parse(input);
  var location = document.getElementById("address");
  var start_date = document.getElementById("start_date");
  var end_date = document.getElementById("end_date");
  var errorbox = document.getElementById("errorbox");
  var errorStyle = "solid 3px red";

  resetErrors(location, start_date,end_date, errorbox);

  var key = Object.keys(response)[0]

  if(key == "errors") {
    //innerHTML problems with IE
    errorbox.style.display = "block";
    var errorHTML = "<ul style='list-style-type:disc'>";

    for(var property in response['errors']) {
      var errorMessage = response["errors"][property];
      errorHTML += "<li class='error_message'> " + errorMessage + " </li>";

      switch(property) {
        case "location":
          location.style.border = errorStyle;
          break;
        case "start_date":
          start_date.style.border = errorStyle;
          break;
        case "end_date":
          end_date.style.border = errorStyle;
          break;
        case "data":
          // no data for this time period
          end_date.style.border = errorStyle;
          start_date.style.border = errorStyle;
          break;
        default:
          location.style.border = errorStyle;
          start_date.style.border = errorStyle;
          end_date.style.border = errorStyle;
      }
    }

    errorHTML += "</ul>";

    errorbox.innerHTML = errorHTML;
  } else {
    drawDashboard(response);
  }
}

function resetErrors(location, start_date, end_date, errorbox) {
  location.style.border = "1px solid #ccc";
  start_date.style.border = "1px solid #ccc";
  end_date.style.border = "1px solid #ccc";
  errorbox.style.display = "none";
}
