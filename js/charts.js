function drawChart(responseData) {
  var element  = responseData[0]["element"];
  var unit = responseData[0]["einheit"];
  var dataArray = getDataArray(responseData);

  addDiv(element + "_chart");

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

  var chart = new google.visualization.LineChart(document.getElementById(element + "_chart"));
  chart.draw(data, options);
}

function getDataArray(data) {
  var result = [];
  for(i = 0; i < data.length; i++) {
    var date = data[i]["date"];
    date = convertToDate(date);

    var value = data[i]["wert"];
    value = parseInt(value.replace(",", ".")); // @TODO parseDouble?

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
  chartsDiv.appendChild(div);
}
