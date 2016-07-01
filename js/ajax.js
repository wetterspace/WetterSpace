var currentResponse;

function addAjaxEvent() {
  document.getElementById("submit").onclick = function() {
    sendAjaxRequest("Relative Luftfeuchte");
    // Test
    console.log(currentResponse);
    // Test end
    handleResponse(currentResponse);
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
        //  console.log(request.responseText);
         currentResponse = request.responseText;
      }
    }
  }
}
