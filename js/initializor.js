window.onload = function() {
  addAjaxEvent();
  addDateValidation();
  addEnterEvent();

  window.addEventListener('resize', redrawOnResize) 

  google.charts.load('current', {'packages':['corechart', "controls"]});
  // google.charts.setOnLoadCallback(drawBackgroundColor);
   $("#weatherMetrics").sticky({topSpacing:40});
}
