function drawChart(responseData) {
  var element  = responseData[0]["element"];
  var unit = responseData[0]["einheit"];
  var dataArray = getDataArray(responseData);

  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  data.addColumn('number', unit);
  data.addRows(dataArray);

  var options = {
    "title": element,
    "hAxis": {
      "title": 'Zeit'
    },
    "vAxis": {
      "title": unit
    },
    "backgroundColor": '#f1f8e9'
  };

  var chart = new google.visualization.LineChart(document.getElementById('charts'));
  chart.draw(data, options);
}

function getDataArray(data) {
  var result = [];
  for(i = 0; i < data.length; i++) {
    var date = data[i]["date"];
    date = convertToDate(date);

    var value = data[i]["wert"];
    value = parseInt(value.replace(",", "."));

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
