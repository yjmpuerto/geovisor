// Configuración del mapa
const MAP_CONFIG = {
    center: [5.5353, -73.3678],
    zoom: 9
};

// Estilos para las capas GeoJSON
const STYLES = {
    departamentos: {
        color: '#a7b698ff',
        weight: 2,
        opacity: 0.65,
        fillOpacity: 0.2
    },
    municipios: {
        color: 'rgb(195, 93, 152)',
        weight: 2,
        opacity: 0.65,
        fillOpacity: 0.2
    }
};

// Inicializar el mapa centrado en Boyacá, Colombia
const map = L.map('map').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

// Añadir capa de tiles de OpenStreetMap
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
}).addTo(map);

// Añadir control de escala
L.control.scale().addTo(map);

// Añadir mapa de referencia (mini mapa)
const miniMapTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
});

const miniMap = new L.Control.MiniMap(miniMapTiles, {
    toggleDisplay: true,
    minimized: false,
    position: 'bottomleft',
    width: 150,
    height: 150,
    zoomLevelOffset: -5
}).addTo(map);

// Variables para las capas GeoJSON
let capaGeoJSON;
let capaGeoJSONMpios;

/**
 * Carga un archivo GeoJSON desde una ruta específica
 * @param {string} url - Ruta del archivo GeoJSON
 * @returns {Promise<Object>} - Datos del GeoJSON
 */
async function cargarGeoJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al cargar el archivo GeoJSON desde ${url}:`, error);
        throw error;
    }
}

/**
 * Crea una capa GeoJSON con el estilo especificado
 * @param {Object} data - Datos GeoJSON
 * @param {Object} style - Estilo a aplicar
 * @returns {L.GeoJSON} - Capa GeoJSON de Leaflet
 */
function crearCapaGeoJSON(data, style) {
    return L.geoJSON(data, {
        style: () => style
    });
}

/**
 * Configura los controles de capas del mapa
 */
function configurarControles() {
    const baseLayers = {
        "OpenStreetMap": osm
    };

    const overlays = {
        "Departamentos": capaGeoJSON,
        "Municipios": capaGeoJSONMpios
    };

    L.control.layers(baseLayers, overlays).addTo(map);
}

/**
 * Inicializa el mapa cargando todas las capas GeoJSON
 */
async function inicializarMapa() {
    try {
        // Cargar departamentos
        const dataDepartamentos = await cargarGeoJSON('data/departamentos.geojson');
        capaGeoJSON = crearCapaGeoJSON(dataDepartamentos, STYLES.departamentos);
        capaGeoJSON.addTo(map);

        // Ajustar el mapa para mostrar todos los departamentos
        map.fitBounds(capaGeoJSON.getBounds());

        // Cargar municipios
        const dataMunicipios = await cargarGeoJSON('data/municipios.geojson');
        capaGeoJSONMpios = crearCapaGeoJSON(dataMunicipios, STYLES.municipios);
        capaGeoJSONMpios.addTo(map);

        // Configurar controles de capas
        configurarControles();

    } catch (error) {
        alert('No se pudieron cargar los archivos GeoJSON. Por favor, verifica que los archivos existan en la carpeta "data".');
    }
}

// Iniciar la aplicación
inicializarMapa();