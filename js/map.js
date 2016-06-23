function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
   zoom: 6,
   center: {lat: 50.9173203, lng: 11.3905368}
 });

  var geocoder = new google.maps.Geocoder();
  zoomToPositionOnChange(map, geocoder);

  google.maps.event.addListener(map, "leftclick", function(event) {
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    // populate yor box/field with lat, lng
    alert("Lat=" + lat + "; Lng=" + lng);
  });
}

function zoomToPositionOnChange(map, geocoder) {
  var location = document.getElementById("address");

  location.onchange = function() {
    var value = location.value;
    geocodeAddress(value, geocoder, map)
  }
}

function geocodeAddress(address, geocoder, resultsMap) {
  geocoder.geocode({'address': address, componentRestrictions: {country: 'DE'}}, function(results, status) {

    if (status === google.maps.GeocoderStatus.OK) {
      resultsMap.setCenter(results[0].geometry.location);
      resultsMap.setZoom(8);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });

    } else {
      // alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}


  // document.getElementById('address').addEventListener("keypress",function(e){
  //   if(e.keyCode == 13){

  //    //geocodeAddress(geocoder, map);
  //    //var address = document.getElementById('address').value;

  //    window.alert(address);  }
  //   document.forms[0].submit();
  //   //document.getElementById("submit").click();
  //  });
