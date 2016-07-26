window.onload = function() {
  addAjaxEvent();
  addDateValidation();
  addEnterEvent();

  window.addEventListener('resize', redrawOnResize)

  google.charts.load('current', {'packages':['corechart', "controls"]});
   $("#weatherMetrics").sticky({topSpacing:40});
}
