// Set up Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoieWloYW5zaGkiLCJhIjoiY2x3OHJ3MGxxMDFkNDJybTFmMDR6aGhoMSJ9.VLZIUURUMzNOYoYaalN8pQ';

// Initialize the map for page 1
var map1 = new mapboxgl.Map({
    container: 'map1',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-74.0060, 40.7128], // NYC coordinates
    zoom: 10
});

// Layer file paths
const safeStreetsPath = 'DATA/safe_streets_for_seniors.geojson';
const seniorCentersPath = 'DATA/senior_centers.geojson';
const priorityCorridorsPath = 'DATA/priority_corridors.geojson';

// Function to load a GeoJSON polygon (area) layer
function loadPolygonLayer(filePath, layerId, sourceId, color) {
    if (map1.getSource(sourceId)) {
        map1.removeLayer(layerId);
        map1.removeSource(sourceId);
    } else {
        map1.addSource(sourceId, {
            type: 'geojson',
            data: filePath
        });

        map1.addLayer({
            id: layerId,
            type: 'fill',
            source: sourceId,
            paint: {
                'fill-color': color,
                'fill-opacity': 0.6
            }
        });
    }
}

// Function to load a GeoJSON circle layer
function loadCircleLayer(filePath, layerId, sourceId, color) {
    if (map1.getSource(sourceId)) {
        map1.removeLayer(layerId);
        map1.removeSource(sourceId);
    } else {
        map1.addSource(sourceId, {
            type: 'geojson',
            data: filePath
        });

        map1.addLayer({
            id: layerId,
            type: 'circle',
            source: sourceId,
            paint: {
                'circle-radius': 2.7,
                'circle-color': color
            }
        });
    }
}

// Function to load a GeoJSON line layer
function loadLineLayer(filePath, layerId, sourceId, color) {
    if (map1.getSource(sourceId)) {
        map1.removeLayer(layerId);
        map1.removeSource(sourceId);
    } else {
        map1.addSource(sourceId, {
            type: 'geojson',
            data: filePath
        });

        map1.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
                'line-color': color,
                'line-width': 1
            }
        }, 'waterway-label'); // Ensure it's added above some base layers for visibility
    }
}

// Toggle visibility of info sections and load layers
function toggleSection(sectionId, loadFunction, filePath, layerId, sourceId, color) {
    var section = document.getElementById(sectionId);
    console.log(`Toggling section: ${sectionId}`); // Add logging for troubleshooting
    if (section.style.display === "none" || section.style.display === "") {
        section.style.display = "block";
        loadFunction(filePath, layerId, sourceId, color);
    } else {
        section.style.display = "none";
        if (map1.getSource(sourceId)) {
            map1.removeLayer(layerId);
            map1.removeSource(sourceId);
        }
    }
}

// Event listeners for buttons
document.getElementById('btnSafeStreets').addEventListener('click', function () {
    toggleSection('safeStreetsInfo', loadPolygonLayer, safeStreetsPath, 'safeStreets', 'safeStreets', '#ffcccc'); // Light pink color for Safe Streets
});

document.getElementById('btnSeniorCenters').addEventListener('click', function () {
    toggleSection('seniorCentersInfo', loadCircleLayer, seniorCentersPath, 'seniorCenters', 'seniorCenters', '#ff0000'); // Red color for Senior Centers
});

document.getElementById('btnPriorityCorridors').addEventListener('click', function () {
    toggleSection('priorityCorridorsInfo', loadLineLayer, priorityCorridorsPath, 'priorityCorridors', 'priorityCorridors', '#8B0000'); // Dark red color for Priority Corridors
});

// Initial state
document.getElementById('safeStreetsInfo').style.display = "none";
document.getElementById('seniorCentersInfo').style.display = "none";
document.getElementById('priorityCorridorsInfo').style.display = "none";

// Initialize the map for page 2
let map2;

function initializeMap2() {
    console.log("Initializing map2...");
    map2 = new mapboxgl.Map({
        container: 'map2', // Map container id
        style: 'mapbox://styles/mapbox/light-v10', // Map style
        center: [-74.006, 40.7128], // Initial map center coordinates
        zoom: 12, // Initial zoom level
        bearing: 0, // Initial bearing
        pitch: 0 // Initial pitch
    });

    // Define chapter data with popup text content
    const chapters = {
        'road-diets': {
            bearing: 0,
            center: [-74.010285, 40.620977],
            zoom: 15,
            pitch: 20,
            image: 'sign/photo1.png',
            popupText: '86 Street, Brooklyn'
        },
        'conventional-bike-lanes': {
            bearing: 20,
            center: [-73.981923, 40.765891],
            zoom: 15,
            pitch: 20,
            image: 'sign/photo2.png',
            popupText: 'West 55 Street, Manhattan'
        },
        'protected-bike-lanes': {
            bearing: 40,
            center: [-73.973074, 40.782580],
            zoom: 15,
            pitch: 20,
            image: 'sign/photo3.png',
            popupText: 'Central Park West, Manhattan'
        },
        'pedestrian-islands': {
            bearing: 60,
            center: [-73.955153, 40.805468],
            zoom: 15,
            pitch: 20,
            image: 'sign/photo4.png',
            popupText: '116 Street, Manhattan'
        },
        'curb-sidewalk-extensions': {
            bearing: 80,
            center: [-73.939665, 40.693842],
            zoom: 15,
            pitch: 20,
            image: 'sign/photo5.png',
            popupText: 'Willoughby Avenue, Brooklyn'
        },
        'turn-calming': {
            bearing: 100,
            center: [-73.949386, 40.706621],
            zoom: 15,
            pitch: 20,
            image: 'sign/photo6.png',
            popupText: 'Marcy Avenue, Brooklyn'
        },
        'lpis': {
            bearing: 120,
            center: [-73.973752, 40.752947],
            zoom: 15,
            pitch: 20,
            image: 'sign/photo7.png',
            popupText: 'Madison Avenue, Manhattan'
        }
    };

    // Set the active chapter name
    let activeChapterName = 'road-diets';

    // Function to set the active chapter
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;

        console.log(`Flying to chapter: ${chapterName}`);

        // Fly to the new chapter location
        map2.flyTo({
            center: chapters[chapterName].center,
            zoom: chapters[chapterName].zoom,
            bearing: chapters[chapterName].bearing,
            pitch: chapters[chapterName].pitch,
            speed: 0.5, // Adjust the speed of the flyTo transition
            curve: 1, // Adjust the curve of the flyTo transition
            essential: true // This animation is considered essential with respect to prefers-reduced-motion
        });

        // Remove existing markers
        document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());

        // Create DOM element for the marker
        const el = document.createElement('div');
        el.id = 'marker';
        el.style.backgroundImage = `url(${chapters[chapterName].image})`;
        el.style.width = '50px'; // Adjust the width of the marker
        el.style.height = '50px'; // Adjust the height of the marker

        // Add the new marker with text popup
        new mapboxgl.Marker(el)
            .setLngLat(chapters[chapterName].center)
            .setPopup(new mapboxgl.Popup({ offset: [0, -90] }) // Adjust offset to move popup higher
                .setText(chapters[chapterName].popupText))
            .addTo(map2);

        // Update the active class on sections
        document.getElementById(chapterName).classList.add('active');
        document.getElementById(activeChapterName).classList.remove('active');

        activeChapterName = chapterName;
    }

    var scrollableDiv = document.getElementById('features');
    // Function to check if an element is on screen
    function isElementOnScreen(id) {
        const element = document.getElementById(id);
        const bounds = element.getBoundingClientRect();
        return (bounds.top < window.innerHeight) && (bounds.bottom >400);
    }

    // Check which chapter is on screen on scroll
    scrollableDiv.addEventListener('scroll', function(event) {
        for (const chapterName in chapters) {
            if (isElementOnScreen(chapterName)) {
                setActiveChapter(chapterName);
                break;

            }
        }
    });
}

// Toggle button functionality
document.getElementById('toggleButton').addEventListener('click', function () {
    var page1 = document.getElementById('page1');
    var page2 = document.getElementById('page2');

    if (page1.style.display === 'none') {
        page1.style.display = 'flex';
        page2.style.display = 'none';
        map1.resize(); // Ensure the map resizes correctly when shown
    } else {
        page1.style.display = 'none';
        page2.style.display = 'flex';
        if (!map2) {
            initializeMap2(); // Initialize map2 only when page2 is shown for the first time
        } else {
            map2.resize(); // Ensure the map resizes correctly when shown
        }
    }
});
