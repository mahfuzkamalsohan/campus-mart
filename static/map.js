
  // Coordinates of each user's university (example)
  const IUT = { lat: 23.948126, lng: 90.380306 }; // Example: BUET
  const DU = { lat: 23.7338768, lng: 90.3929044 };
  const BUET = {lat:23.7262533, lng: 90.3926687};
  const NSU = {lat:23.8160683,lng: 90.4270251};
   // Example: IUT

  // Initialize map centered between the two points
  const map = L.map('map').setView([23.7295, 90.4045], 12);

  // Add tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Add university markers
  L.marker(IUT).addTo(map)
    .bindPopup("Islamic University of Technology").openPopup();

  L.marker(DU).addTo(map)
    .bindPopup("Dhaka University");
  
  
    L.marker(BUET).addTo(map)
    .bindPopup("BUET");

    L.marker(NSU).addTo(map)
    .bindPopup("NSU");

  // Get & show live location (browser permission needed)
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(position => {
      const liveLat = position.coords.latitude;
      const liveLng = position.coords.longitude;

      const liveMarker = L.marker([liveLat, liveLng], { color: 'red' }).addTo(map)
        .bindPopup("Your Live Location").openPopup();

      map.setView([liveLat, liveLng], 13); // Center on user
    });
  }

  // Initialize Leaflet map with a more relevant initial view (centered on Dhaka, Bangladesh)


// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to drop a red pin at the specified coordinates
function dropSharedPin(lat, lng, label = "Shared Pin") {
  L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      shadowSize: [41, 41]
    })
  }).addTo(map)
    .bindPopup(label)
    .openPopup();
}

// Handle coordinate form submission
document.getElementById('coord-form').addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent page reload

  const lat = parseFloat(document.getElementById('latitude').value);
  const lng = parseFloat(document.getElementById('longitude').value);

  if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
    // Drop a red pin and center the map
    dropSharedPin(lat, lng, `Pinned Location: [${lat}, ${lng}]`);
    map.setView([lat, lng], 13); // Zoom in to the pinned location
  } else {
    alert("Please enter valid coordinates (latitude: -90 to 90, longitude: -180 to 180).");
  }
});

// Prevent search form from reloading the page
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  console.log("Search submitted (functionality not implemented)");
});