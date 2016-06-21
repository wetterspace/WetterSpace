  google.load('visualization', '1', { packages: ['controls', 'corechart'] });
  google.setOnLoadCallback(createTables);
  // window.onresize = function(){ createTables(); }
  // google.charts.load('current', {'packages':['controls']});

  // Set a callback to run when the Google Visualization API is loaded.
  //google.charts.setOnLoadCallback(drawDashboard);

  var myDashboard;
  var fileName="Lufttemperatur_Tagesmaximum";
  var requestedDate = "2012";
  var titleName = "Lufttemperatur Höchstwert";
// Define the containers for the charts

var v_line_div = "line_div1";
var v_control_div = "control_div1";
var v_table_div = "table_div1";
var v_dashboard_div = "#dashboard_div1";
var v_chartTitle_div = "#chartTitle1";
var chartNum = 1;



  // $("#Lufttemperatur_Tagesmaximum").click(function() {
  //   // alert("id="+$(this).attr("id"));
  //   if ($('label').is('.active'))
  //     { alert("remove")}
  //   else {
  //     alert("draw")
  //   } 
  // })

  $("label.weatherMetric").click(function(){
    // alert($(this).parent();
    fileName = $( this ).attr('id');
    // alert("id="+$(this).attr("id"));
    titleName = $(this).text();
    switch (fileName) {
      case "Lufttemperatur_Tagesmaximum":
      v_line_div = "line_div1";
      v_control_div = "control_div1";
      v_table_div = "table_div1";
      v_dashboard_div = "#dashboard_div1";
      v_chartTitle_div = "#chartTitle1";
      break;
      case "Lufttemperatur_Tagesminimum":
      v_line_div = "line_div2";
      v_control_div = "control_div2";
      v_table_div = "table_div2";
      v_dashboard_div = "#dashboard_div2";
      v_chartTitle_div = "#chartTitle2";
      break;
      case "Lufttemperatur_Tagesmittel":
      v_line_div = "line_div3";
      v_control_div = "control_div3";
      v_table_div = "table_div3";
      v_dashboard_div = "#dashboard_div3";
      v_chartTitle_div = "#chartTitle3";
      break;
      case "Neuschneehoehe":
      v_line_div = "line_div4";
      v_control_div = "control_div4";
      v_table_div = "table_div4";
      v_dashboard_div = "#dashboard_div4";
      v_chartTitle_div = "#chartTitle4";
      break;
      case "Niederschlagshoehe":
      v_line_div = "line_div5";
      v_control_div = "control_div5";
      v_table_div = "table_div5";
      v_dashboard_div = "#dashboard_div5";
      v_chartTitle_div = "#chartTitle5";
      break;
      case "Relative_Luftfeuchte":
      v_line_div = "line_div6";
      v_control_div = "control_div6";
      v_table_div = "table_div6";
      v_dashboard_div = "#dashboard_div6";
      v_chartTitle_div = "#chartTitle6";
      break;
      case "Schneehoehe":
      v_line_div = "line_div7";
      v_control_div = "control_div7";
      v_table_div = "table_div7";
      v_dashboard_div = "#dashboard_div7";
      v_chartTitle_div = "#chartTitle7";
      break;


    }



    var numItems = $('.dashboardDivArea').length;
    // alert("dashboardDivArea items = "+numItems);

    if ($(this).is('.active')) {
      // alert("hide");
      $(v_dashboard_div).hide();

    }

    else {
      // alert("show");
      $(v_dashboard_div).show();
    }
    // alert(fileName);
    createTables();
  });

  $("button.currentYear").click(function(){
    // requestedDate = $( this ).attr('id');
    // alert(fileName);
    requestedDate = $( this ).html();

    createTables();
  });
  
  function createTables() {
      // Create the dataset (DataTable)
      var myData = new google.visualization.DataTable();

      myData.addColumn('date', 'Date');
      myData.addColumn('number', String(titleName));
      // Get data from JSON
      var fileURL = "/json_data/"+fileName+".json";
      $.getJSON(fileURL, function(jsonObject) {
        $.each(jsonObject[fileName].data, function(key, valData) {
          $(v_chartTitle_div).text(titleName + " (" + jsonObject[fileName].unit + ")");
          $.each(valData, function(dateVal, temperatureVal) {
            // console.log("date:",dateVal);
            temperatureVal = parseInt(temperatureVal.replace(",", "."));
            if (dateVal.substr(0, 4) == requestedDate) {
              myData.addRows([
                [new Date(dateVal), Number(temperatureVal)],
                ]);
            }
          });
        });
      });

      //End JSON data
      // Create a dashboard.
      var dash_container = document.getElementById('dashboard_div1'),
      myDashboard = new google.visualization.Dashboard(dash_container);

      var startDate = "-05-1";
      var endDate = "-07-1";
      // Create a date range slider
      var myDateSlider = new google.visualization.ControlWrapper({
        'controlType': 'ChartRangeFilter',
        'containerId': v_control_div,
        'options': {
          'ui': {
            'chartOptions': {
              'enableInteractivity': true,
              'chartArea': { 'height': '100%' },
              'legend': { 'position': 'none' },
              'colors': ['#e7785a', '#7eb7c1'],
                      'curveType': 'function', // 'none' or 'function'
                      'hAxis': {
                        'textPosition': 'in',
                        'gridlines': { 'color': '#fff' }
                      },
                      'vAxis': {
                        baselineColor: 'none',
                        'textPosition': 'none',
                        'gridlines': { 'color': '#fff' }
                      }
                    }
                  },
                  'filterColumnLabel': 'Date',
                  'backgroundColor': 'none'
                },
                'state': {
                  'range': {
                    'start': new Date(requestedDate.concat(startDate)),
                    'end': new Date(requestedDate.concat(endDate))
                  }
                }
              });

      // Table visualization
      var myTable = new google.visualization.ChartWrapper({
        'chartType': 'Table',
        'containerId': v_table_div

      });




      // Bind myTable to the dashboard, and to the controls
      // this will make sure our table is update when our date changes
      myDashboard.bind(myDateSlider, myTable);

      // Line chart visualization
      var myLine = new google.visualization.ChartWrapper({
        chartType: 'LineChart',
        containerId: v_line_div,
        backgroundColor: "#ffffff",

        options: {
          pointSize: 4,
          crosshair: { trigger: 'both', orientation: 'vertical' },
          backgroundColor: 'none',
          tooltip: { isHtml: true },
          lineWidth: '3',
          colors: ['#e7785a', '#7eb7c1'],
              curveType: 'function', // 'none' or 'function'

              legend: {
                position: 'top',
                alignment: 'end'
              },
              hAxis: {
                format: 'd MMM',
                gridlines: {
                  color: '#fff',
                  count: 5
                },
                textStyle: {
                  color: '#ccc',
                  fontName: '',
                  fontSize: '11',
                  bold: false,
                  italic: false
                }
              },
              vAxis: {
                baselineColor: '#ddd',
                gridlines: {
                  color: '#ddd',
                  count: 5
                },
                textStyle: {
                  color: '#ccc',
                  fontName: '',
                  fontSize: '11',
                  bold: false,
                  italic: false
                }
              },
              animation: {
                duration: 500,
                easing: 'inAndOut',
                  // startup: true

                }
              }
            });

      // Bind myLine to the dashboard, and to the controls
      // this will make sure our line chart is update when our date changes
      myDashboard.bind(myDateSlider, myLine);

      myDashboard.draw(myData);
    }
