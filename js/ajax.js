var currentResponse;

function addAjaxEvent() {
  document.getElementById("submit").onclick = function() {
    var elements = getRequestedElements()

    for (var i = 0; i < elements.length; i++) {

      sendAjaxRequest(elements[i]);
    }
    // sendAjaxRequest("Lufttemperatur Tagesmittel");

  };
}

function sendAjaxRequest(element) {
  var request = new XMLHttpRequest();
  var url = "https://www.wetter.space/cgi-bin/jsonGenerator.cgi";

  var location = $("#address").val();
  var start_date = $("#start_date").val();
  var end_date = $("#end_date").val();
  // var element = ;

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
