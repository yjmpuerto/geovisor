// Inicializar el mapa centrado en Boyacá, Colombia
let map = L.map('map').setView([5.5353, -73.3678], 9);


// Añadir capa de tiles de OpenStreetMap
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

L.control.scale().addTo(map);
var capaGeoJSON;
var capaGeoJSONMpios;

// Cargar y mostrar el archivo GeoJSON de departamentos
fetch('data/departamentos.geojson')
    .then(response => response.json())
    .then(data => {
        capaGeoJSON = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: '#a7b698ff',
                    weight: 2,
                    opacity: 0.65,
                    fillOpacity: 0.2
                };
            },
        }).addTo(map);

        // Ajustar el mapa para mostrar todos los departamentos
        map.fitBounds(capaGeoJSON.getBounds());

        // Cargar y mostrar el archivo GeoJSON de municipios
        fetch('data/mun_meta.geojson')        
            .then(response => response.json())
            .then(data => {
                capaGeoJSONMpios = L.geoJSON(data, {
                    style: function (feature) {
                        return {
                            color: 'rgb(195, 93, 152)',
                            weight: 2,
                            opacity: 0.65,
                            fillOpacity: 0.2
                        };
                    },
                }).addTo(map);

                var baseLayers = {            
                    "OpenStreetMap": osm
                };

                var overlays = {
                    "Departamentos": capaGeoJSON,
                    "Municipios": capaGeoJSONMpios
                };

                L.control.layers(baseLayers, overlays).addTo(map);

            })
            .catch(error => {
                console.error('Error al cargar el archivo GeoJSON:', error);
                alert('No se pudo cargar el archivo de departamentos');
            });

    })
    .catch(error => {
        console.error('Error al cargar el archivo GeoJSON:', error);
        alert('No se pudo cargar el archivo de departamentos');
    });