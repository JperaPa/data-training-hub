// THREE and Globe come from <script type="module"> in index.html
let currentLayer = 'flows';

function getRegionColor(country) {
  const riskMap = {
    "Russia": "#ff4444",
    "Iran": "#ff4444",
    "North Korea": "#ff4444",
    "China": "#ffaa00",
    "Venezuela": "#ffaa00",
    "Nigeria": "#22c55e",
    "Philippines": "#22c55e"
  };

  return riskMap[country] || "rgba(0, 150, 255, 0.25)";
}

export function initIntelGlobe() {
  const container = document.getElementById('intel-globe-container');
  if (!container) {
    console.error("intel-globe-container NOT FOUND");
    return;
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.offsetWidth / container.offsetHeight,
    0.1,
    2000
  );
  camera.position.z = 350;

  const globe = new Globe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .showAtmosphere(true)
    .atmosphereColor('#4f8ef7')
    .atmosphereAltitude(0.25);

  window.__globe = globe;
  scene.add(globe);

  // VECTOR LAYER
  const vectorData = [
    { startLat: 40.7, startLng: -74, endLat: 51.5, endLng: -0.1, color: '#22c55e' },
    { startLat: 34.05, startLng: -118.2, endLat: 35.6, endLng: 139.7, color: '#22c55e' }
  ];

  globe
    .arcsData(vectorData)
    .arcColor(d => d.color)
    .arcAltitude(0.25)
    .arcStroke(0.8)
    .arcDashLength(0.6)
    .arcDashGap(0.2)
    .arcDashAnimateTime(2000);

  // HOTSPOT LAYER
  const hotspotData = [
    { lat: 24.7, lng: 46.7, size: 1.2, color: '#ef4444' },
    { lat: 14.6, lng: 121, size: 1.0, color: '#ef4444' }
  ];

  globe
    .pointsData(hotspotData)
    .pointColor(d => d.color)
    .pointAltitude(0.1)
    .pointRadius(d => d.size);

  // LAYER SWITCHING
  window.switchGlobeLayer = function (layer) {
    currentLayer = layer;

    if (layer === 'regions') {
      globe.polygonsData(window.__geojson.features);
      globe.arcsData([]);
      globe.pointsData([]);
    }

    if (layer === 'hotspots') {
      globe.arcsData([]);
      globe.pointsData(hotspotData);
    }
  };

  // ANIMATION LOOP
  function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.0008;
    renderer.render(scene, camera);
  }
  animate();

  // REGION OVERLAY
  fetch('../data/world-geojson.json')
    .then(res => res.json())
    .then(geojson => {
      window.__geojson = geojson;

      globe
        .polygonsData(geojson.features)
        .polygonCapColor(d => getRegionColor(d.properties.ADMIN))
        .polygonSideColor(() => 'rgba(0, 150, 255, 0.5)')
        .polygonStrokeColor(() => '#00aaff')
        .polygonAltitude(0.01);
    });
}

// RUN GLOBE ON DOM READY
window.addEventListener('DOMContentLoaded', initIntelGlobe);
