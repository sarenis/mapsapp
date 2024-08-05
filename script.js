const firebaseConfig = {
  apiKey: "AIzaSyCzxLE0dovqEppLKlCk_xipfQsq0m_n2hs",
  authDomain: "sarenmap.firebaseapp.com",
  databaseURL: "https://sarenmap-default-rtdb.firebaseio.com",
  projectId: "sarenmap",
  storageBucket: "sarenmap.appspot.com",
  messagingSenderId: "472187095328",
  appId: "1:472187095328:web:e5b067bdc1a5c61007ef45",
  measurementId: "G-ZPCR33ZHWY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let map;
let userMarker;
const otherUsersMarkers = {};

function initializeMap(position) {
    const { latitude, longitude } = position.coords;
    const userLocation = [latitude, longitude];

    map = L.map('map').setView(userLocation, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    const userIcon = L.divIcon({
        html: `<div class="icon-container">
                  <img src="saren.jpg" width="35" height="35">
               </div>`,
        iconSize: [39, 39],
        iconAnchor: [27, 27],
        popupAnchor: [-8, -27]
    });

    userMarker = L.marker(userLocation, { icon: userIcon }).addTo(map);
    
    userMarker.on('click', function () {
        map.flyTo(userLocation, map.getMaxZoom());
    });

    // Post user's location to Firebase
    postUserLocation(position);

    // Listen for location updates of other users
    listenForOtherUsers();

    // Start watching user's location
    navigator.geolocation.watchPosition(updateUserLocation, handleGeolocationError, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
    });
}

function postUserLocation(position) {
    const { latitude, longitude } = position.coords;
    const userId = "user1"; // Change this to unique ID for each user

    database.ref('users/' + userId).set({
        latitude: latitude,
        longitude: longitude
    });
}

function updateUserLocation(position) {
    const { latitude, longitude } = position.coords;
    const userLocation = [latitude, longitude];

    userMarker.setLatLng(userLocation);

    // Post user's updated location to Firebase
    postUserLocation(position);

    console.log('Місцезнаходження оновлено:', userLocation);
}

function listenForOtherUsers() {
    database.ref('users').on('value', (snapshot) => {
        const users = snapshot.val();
        for (const userId in users) {
            if (userId !== "user1") { // Exclude current user
                const { latitude, longitude } = users[userId];
                const userLocation = [latitude, longitude];

                if (!otherUsersMarkers[userId]) {
                    const otherUserIcon = L.divIcon({
                        html: `<div class="icon-container">
                                  <img src="otherUser.jpg" width="35" height="35">
                               </div>`,
                        iconSize: [39, 39],
                        iconAnchor: [27, 27],
                        popupAnchor: [-8, -27]
                    });

                    const marker = L.marker(userLocation, { icon: otherUserIcon }).addTo(map);
                    otherUsersMarkers[userId] = marker;
                } else {
                    otherUsersMarkers[userId].setLatLng(userLocation);
                }
            }
        }
    });
}

function handleGeolocationError(error) {
    console.log("Не вдалося отримати геопозицію: " + error.message);
}

navigator.geolocation.getCurrentPosition(initializeMap, handleGeolocationError, {
    enableHighAccuracy: true,
    timeout: 5000
});
