let map;
let userMarker;

function initializeMap(position) {
    const { latitude, longitude } = position.coords;
    const userLocation = [latitude, longitude];

    map = L.map('map').setView(userLocation, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
        minZoom: 30
    }).addTo(map);

    const userIcon = L.divIcon({
        html: `<div class="icon-container">
                  <img src="saren.jpg" width="35" height="35">
               </div>`,
        iconSize: [39, 39], // Розмір іконки разом з рамкою і відступом
        iconAnchor: [27, 27], // Точка прив'язки іконки (центр низу)
        popupAnchor: [-8, -27] // Точка прив'язки попапа
    });

    userMarker = L.marker(userLocation, { icon: userIcon }).addTo(map)
        .bindPopup('Ти тут!');

    // Налаштування постійного оновлення місцезнаходження
    navigator.geolocation.watchPosition(updateUserLocation, handleGeolocationError, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
    });
}

function updateUserLocation(position) {
    const { latitude, longitude } = position.coords;
    const userLocation = [latitude, longitude];

    // Оновлення положення маркера без зміни виду карти
    userMarker.setLatLng(userLocation);

    // Перевірка наближення до якихось точок, якщо потрібно
    // checkProximity();
    console.log('Місцезнаходження оновлено:', userLocation);
}

function handleGeolocationError(error) {
    console.log("Не вдалося отримати геопозицію: " + error.message);
}

// Отримання початкового місцезнаходження та ініціалізація карти
navigator.geolocation.getCurrentPosition(initializeMap, handleGeolocationError, {
    enableHighAccuracy: true,
    timeout: 5000
});
