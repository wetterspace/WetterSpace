function drawDashboard(responseData) {
  var element  = responseData[0]["element"];
  element = element.replace(/ae/g,"ä").replace(/oe/g,"ö").replace(/ue/g,"ü");

  var unit = responseData[0]["einheit"];
  var dataArray = getDataArray(responseData);

  var dashboardId = createDashboardAndGetId(element);
  var elementChartId = element + "_chart";
  var elementSliderId = element + "_slider";

  addDivForChart(elementChartId, dashboardId);
  addDivForSlider(elementSliderId, dashboardId);

  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  data.addColumn('number', unit);
  data.addRows(dataArray);

  // var options = {
  //   "title": element,
  //   "hAxis": {
  //     "title": 'Datum'
  //   },
  //   // "vAxis": {
  //   //   "title": unit
  //   // }
  // };
  var dashboard = new google.visualization.Dashboard(document.getElementById(dashboardId));
  var dateSlider = new google.visualization.ControlWrapper({
            'controlType': 'ChartRangeFilter',
            'containerId': elementSliderId,
            'options': {
              "filterColumnIndex" : 0
            }
          });
  var lineChart = new google.visualization.ChartWrapper({
                  'chartType': 'LineChart',
                  'containerId': elementChartId,
                  'options': {
                    "title": element,
                    "hAxis": {
                      "title": 'Datum'
                    },
                    // 'width': 300,
                    // 'height': 300,
                    // 'pieSliceText': 'value',
                    // 'legend': 'right'
                  }
                });
  dashboard.bind(dateSlider, lineChart);
  // var chart = new google.visualization.LineChart(document.getElementById(elementChartId));
  // chart.draw(data, options);
  dashboard.draw(data);
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

function createDashboardAndGetId(element) {
  var dashboardId = element + "_dashboard"

  var dashboardDiv = document.createElement("div");
  var chartsDiv = document.getElementById("charts");
  dashboardDiv.setAttribute("id", dashboardId);
  chartsDiv.appendChild(dashboardDiv);

  return dashboardId;
}

function addDivForChart(element, dashboardId) {
  var div = document.createElement("div");
  var dashboardDiv = document.getElementById(dashboardId);
  div.setAttribute("id", element);
  // div.setAttribute("draggable", "true");
  // div.setAttribute("ondragstart", "dragStart(event)");
  // div.setAttribute("ondrop", "dragDrop(event)");
  // div.setAttribute("ondragover", "allowDrop(event)");
  dashboardDiv.appendChild(div);
}

function addDivForSlider(element, dashboardId) {
  var div = document.createElement("div");
  var dashboardDiv = document.getElementById(dashboardId);
  div.setAttribute("id", element);
  dashboardDiv.appendChild(div);
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
