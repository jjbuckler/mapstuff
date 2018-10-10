require([
  'esri/Map',
  'esri/views/MapView',
  // Bootstrap
  'bootstrap/Collapse',
  'bootstrap/Dropdown',

  // Calcite Maps
  'calcite-maps/calcitemaps-v0.9',
  // Calcite Maps ArcGIS Support
  'calcite-maps/calcitemaps-arcgis-support-v0.9',

  'dojo/domReady!'
], function (
  Map,
  MapView,
  Collapse,
  Dropdown,
  CalciteMaps,
  CalciteMapArcGISSupport
) {
  var map = new Map({
    basemap: 'streets'
  })
  var view = new MapView({
    container: 'viewDiv', // Reference to the scene div created in step 5
    map: map, // Reference to the map object created before the scene
    zoom: 4, // Sets zoom level based on level of detail (LOD)
    center: [15, 65] // Sets center point of view using longitude,latitude
  })
})
