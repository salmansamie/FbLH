var directionsService = null,
  directionsDisplay = null,
  pos = null,
  waypoints_arr = [],
  map = null;

$('#generate-my-route').on('click', function() {
  $.ajax({
    url: 'https://dbe.tobymellor.co.uk',
    type: 'GET',
    data: {
        latitude: pos.lat,
        longitude: pos.lng,
        minutes: $('#run-duration').val(),
        average_speed: '9.6'
    },
    success: function(response) {
      var jsonResponse = response;
      calculateAndDisplayRoute(jsonResponse.routes[0].legs);
      hideInputFields();
    },
    error: function(jsonResponse) {}
  });
});  

$('#open-in-google-maps').on('click', function() {
  openGoogleMaps();
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initMap, function(error) {
    });
  } else {
    console.log("Geolocation is not supported by this browser");
  }
}

function initMap(position) {
  let banner = document.getElementById('banner');
  banner.classList.add('removeBanner');
  let main_c = document.getElementsByClassName('main_c')[0];
  main_c.classList.add('show_main_c');

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: pos
  });

  var marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: 'Current Location'
  });

  directionsDisplay.setMap(map);

  getCrime();
}

function calculateAndDisplayRoute(legs) {
  var googleWaypoints = [],
      waypoint;

  waypoints_arr = [];

  for (var i = 1; i < legs.length; i++) {

    let leg = legs[i];

    let waypoint = new google.maps.LatLng(
      legs[i].start_location.lat,
      legs[i].start_location.lng,
    );

    waypoints_arr.push({ location: waypoint, stopover: true });

  }

  let origin = pos.lat + ',' + pos.lng;

  directionsService.route({
    origin: origin,
    destination: origin,
    waypoints: waypoints_arr,
    travelMode: google.maps.DirectionsTravelMode.WALKING
  }, function(response, status) {
      directionsDisplay.setDirections(response);
  });
}

var bottomVal = $('.input-fields').css('bottom');

function hideInputFields() {
  $('.input-fields').animate(
    {
      'bottom': '-175px'
    },
    400,
    function() {
      $('.show-input-fields').fadeIn();
    }
  );

  $('#open-in-google-maps').fadeIn();
}

function getWaypointsLongLat() {
  var waypoints = [];

  for (var i = 0; i < waypoints_arr.length; i++) {
    var waypoint = waypoints_arr[i];

    waypoints.push(waypoint.location.lat() + ',' + waypoint.location.lng());
  }

  return waypoints.join('|');
}

function openGoogleMaps() {
  var url = "https://www.google.com/maps/dir/?api=1&origin=" + pos.lat + "," + pos.lng + "&destination=" + pos.lat + "," + pos.lng + "&waypoints=" + getWaypointsLongLat() + "&travelmode=walking",
      win = window.open(url, '_blank');

  win.focus();
}

$('.show-input-fields').on('click', function() {
  $(this).fadeOut(250, function() {
    $('.input-fields').animate({
      'bottom': bottomVal
    }, 400);
  });

  $('#open-in-google-maps').fadeOut();
});

//////

var crimePoints = [];

function getCrime() {
  var pos = {
    lat: 51.516744,
    lng: -0.134483
  };

  let url = "https://data.police.uk/api/crimes-street/all-crime?lat=" + pos.lat + "&lng=" + pos.lng + "&date=2017-01";

  $.ajax({
    url: url,
    type: 'GET',
    success: function(response) {
       let weights = {
        'possession-of-weapons': 1,
        'theft-from-the-person': 1,
        'violent-crime': 10
       };

      for (let i = 0; i < response.length; i++) {
        if (Math.random() < 0.9) { // temporary: for effect
          continue;
        }

         let record = response[i];

         if (Object.keys(weights).indexOf(record.category) > -1) {
           crimePoints.push({
              location: new google.maps.LatLng(record.location.latitude, record.location.longitude),
              weight: weights[record.category]
            });
          }
      }

      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: crimePoints,
        map: map,
        radius: 25,
      });

      heatmap.setMap(map);
    },
    error: function(jsonResponse) {}
  });
}