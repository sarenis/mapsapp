let map;
let userMarker;

function initializeMap(position) {
    const { latitude, longitude } = position.coords;
    const userLocation = [latitude, longitude];

    map = L.map('map').setView(userLocation, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    const userIcon = L.divIcon({
        html: `<div class="icon-container">
                  <img id="userIcon" src="saren.jpg" width="35" height="35">
               </div>`,
        iconSize: [39, 39], // Розмір іконки разом з рамкою і відступом
        iconAnchor: [27, 27], // Точка прив'язки іконки (центр низу)
        popupAnchor: [-8, -27] // Точка прив'язки попапа
    });

    userMarker = L.marker(userLocation, { icon: userIcon }).addTo(map)
    
    userMarker.on('click', function () {
        map.flyTo(userLocation, map.getMaxZoom());
    });

    // Налаштування постійного оновлення місцезнаходження
    navigator.geolocation.watchPosition(updateUserLocation, handleGeolocationError, {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
    });

    // Обробник для завантаження іконки
    document.getElementById('iconUpload').addEventListener('change', handleIconUpload);
}

function updateUserLocation(position) {
    const { latitude, longitude } = position.coords;
    const userLocation = [latitude, longitude];

    // Оновлення положення маркера без зміни виду карти
    userMarker.setLatLng(userLocation);

    console.log('Місцезнаходження оновлено:', userLocation);
}

function handleGeolocationError(error) {
    console.log("Не вдалося отримати геопозицію: " + error.message);
}

function handleIconUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const imgElement = document.getElementById('userIcon');
        imgElement.src = e.target.result;

        // Оновлення іконки маркера
        const userIcon = L.divIcon({
            html: `<div class="icon-container">
                      <img id="userIcon" src="${e.target.result}" width="35" height="35">
                   </div>`,
            iconSize: [39, 39],
            iconAnchor: [27, 27],
            popupAnchor: [-8, -27]
        });

        userMarker.setIcon(userIcon);
    };

    reader.readAsDataURL(file);
}

// Отримання початкового місцезнаходження та ініціалізація карти
navigator.geolocation.getCurrentPosition(initializeMap, handleGeolocationError, {
    enableHighAccuracy: true,
    timeout: 5000
});
