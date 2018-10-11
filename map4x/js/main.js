require([
  'esri/Map',
  'esri/views/MapView',
  "esri/layers/FeatureLayer",
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
  FeatureLayer,
  Collapse,
  Dropdown,
  CalciteMaps,
  CalciteMapArcGISSupport
) {

  let app = [];

  var map = new Map({
    basemap: 'streets'
  })
  var view = new MapView({
    container: 'viewDiv', // Reference to the scene div created in step 5
    map: map, // Reference to the map object created before the scene
    extent: {
      xmin: -2500000,
      ymin: 150000,
      xmax: 2400000,
      ymax: 3900000,
      spatialReference: {
        wkid: 102039
      }
    },
    padding: {
      top: 50,
      bottom: 0
    },

    zoom: 5, // Sets zoom level based on level of detail (LOD)
    center: [-98, 39] // Sets center point of view using longitude,latitude
  })
  var featureLayer = new FeatureLayer({
    url: "https://gis.ers.usda.gov/arcgis/rest/services/ra_people/MapServer/0"

  });
  featureLayer.opacity = .8;
  map.add(featureLayer);
})