var currentMarker;

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
   zoom: 6,
   center: {lat: 50.9173203, lng: 11.3905368}
 });

  var geocoder = new google.maps.Geocoder();
  zoomToPositionOnChange(map, geocoder);

  map.addListener('click', function(e) {
    geocodeLatLng(e.latLng, map, geocoder);
  });
}

function zoomToPositionOnChange(map, geocoder) {
  var location = document.getElementById("address");

  location.onchange = function() {
    var value = location.value;
    geocodeAddress(value, geocoder, map)
  }
}

function geocodeAddress(address, geocoder, map) {
  geocoder.geocode({'address': address, componentRestrictions: {country: 'DE'}}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      map.setZoom(8);

      // setMapOnAll(null);
      // if(currentMarker) currentMarker.setMap(null);
      setMarker(map, results[0].geometry.location);
    } else {
      // alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function geocodeLatLng(latLng, map, geocoder) {
  geocoder.geocode({'latLng': latLng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
            var locationData = results[0].formatted_address;
            locationData = locationData.split(",");
            var zipcode = locationData[locationData.length - 2].trim().split(" ")[0];
            var locationInputField = document.getElementById("address");
            locationInputField.value = zipcode;

            setMarker(map, results[0].geometry.location);
        } else {
            alert("location not found");
        }
    } else {
        //document.getElementById("location").innerHTML="Geocoder failed due to: " + status;
        //alert("Geocoder failed due to: " + status);
    }
  });
}

function setMarker(map, location) {
  map.setCenter(location);
  map.setZoom(8);
  // setMapOnAll(Null);
  if(currentMarker) currentMarker.setMap(null);
  currentMarker = new google.maps.Marker({
    map: map,
    position: location
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
