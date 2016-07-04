window.onload = function() {
  addAjaxEvent();
  addDateValidation();

  google.charts.load('current', {'packages':['corechart']});
  // google.charts.setOnLoadCallback(drawBackgroundColor);
}
