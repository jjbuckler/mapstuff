var tItem;
var app = [];
var printList;
var services = [];
var serviceTxt;
var identifyTask;
var lgdRequestHandle;
var app = [];
var classCnt;
var flags = {};
var title;
var pntLayer;
var lyrTitle;
var unitsName;
var varID;
require([
		"dojo/dom",
		"dojo/query",
		"dojo/on",
		"dojo/dom-construct",
		"dojo/dom-attr",
		"dojo/dom-style",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/promise/all",
		"dojo/on",
		"dojo/dom-class",
		"dojo/_base/json",
		"dojo/_base/array",
		"dojo/string",
		"esri/request",
		"dojo/parser",
		"dijit/layout/AccordionContainer",
		"dijit/TitlePane",
		"dijit/form/Form",
		"dijit/form/CheckBox",
		"dijit/form/RadioButton",
		"dijit/form/TextBox",
		"dijit/form/Button",
		"dijit/form/Select",
		"dijit/Menu",
		"dijit/registry",
		"dijit/layout/LinkPane",
		"dijit/MenuItem",
		"dijit/form/DropDownButton",
		"dijit/DropDownMenu",
		"dojox/grid/DataGrid",
		"dojox/grid/EnhancedGrid",
		"dojox/layout/ContentPane",
		"dojo/store/Memory",
		"dojo/data/ObjectStore",
		"dojo/data/ItemFileReadStore",
		"dojo/data/ItemFileWriteStore",
		"dojo/Deferred",
		"dojo/request",
		"esri/map",
		"esri/tasks/query",
		"esri/tasks/QueryTask",
		"esri/dijit/Scalebar",
		"esri/dijit/Legend",
		"esri/geometry/Extent",
		"esri/tasks/identify",
		"esri/dijit/Print",
		"esri/tasks/PrintTask",
		"esri/tasks/PrintTemplate",
		"esri/dijit/InfoWindow",
		"esri/symbols/SimpleMarkerSymbol",
		"esri/symbols/SimpleLineSymbol",
		"esri/layers/FeatureLayer",
		"esri/InfoTemplate",
		"dijit/layout/TabContainer",
		"esri/tasks/identify",
		"esri/request",
		"dojox/layout/FloatingPane",
		"dijit/form/ComboBox",
		"dojo/request/xhr",
		"dojo/domReady!"
	],
	function (dom, query, on, domConstruct, domAttr, domStyle, lang, arrayUtils, all, on, domClass, dojoJson, array, dojoString, esriRequest, parser, AccordionContainer, TitlePane, Form, CheckBox, RadioButton, TextBox, Button, Select, Menu, registry, LinkPane, MenuItem,
		DropDownButton, DropDownMenu, DataGrid, EnhancedGrid, ContentPane, Memory, ObjectStore, ItemFileReadStore, ItemFileWriteStore, Deferred, request, map, Query, QueryTask, Scalebar, Legend, Extent, Identify, PrintTask, PrintTemplate, Print, InfoWindow, SimpleMarkerSymbol, SimpleLineSymbol, FeatureLayer, InfoTemplate, TabContainer, identify, esriRquest, FloatingPane, ComboBox, xhr) {

	parser.parse();
	esriConfig.defaults.map.panDuration = 0;
	app.services = {
		items : []
	}
	app.curMap = "";
	var ext = new esri.geometry.Extent({
			"xmin" : -2500000,
			"ymin" : 130000,
			"xmax" : 2400000,
			"ymax" : 3700000,
			"spatialReference" : {
				"wkid" : 102039
			}
		});

	
	 app.maps=[];
	 app.legends=[];

	app.MapServices = [];
	var serviceRequest = esri.request({
			url : "http://gis.ers.usda.gov/arcgis/rest/services/ra_people/MapServer",
			content : {
				f : "json"
			},
			handleAs : "json",
			callbackParamName : "callback"
		});
	var store

	var selectObj
	app.mapCount = 0
		app.layers = {
		data : []
	}
	//////////////Sets up the rest of the app /////////////////////////
	serviceRequest.then(function (response) {
		app.layerlist = response.layers

			for (var l = 0, im = app.layerlist.length; l < im; l++) {
				app.layers.data.push(lang.mixin({
						id : app.layerlist[l].id
					}, lang.mixin({
							label : app.layerlist[l].name
						})));

			}
			store = new Memory({
				data : app.layers.data

			});
		console.log(store)
		console.log(app.layers)
		var os = new ObjectStore({
				objectStore : store
			});

		selectObj = new Select({
				name : "select",
				store : os
			}, "select");

		selectObj.startup()
 
		selectObj.on("change", function () {
			var map
			var changeMap
			var changeLegend
			console.log("value " + app.curMap)
			if (app.curMap == "map1" || app.curMap == "map0" || app.curMap == "map2") {
				
				for (x=0,xm=app.maps.length;x<xm;x++){
					if (app.curMap==app.maps[x].id){
						changeMap = app.maps[x]
						changeLegend=app.legends[x]
						
						
					}
					
					
				}
			changeMap.removeLayer(changeMap.getLayer("varLayer"))
				var varLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://gis2.ers.usda.gov/arcgis/rest/services/ra_people/MapServer", {
							"id" : "varLayer"
						});
				
					varLayer.setVisibleLayers([dijit.byId('select').get("value")]);
					changeMap.addLayer(varLayer,1)
					changeLegend.refresh([{layer:varLayer}]);
					
					
				//	document.getElementById('title' + app.curMap).innerHTML = dijit.byId('select').get("displayedValue")
					dijit.byId("select"+app.curMap).set("checked", false)
					app.curMap="no"
					console.log(app.curMap)
				

				 } else {
					 
				if (app.mapCount < 3) {
					//	console.log(app.mapCount)
					//var node = dojo.create("div"); 
					
					//object["variablename"]
					
						
					map= new esri.Map("map" + app.mapCount, {
							extent : ext,
							sliderStyle : "small",
							showAttribution : false,
							logo : false,
							navigationMode : "classic"
						});	
						
					
					
				

					console.log(dijit.byId('select').get("displayedValue"))
					var varLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://gis2.ers.usda.gov/arcgis/rest/services/ra_people/MapServer", {
							"id" : "varLayer"
						});
				
					varLayer.setVisibleLayers([this.get("value")]);
				
					var refLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://gis2.ers.usda.gov/arcgis/rest/services/reference2/MapServer", {
							"id" : "refLayer"
						});
					var tiled = new esri.layers.ArcGISDynamicMapServiceLayer("http://gis2.ers.usda.gov/arcgis/rest/services/background/MapServer", {
							"id" : "background"
						});
					map.addLayer(tiled);
					map.addLayer(varLayer);
					map.addLayer(refLayer);
			if (app.maps.length<1){
				map.on("extent-change", function(evt){
						 var extent = evt.extent,
      zoomed = evt.levelChange;
	  var mapId= evt.target.id
	 // console.log(mapExtentChange)
	  for(x=0,xmaps= app.maps.length;x<xmaps;x++){
							//console.log("current " + map.id)
							var mp = app.maps[x]
							if(mp.extent==extent){
								
							}
							else{
								dojo.hitch(mp,mp.setExtent(extent))
				//mp.setExtent(extent)
						//	mp.setExtent(newExt)
						//mapExtentChange.remove()
						}
	  }
					}) 
				
 
			}
		/*	map.on("pan-end", function(){
				var newExt= map.extent
						//console.log(newExt)
						for(x=0,xmaps= app.maps.length;x<xmaps;x++){
							//console.log("current " + map.id)
							var mp = app.maps[x]
							if(map.id==mp.id){
								
							}
							else{
								//dojo.hitch(mp,mp.setExtent(newExt))
					dojo.hitch(mp,mp.setExtent(newExt))
				
							}
						}
				
			}); */
			
			

//var mapExtentChange = map.on("extent-change", changeHandler);
//var mapPanChange= map.on("pan-complete", changeHandler)



					
					/////////LEGEND///////////
					var legendDijit = new Legend({
                    map: map,
					 layerInfos: [{layer: varLayer}]
                }, "legendmap" + app.mapCount);
                legendDijit.startup();
					app.maps.push(map);
					app.legends.push(legendDijit)
					////////////////////////////////////////////////////////////////
					
					//Radio button///
					var radio = new RadioButton({
							checked : false,
							value : "map" + app.mapCount,
							name : "change",
						}, "selectmap" + app.mapCount)
						$("#selectmap" + app.mapCount).css("visibility", "visible")
						radio.on("change", function (isChecked) {
							if(isChecked){

							app.curMap = this.value.toString();
							}

						})
						radio.startup()
					
					//
						//$().show()
						//radio.set("visibility","visible")
						$("#radioLabel" + app.mapCount).toggleClass('radioLabelVisible')

					//	document.getElementById('titlemap' + app.mapCount).innerHTML = dijit.byId('select').get("displayedValue")
						// app.mapCount=app.mapCount+1
						app.mapCount++
				} else {}
			}
			//console.log(change)
			

		

		})
	});
function changeHandler(evt){
	console.log(evt)

  // ... Do something ...

  // in some cases, you may want to disconnect the event listener
 // ;
}
})
