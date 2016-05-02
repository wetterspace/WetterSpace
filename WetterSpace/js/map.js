function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
   zoom: 8,
   center: {lat: 52.5200, lng: 13.4050}
 });

  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });

  // document.getElementById('address').addEventListener("keypress",function(e){
  //   if(e.keyCode == 13){   
    
  //    //geocodeAddress(geocoder, map);
  //    //var address = document.getElementById('address').value;

  //    window.alert(address);  }
  //   document.forms[0].submit();
  //   //document.getElementById("submit").click();    
  //  });
}



function geocodeAddress(geocoder, resultsMap) {

  var address = document.getElementById('address').value;

  geocoder.geocode({'address': address}, function(results, status) {

    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);

      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


