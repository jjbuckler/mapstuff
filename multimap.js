var app=[];
require ([
  "dojo/on",
  "dojo/_base/connect", 
  "dojo/dom",
  "dojo/query",
  "dojo/parser",
  "esri/map",
  "esri/dijit/Scalebar",
  "esri/tasks/identify",
  "dijit/layout/TabContainer",
  "esri/dijit/Geocoder",
  "esri/arcgis/utils",
  "esri/dijit/Popup",
  "esri/config",
  "esri/dijit/Attribution",
  "dojo/_base/array",
  "dijit/registry",
  "esri/graphic",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/geometry/screenUtils",
  "dojo/dom-construct",
  "dojo/dom-class",
  "dojo/mouse",
  "dojo/query",
  "dojo/_base/Color",
  "dojo/fx/Toggler",
  "dijit/form/Button",
  "dijit/Menu",
  "dijit/form/HorizontalSlider",
  "dijit/TitlePane",
  "dijit/layout/ContentPane",
  "dijit/Tooltip",
  "dojox/data/XmlStore",
  "dijit/form/CheckBox",
  "dijit/layout/BorderContainer",
  "esri/dijit/InfoWindow",
  "dojo/domReady!"
  ],
  function (on, connect, dom, query, parser, Map, Scalebar, identify, TabContainer, Geocoder,  arcgisUtils,Popup, esriConfig, Attribution, arrayUtils, registry, Graphic, SimpleMarkerSymbol, screenUtils,
  domConstruct, domClass, mouse, query, Color, Toggler, Button, Menu, HorizontalSlider, TitlePane, ContentPane, Tooltip, XmlStore, CheckBox, 
  InfoWindow, BorderContainer){
  
  parser.parse();
    
    esriConfig.defaults.io.corsDetection = false;
    esri.config.defaults.io.corsEnabledServers.push("serverapi.arcgisonline.com");
    esri.config.defaults.io.corsEnabledServers.push("static.arcgis.com");
    esriConfig.defaults.io.proxyUrl = "/proxy";
	
	  var ext = new esri.geometry.Extent({ "xmin": -17529487, "ymin": 1874364, "xmax": -5084316, "ymax": 7500129, "spatialReference": { "wkid": 102100} });
	
     app.map1 = new esri.Map("map1", {   
      extent: ext,
      sliderStyle: "large",
      showAttribution: false
    }); 
  
     app.map2 = new esri.Map("map2", {   
      extent: ext,
      sliderStyle: "large",
      showAttribution: false
    }); 
	   app.map3 = new esri.Map("map3", {   
      extent: ext,
      sliderStyle: "large",
      showAttribution: false
    }); 
     app.fooddesert0 = new esri.layers.ArcGISDynamicMapServiceLayer("http://gis.ers.usda.gov/arcgis/rest/services/ra_people/MapServer/"); /*S100*/
    app.fooddesert3 = new esri.layers.ArcGISDynamicMapServiceLayer("http://gis.ers.usda.gov/arcgis/rest/services/ra_people/MapServer/"); /*S100*/
    app.fooddesert6 = new esri.layers.ArcGISDynamicMapServiceLayer("http://gis.ers.usda.gov/arcgis/rest/services/ra_people/MapServer/"); /*S100*/
       app.fooddesert0.setVisibleLayers([0]);
  app.fooddesert3.setVisibleLayers([1]);
  app.fooddesert6.setVisibleLayers([2]);
  app.map1.addLayer(app.fooddesert0)
    app.map2.addLayer(app.fooddesert3)
	  app.map3.addLayer(app.fooddesert6)
  
  
  
  });