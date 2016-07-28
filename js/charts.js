var chartsDataTables = [];

function drawDashboard(responseData) {
  var element  = responseData[0]["element"];
  element = element.replace(/ae/g,"ä").replace(/oe/g,"ö").replace(/ue/g,"ü");

  var unit = responseData[0]["einheit"];
  var dataArray = getDataArray([responseData]);

  var dashboardId = createDashboardAndGetId(element);
  var elementChartId = element + "_chart";
  var elementSliderId = element + "_slider";

  chartsDataTables[element] = [];
  chartsDataTables[element] = [responseData];

  addDivForChart(elementChartId, dashboardId);
  addDivForSlider(elementSliderId, dashboardId);
  addDeleteDashboardButton(dashboardId);

  drawGoogleDashboard(dataArray, [unit], dashboardId, elementSliderId, elementChartId, element);
}

function drawGoogleDashboard(chartData, units, dashboardId, sliderId, chartId, title) {
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'X');
  for (var i = 0; i < units.length; i++) {
    data.addColumn("number", units[i]);
  }
  data.addRows(chartData);

  var dashboard = new google.visualization.Dashboard(document.getElementById(dashboardId));
  var dateSlider = new google.visualization.ControlWrapper({
            'controlType': 'ChartRangeFilter',
            'containerId': sliderId,
            'options': {
              "filterColumnIndex" : 0,
              "ui" : {
                "chartOptions" : {
                  "height" : 50,
                  "interpolateNulls" : true
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
                    "title": title,
                    "hAxis": {
                      "title": 'Datum'
                    },
                  }
                });
  dashboard.bind(dateSlider, lineChart);
  dashboard.draw(data);
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
    var loader = document.getElementById("loader");

    dashboardDiv.setAttribute("class","dashboardDivArea");
    dashboardDiv.setAttribute("id", dashboardId);
    chartsDiv.insertBefore(dashboardDiv, loader);
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
  var originData = chartsDataTables[originChartId.replace(/_chart/g, "")];
  var targetData = chartsDataTables[targetChartId.replace(/_chart/g, "")];

  var allResponseData = originData.concat(targetData);
  var targetBasicId = targetChartId.replace(/_chart/g, "");
  var newBasicId = (originChartId + " " + targetChartId).replace(/_chart/g, "");
  var dataArray = getDataArray(allResponseData);

  var targetChartElement = document.getElementById(targetChartId);
  var targetSliderElement = document.getElementById(targetBasicId + "_slider");
  var targetDashboardElement = targetChartElement.parentNode;

  uncheckButtons(targetBasicId);

  targetDashboardElement.setAttribute("id", newBasicId + "_dashboard");
  targetSliderElement.setAttribute("id", newBasicId + "_slider");
  targetChartElement.setAttribute("id", newBasicId + "_chart")

  var titleAndUnits = getTitleAndUnits(allResponseData);

  drawGoogleDashboard(dataArray, titleAndUnits.units, targetDashboardElement, newBasicId + "_slider", newBasicId + "_chart", titleAndUnits.title)

  //Creates new...or overwrite?
  chartsDataTables[newBasicId] = [];
  chartsDataTables[newBasicId] = allResponseData;
}

function getDataArray(data) {
  var result = [];
  var elements = [];
  var counter = 0;
  data = data.sort(sortOnArgLen);
  for (var i = 0; i < data.length; i++) {
    var currentDataset = data[i];
    if(elements.indexOf(currentDataset[0]["element"]) == -1) {
      elements.push(currentDataset[0]["element"]);
      for(x = 0; x < data[0].length; x++) {
        if(currentDataset[x]) {
          var value = currentDataset[x]["wert"];
          value = parseFloat(value.replace(",", "."));
        } else var value = null;

        if(counter == 0) {
          var date = currentDataset[x]["date"];
          date = convertToDate(date);

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

function sortOnArgLen(arg1,arg2) {
  if(arg1.length > arg2.length)
    return -1;
  if(arg1.length < arg2.length)
    return 1;
  if(arg1.length == arg2.length)
    return 0;
}

function uncheckButtons(id) {
  var element = document.getElementById(id + "_button");
  if(element != null) element.checked = false;
}

function addDeleteDashboardButton(dashboardId) {
  var dashboardDiv = document.getElementById(dashboardId);
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

function redrawOnResize() {
  var dashboards = document.getElementsByClassName("dashboardDivArea");
  if(dashboards.length > 0) {
    for (var i = 0; i < dashboards.length; i++) {
      var id = dashboards[i].id.replace(/_dashboard/g,"");
      var data = chartsDataTables[id]
      redrawDashboard(data, dashboards[i])
    }
  }
}

function redrawDashboard(data, dashboardElement) {
  var dashboardId = dashboardElement.id;
  dashboardChilds = dashboardElement.childNodes;

  var sliderId = "";
  var chartId = "";

  for (var i = 0; i < dashboardChilds.length; i++) {
    if(dashboardChilds[i].id.indexOf("slider") != -1) sliderId = dashboardChilds[i].id;
    else if (dashboardChilds[i].id.indexOf("chart") != -1) chartId = dashboardChilds[i].id;
  }

  var dataArray = getDataArray(data);
  var titleAndUnits = getTitleAndUnits(data);
  var title = titleAndUnits.title;

  drawGoogleDashboard(dataArray, titleAndUnits.units, dashboardElement, sliderId, chartId, titleAndUnits.title)
}

function getTitleAndUnits(data) {
  var unitElements = [];
  var units = []
  var title = "";

  for (var i = 0; i < data.length; i++) {
    if((unitElements.indexOf(data[i][0]["element"]) == -1)) {
      title += data[i][0]["element"] + " / ";
      unitElements.push(data[i][0]["element"]);
      units.push(data[i][0]["element"] + " in " + data[i][0]["einheit"]);
    }
  }

  return {title : title.substring(0, title.length - 2), units: units};
}
