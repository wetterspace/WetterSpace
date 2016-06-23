function handleResponse(input) {
  // var response = JSON.parse()

  var location = document.getElementById("address");
  var start_date = document.getElementById("start_date");
  var end_date = document.getElementById("end_date");
  var errorbox = document.getElementById("errorbox");

  if(input == "no valid zip code") {
    errorbox.style.display = "block";
    errorbox.innerHTML = "<ul style='list-style-type:disc'><li class='error_message'> " + input + " </li></ul>";
    location.style.border = "solid 3px red";
  } else if(input == "data") {

  } else {
    //innerHTML problems with IE
    errorbox.style.display = "block";
    errorbox.innerHTML = "<ul style='list-style-type:disc'><li class='error_message'> " + input + " </li></ul>";
    location.style.border = "solid 3px red";
    start_date.style.border = "solid 3px red";
    end_date.style.border = "solid 3px red";
  }
}
