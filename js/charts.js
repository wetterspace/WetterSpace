var chartsDataTables = [];

function drawDashboard(responseData) {
  var element  = responseData[0]["element"];
  element = element.replace(/ae/g,"ä").replace(/oe/g,"ö").replace(/ue/g,"ü");

  var unit = responseData[0]["einheit"];
  var dataArray = getDataArray(responseData);

  var dashboardId = createDashboardAndGetId(element);
  var elementChartId = element + "_chart";
  var elementSliderId = element + "_slider";

  chartsDataTables[elementChartId] = [];
  chartsDataTables[elementChartId] = [responseData];

  addDivForChart(elementChartId, dashboardId);
  addDivForSlider(elementSliderId, dashboardId);
  addDeleteChartButton(dashboardId);

  drawGoogleDashboard(dataArray, unit, dashboardId, elementSliderId, elementChartId, element);
}

function drawGoogleDashboard(chartData, unit, dashboardId, sliderId, chartId, element) {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  data.addColumn('number', unit);
  data.addRows(chartData);

  var dashboard = new google.visualization.Dashboard(document.getElementById(dashboardId));
  var dateSlider = new google.visualization.ControlWrapper({
            'controlType': 'ChartRangeFilter',
            'containerId': sliderId,
            'options': {
              "filterColumnIndex" : 0,
              "ui" : {
                "chartOptions" : {
                  "height" : 50
                }
              }
            }
          });
  var lineChart = new google.visualization.ChartWrapper({
                  'chartType': 'LineChart',
                  'containerId': chartId,
                  'options': {
                    "titleTextStyle": {
                      "fontSize": 18,
                    },
                    "title": element,
                    "hAxis": {
                      "title": 'Datum'
                    },
                  }
                });
  dashboard.bind(dateSlider, lineChart);
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

  if(!document.getElementById(dashboardId)) {
    var dashboardDiv = document.createElement("div");
    var chartsDiv = document.getElementById("charts");
    dashboardDiv.setAttribute("class","dashboardDivArea");
    dashboardDiv.setAttribute("id", dashboardId);
    chartsDiv.appendChild(dashboardDiv);
  }

  return dashboardId;
}

function addDivForChart(element, dashboardId) {
  if(!document.getElementById(element)) {
    var div = document.createElement("div");
    var dashboardDiv = document.getElementById(dashboardId);
    div.setAttribute("id", element);
    div.setAttribute("draggable", "true");
    div.setAttribute("ondragstart", "dragStart(event)");
    div.setAttribute("ondrop", "dragDrop(event)");
    div.setAttribute("ondragover", "allowDrop(event)");
    dashboardDiv.appendChild(div);
  }
}

function addDivForSlider(element, dashboardId) {
  if(!document.getElementById(element)) {
    var div = document.createElement("div");
    var dashboardDiv = document.getElementById(dashboardId);
    div.setAttribute("id", element);
    dashboardDiv.appendChild(div);
  }
}

function dragStart(e) {
  e.dataTransfer.effectAllowed='move';
  e.dataTransfer.setData("Text", e.target.getAttribute('id'));
}

function dragDrop(e) {
  var originChartId = e.dataTransfer.getData("Text");
  var targetChartId = e.currentTarget.getAttribute("id");
  createOverlayChart(originChartId, targetChartId);
}

function allowDrop(e) {
  e.preventDefault();
}

function createOverlayChart(originChartId, targetChartId) {
  var originData = chartsDataTables[originChartId];
  var targetData = chartsDataTables[targetChartId];
  var allResponseData = originData.concat(targetData);
  var targetBasicId = targetChartId.replace(/_chart/g, "").replace(/_overlay/g, "");
  var newBasicId = (originChartId + " " + targetChartId).replace(/_chart/g, "").replace(/_overlay/g, "");
  var dataArray = getOverlayDataArray(allResponseData);

  var targetChartElement = document.getElementById(targetChartId);
  var targetSliderElement = document.getElementById(targetBasicId + "_slider");
  if (targetSliderElement == null) {
    targetSliderElement = document.getElementById(targetBasicId + "_slider_overlay");
  }
  var targetDashboardElement = targetChartElement.parentNode;
  uncheckButtons(targetBasicId);

  targetDashboardElement.setAttribute("id", newBasicId + "_dashboard_overlay");
  targetSliderElement.setAttribute("id", newBasicId + "_slider_overlay");
  targetChartElement.setAttribute("id", newBasicId + "_chart_overlay")

  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  var counter = 0;
  var unitElements = [];
  var title = "";
  for (var i = 0; i < allResponseData.length; i++) {
    if((unitElements.indexOf(allResponseData[i][0]["element"]) == -1)) {
      title += allResponseData[i][0]["element"] + " / ";
      unitElements.push(allResponseData[i][0]["element"]);
      data.addColumn("number", allResponseData[i][0]["element"] + " in " + allResponseData[i][0]["einheit"]);
      counter++;
    }
  }
  data.addRows(dataArray);

  var dashboard = new google.visualization.Dashboard(targetDashboardElement);
  var dateSlider = new google.visualization.ControlWrapper({
            'controlType': 'ChartRangeFilter',
            'containerId': newBasicId + "_slider_overlay",
            'options': {
              "filterColumnIndex" : 0,
              "ui" : {
                "chartOptions" : {
                  "height" : 50
                }
              }
            }
          });
  var lineChart = new google.visualization.ChartWrapper({
                  'chartType': 'LineChart',
                  'containerId': newBasicId + "_chart_overlay",
                  'options': {
                    "titleTextStyle": {
                      "fontSize": 18,
                    },
                    "title": title.substring(0, title.length - 2),
                    "hAxis": {
                      "title": 'Datum'
                    },
                  }
                });
  dashboard.bind(dateSlider, lineChart);
  dashboard.draw(data);

  //Creates new...or overwrite?
  chartsDataTables[newBasicId + "_chart_overlay"] = [];
  chartsDataTables[newBasicId + "_chart_overlay"] = allResponseData;
}

function getOverlayDataArray(data) {
  var result = [];
  var elements = [];
  var counter = 0;
  for (var i = 0; i < data.length; i++) {
    var currentDataset = data[i];
    if(elements.indexOf(currentDataset[0]["element"]) == -1) {
      elements.push(currentDataset[0]["element"]);
      for(x = 0; x < data[i].length; x++) {

        var date = currentDataset[x]["date"];
        date = convertToDate(date);

        var value = currentDataset[x]["wert"];
        value = parseFloat(value.replace(",", "."));

        if(counter == 0) {
          result[x] = [];
          result[x][0] = date;
          result[x][1] = value;
        } else {
          result[x][counter + 1] = value;
        }
      }
      counter++;
    }
  }

  return result;
}

function uncheckButtons(id) {
  var element = document.getElementById(id + "_button");
  if(element != null) element.checked = false;
}

function addDeleteChartButton(dashboardId) {
  var dashboardDiv = document.getElementById(dashboardId);
  var buttonExists = false

  for (var i = 0; i < dashboardDiv.childNodes.length; i++) {
    // console.log(dashboardDiv.childNodes[i])
    if (dashboardDiv.childNodes[i].type == "button") {
      buttonExists = true;
    }
  }

  if(!buttonExists) {
    var button = document.createElement("button");
    var text = document.createTextNode("Lösche Diagramm");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-xs btn-primary deleteButton");
    button.appendChild(text);

    dashboardDiv.appendChild(button);

    button.onclick = function() {
      var dashboardParent = dashboardDiv.parentNode;
      dashboardParent.removeChild(dashboardDiv);
    }
  }
}

function redrawOnResize() {
  console.log("redraw")
  var dashboards = document.getElementById("charts").childNodes
  if(dashboards.length > 0) {
    console.log(dashboards);
    for (var i = 0; i < dashboards.length; i++) {
      if(dashboards[i].nodeName == "DIV") {
        drawDashboard(chartsDataTables[dashboards[i].id.replace(/_dashboard/g,"_chart")][0])
      }
    }
  }
}
