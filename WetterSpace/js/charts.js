  google.load('visualization', '1', { packages: ['controls', 'corechart'] });

  google.setOnLoadCallback(createTables);
  // window.onresize = function(){ createTables(); }
  // google.charts.load('current', {'packages':['controls']});

  // Set a callback to run when the Google Visualization API is loaded.
  //google.charts.setOnLoadCallback(drawDashboard);

  var myDashboard;
  var fileName="Lufttemperatur_Tagesmaximum";
  var requestedDate = "2014";
  var titleName = "Lufttemperatur Höchstwert";

  $("button.weatherMetric").click(function(){
    fileName = $( this ).attr('id');
    // alert(fileName);
    createTables();
  });

    $("button.weatherMetric").click(function(){
    titleName = $( this ).html();
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
          $("#chartTitle").text(titleName + " (" + jsonObject[fileName].unit + ")");
          $.each(valData, function(dateVal, temperatureVal) {
            console.log("date:",dateVal);
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
      var dash_container = document.getElementById('dashboard_div'),
      myDashboard = new google.visualization.Dashboard(dash_container);

      var startDate = "-05-1";
      var endDate = "-07-1";
      // Create a date range slider
      var myDateSlider = new google.visualization.ControlWrapper({
        'controlType': 'ChartRangeFilter',
        'containerId': 'control_div',
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
        'containerId': 'table_div'

      });




      // Bind myTable to the dashboard, and to the controls
      // this will make sure our table is update when our date changes
      myDashboard.bind(myDateSlider, myTable);

      // Line chart visualization
      var myLine = new google.visualization.ChartWrapper({
        chartType: 'LineChart',
        containerId: 'line_div',
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
