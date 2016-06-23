$(document).ready(function() {
  $("#submit").click(function() {
    var location = $("#address").val();
    var start_date = $("#start_date").val();
    var end_date = $("#end_date").val();

    //
    $.ajax({
      type: "POST",
      // url: "../../cgi-bin/test.cgi",
      // change to relative URL in production
      url: "https://www.wetter.space/cgi-bin/jsonGenerator.cgi",
      data: {
        location:location,
        start_date:start_date,
        end_date:end_date,
      },
      success: function(content) {
        handleResponse(content);
      }
    });
  });
});
