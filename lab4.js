// Worked in partial collaboration with Rachel Saunders.

window.onload = function(){
alert('This webpage requests your location in order to demonstrate how device sensors can interact with web maps.');
}; 

// This adds the ability for users to switch from Light to Dark basemaps, creates the map, and adds the basemaps to the map.
var mapboxAttribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
mapboxUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var Light   = L.tileLayer(mapboxUrl, {id: 'mapbox.light', attribution: mapboxAttribution}),
Dark  = L.tileLayer(mapboxUrl, {id: 'mapbox.dark', attribution: mapboxAttribution});

var map = L.map('map', {
  layers:[Light]}).fitWorld();

var baseMaps = {
  "Light": Light,
  "Dark": Dark
};
L.control.layers(baseMaps).addTo(map);

// Info button.
L.easyButton('fas fa-info-circle', function(){
  alert('This webpage requests your location in order to demonstrate how device sensors can interact with web maps.');
}).addTo(map);

// Locate button.
L.easyButton('fas fa-map-marker-alt', function(){
 map.locate({setView: true});
}).addTo(map);

// This gets the current time and changes the basemap based off what time it is.
var currentTime = new Date().getHours()

if (7 <= currentTime && currentTime < 18){
 map.addLayer(Light)
}
else{
 map.addLayer(Dark)
}

// The below JS code takes advantage of the Geolocate API as it is incorporated in the Leaflet JS API with the locate method.
// This function does three things if the location is found: it defines a radius variable, adds a popup to the map, and adds a circle to the map.
function onLocationFound(e) { 

// This defines a variable radius as the accuracy value returned by the locate method divided by 2. It is divided by 2 because the accuracy value is the sum of the estimated accuracy of the latitude plus the estimated accuracy of the longitude. The unit is meters.
  var radius = e.accuracy / 2; 

// This adds a Leaflet popup to the map at the lat and long returned by the locate function. The text of the popup is defined here as well. Please change this text to specify what unit the radius is reported in.
  L.marker(e.latlng).addTo(map)
    .bindPopup("You are within " + radius + " meters of this point. <br> The Latitude of the marker is: " + e.latitude + "<br> The Longitude of the marker is: " + e.longitude).openPopup();

// This adds a Leaflet circle to the map at the lat and long returned by the locate function. Its radius is set to the var radius defined above.
//  If the radius is less than 30, the color of the circle is blue. If it is more than 30, the color is red. 
if (radius < 30) {
      L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
  }
else{
      L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
  }
  
}

// This function runs if the location is not found when the locate method is called. It produces an alert window that reports the error
function onLocationError(e) {
  alert(e.message);
}

// These are event listeners that call the functions above depending on whether or not the locate method is successful
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// This specifies that the locate method should run.
map.locate({
  setView: true, // This option centers the map on location and zooms
  maxZoom: 16, // This option prevents the map from zooming further than 16, maintaining some spatial context even if the accuracy of the location reading allows for closer zoom
  timeout: 15000, // This option specifies when the browser will stop attempting to get a fix on the device's location. Units are miliseconds. Change this to 5000 and test the change. Before you submit, change this to 15000.
  watch: false, // You can set this option from false to true to track a user's movement over time instead of just once. For our purposes, however, leave this option as is.
});
