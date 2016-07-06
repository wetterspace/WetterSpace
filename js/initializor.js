window.onload = function() {
  addAjaxEvent();
  addDateValidation();

  google.charts.load('current', {'packages':['corechart', "controls"]});
  // google.charts.setOnLoadCallback(drawBackgroundColor);
}
