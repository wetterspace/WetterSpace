  
  google.load('visualization', '1', { packages : ['controls', 'corechart'] } );
    
      google.setOnLoadCallback(createTables);
window.onresize = function(){ createTables(); }
   // google.charts.load('current', {'packages':['controls']});

  // Set a callback to run when the Google Visualization API is loaded.
  //google.charts.setOnLoadCallback(drawDashboard);

    var myDashboard;

    function createTables() {
  // Create the dataset (DataTable)
        var myData = new google.visualization.DataTable();

        myData.addColumn('date', 'Date');
        myData.addColumn('number', 'Air Temp');
        myData.addColumn('number', 'Ground Temp');

        myData.addRows([
          
    [new Date(2014, 0, 1), -9, -2],
    [new Date(2014, 0, 2), -12, -5],
    [new Date(2014, 0, 3), -8, -2],
    [new Date(2014, 0, 4), -8, 0],
    [new Date(2014, 0, 5), -3, -5],
    [new Date(2014, 0, 6), -8, -4],
    [new Date(2014, 0, 7), -5, -1],
    [new Date(2014, 0, 8), -3, 0],
    [new Date(2014, 0, 9), -4, -1],
    [new Date(2014, 0, 10), -5, -2],
    [new Date(2014, 0, 11), -3, 2],
    [new Date(2014, 0, 12), -3, 2],
    [new Date(2014, 0, 13), -9, -3],
    [new Date(2014, 0, 14), -7, -1],
    [new Date(2014, 0, 15), -9, -6],
    [new Date(2014, 0, 16), -8, -4],
    [new Date(2014, 0, 17), 0, 4],
    [new Date(2014, 0, 18), -1, 2],
    [new Date(2014, 0, 19), -5, 2],
    [new Date(2014, 0, 20), -8, 0],
    [new Date(2014, 0, 21), -5, -1],
    [new Date(2014, 0, 22), -3, -2],
    [new Date(2014, 0, 23), -4, -1],
    [new Date(2014, 0, 24), -5, -2],
    [new Date(2014, 0, 25), -2, 4],
    [new Date(2014, 0, 26), -3, 2],
    [new Date(2014, 0, 27), -9, -5],
    [new Date(2014, 0, 28), -7, 0],
    [new Date(2014, 0, 29), -1, 4],
    [new Date(2014, 1, 1), 2, 5],
    [new Date(2014, 1, 2), 2, 4],
    [new Date(2014, 1, 3), 4, 8],
    [new Date(2014, 1, 4), 5, 10],
    [new Date(2014, 1, 5), 6, 6],
    [new Date(2014, 1, 6), 9, 12],
    [new Date(2014, 1, 7), -1, 3],
    [new Date(2014, 1, 8), 0, 2],
    [new Date(2014, 1, 9), -4, 0],
    [new Date(2014, 1, 10), -5, -1],
    [new Date(2014, 1, 11), -3, -1],
    [new Date(2014, 1, 12), -3, -2],
    [new Date(2014, 1, 13), -1, 0],
    [new Date(2014, 1, 14), -1, 0],
    [new Date(2014, 1, 15), -9, -2],
    [new Date(2014, 1, 16), -8, -1],
    [new Date(2014, 1, 17), 0, -1],
    [new Date(2014, 1, 18), 1, 1],
    [new Date(2014, 1, 19), 7, 5],
    [new Date(2014, 1, 20), 8, 10],
    [new Date(2014, 1, 21), 5, 7],
    [new Date(2014, 1, 22), 3, 5],
    [new Date(2014, 1, 23), -4, 2],
    [new Date(2014, 1, 24), -5, 1],
    [new Date(2014, 1, 25), -2, 0],
    [new Date(2014, 1, 26), -3, -1],
    [new Date(2014, 1, 27), 4, 1],
    [new Date(2014, 1, 28), 3, 4]
    ]);

     // Create a dashboard.
  var dash_container = document.getElementById('dashboard_div'),
  myDashboard = new google.visualization.Dashboard(dash_container);

  // Create a date range slider
  var myDateSlider = new google.visualization.ControlWrapper({
    'controlType': 'ChartRangeFilter',
    'containerId': 'control_div',
    'options': {
      'ui':  {
        'chartOptions':
        {
          'enableInteractivity': true,
          'chartArea': {'height': '100%'},
          'legend': {'position': 'none'},
          'colors': ['#e7785a', '#7eb7c1'],
              'curveType': 'function', // 'none' or 'function'
              'hAxis': {
                'textPosition': 'in',
                'gridlines': {'color': '#fff'}
              },
              'vAxis': {
                baselineColor: 'none',
                'textPosition': 'none',
                'gridlines': {'color': '#fff'}
              }
            }
          },
          'filterColumnLabel': 'Date', 
          'backgroundColor': 'none'
        },
        'state': {'range': {'start': new Date(2014, 0, 20), 'end': new Date(2014, 1, 1)}}
      });

  // Table visualization
  var myTable = new google.visualization.ChartWrapper({
    'chartType' : 'Table',
    'containerId' : 'table_div'

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
      tooltip: {isHtml: true}, 
      lineWidth: '3',
      colors: ['#e7785a', '#7eb7c1'],
      curveType: 'function', // 'none' or 'function'
      
      legend: {
        position:'top',
        alignment: 'end'
      },
      hAxis: { 
        format:'d MMM',
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
      // animation: {
      //   duration: 500,
      //   easing: 'inAndOut',
      //   startup: true
      // }
    }
  });
  
  // Bind myLine to the dashboard, and to the controls
  // this will make sure our line chart is update when our date changes
  myDashboard.bind(myDateSlider, myLine );

  myDashboard.draw(myData);
}

   
   