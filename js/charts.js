function drawChart(responseData) {
  var element  = responseData[0]["element"];
  element = element.replace(/ae/g,"ä").replace(/oe/g,"ö").replace(/ue/g,"ü");
  var unit = responseData[0]["einheit"];
  var dataArray = getDataArray(responseData);
  var elementDivId = element + "_chart";

  addDiv(elementDivId);

  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  data.addColumn('number', unit);
  data.addRows(dataArray);

  var options = {
    "title": element,
    "hAxis": {
      "title": 'Datum'
    },
    // "vAxis": {
    //   "title": unit
    // }
  };

  var chart = new google.visualization.LineChart(document.getElementById(elementDivId));
  chart.draw(data, options);
}

function getDataArray(data) {
  var result = [];
  for(i = 0; i < data.length; i++) {
    var date = data[i]["date"];
    date = convertToDate(date);

    var value = data[i]["wert"];
    value = parseFloat(value.replace(",", "."));

    result[i] = [];
    result[i][0] = date;
    result[i][1] = value;
  }
  return result;
}

function convertToDate(dateString) {
  var date = dateString.split("-");
  var year = date[0];
  var month = date[1];
  var day = date[2];

  return new Date(year, month, day);
}

function addDiv(element) {
  var div = document.createElement("div");
  var chartsDiv = document.getElementById("charts");
  div.setAttribute("id", element);
  div.setAttribute("draggable", "true");
  div.setAttribute("ondragstart", "dragStart(event)");
  div.setAttribute("ondrop", "dragDrop(event)");
  // div.setAttribute("class", "col-md-9 chartwetter"); Change this!
  div.setAttribute("ondragover", "allowDrop(event)")
  chartsDiv.appendChild(div);
}

function dragStart(e) {
  e.dataTransfer.effectAllowed='move';
  e.dataTransfer.setData("Text", e.target.getAttribute('id'));
}

function dragDrop(e) {
  var draggedItemId = e.dataTransfer.getData("Text");
  console.log(draggedItemId);
  console.log(e.currentTarget.getAttribute("id"));
  // alert(e.currentTarget.getAttribute("id"));
}

function allowDrop(e) {
  e.preventDefault();
}