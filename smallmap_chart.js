require([
	'esri/map',
	'dojo/query',
	'esri/layers/QueryDataSource',
	'esri/dijit/Legend',
	'esri/dijit/Print',
	'esri/request',
	'esri/layers/ArcGISDynamicMapServiceLayer',
	'esri/layers/FeatureLayer',
	'esri/tasks/query',
	'esri/tasks/QueryTask',
	'esri/InfoTemplate',
	'esri/geometry/Extent',
	'esri/symbols/SimpleFillSymbol',
	'esri/symbols/SimpleLineSymbol',
	'esri/graphic',
	'esri/lang',
	'dojo/dom-style',
	'dijit/TooltipDialog',
	'dijit/popup',
	'esri/config',
	'esri/Color',
	'dojo/on',
	'dijit/registry',
	'dojo/_base/array',
	'dojo/parser',
	'esri/tasks/PrintTask',
	'esri/tasks/PrintTemplate',
	'dijit/DropDownMenu',
	'dijit/form/DropDownButton',
	'dijit/form/Button',
	'dijit/Menu',
	'dijit/MenuItem',
	'dojo/dom',
	'dojo/domReady!'
], function (
	Map,
	query,
	QueryDataSource,
	Legend,
	Print,
	esriRequest,
	ArcGISDynamicMapServiceLayer,
	FeatureLayer,
	Query,
	QueryTask,
	InfoTemplate,
	Extent,
	SimpleFillSymbol,
	SimpleLineSymbol,
	Graphic,
	esriLang,
	domStyle,
	TooltipDialog,
	dijitPopup,
	esriConfig,
	Color,
	on,
	registry,
	arrayUtils,
	parser,
	PrintTask,
	PrintTemplate,
	DropDownMenu,
	DropDownButton,
	Button,
	Menu,
	MenuItem,
	dom
) {
	parser.parse()
	let app = []
	/* **************************************************************
	 *     Grab the url variables to get the server, folder (if needed)
	 *     layer, and variable
	 *
	 *
	 ***************************************************************** */
	var featureLayer
	const newLeg = getUrlVars()['newLeg']
	const foldervar = getUrlVars()['folder']
	const servicevar = getUrlVars()['service']
	const layervar = getUrlVars()['layer']
	tItem = layervar
	pntLayer = layervar
	app.SelLayerIndex = layervar

	const fieldvar = getUrlVars()['field']
	let dfield = fieldvar

	const server = getUrlVars()['server']
	var gisServer

	if (server == 'test') {
		gisServer = 'http://azergva3aptkgis:6080/'
	} else {
		gisServer = 'http://gis.ers.usda.gov/'
	}
	// log(gisServer)
	var printTemplate = ['png', 'landscape', 'portrait']

	//  update the rest address if there is/is not a folder designation
	if (foldervar == '') {
		var requestLayer = esriRequest({
			url: gisServer +
				'arcgis/rest/services/' +
				servicevar +
				'/MapServer/' +
				layervar,
			content: {
				f: 'json'
			}
		})
	} else {
		/// ///////////////////////////////////////////////////////////////

		var requestLayer = esriRequest({
			url: gisServer +
				'arcgis/rest/services/' +
				foldervar +
				'/' +
				servicevar +
				'/MapServer/' +
				layervar,
			content: {
				f: 'json'
			}
		})
	}
	requestLayer.then(handleLayerInfo, handleLayerError)
	/************************************************************************************************************
	 *    grabs the attributes from the feature layer to use in the app
	 *    Gets used in the cntyLayer.on function
	 * **********************************************************************************************************/
	let flddata = []
	queryTaskMain = new QueryTask(
		gisServer + 'arcgis/rest/services/' + servicevar + '/MapServer/' + layervar
	)

	// initialize query
	queryMain = new Query()
	let data = []
	queryMain.outFields = ['cnty.Name', 'cnty.STATE_NAME', fieldvar]
	queryMain.returnGeometry = true
	queryMain.where = '1=1'
	queryTaskMain.execute(queryMain, function (results) {
		// console.log(results)

		data = results.features
		// console.log(Math.min(data.attributes[fieldvar]))

		for (x = 0; x < data.length; x = x + 1) {
			if (data[x].attributes[fieldvar] != null) {
				flddata.push(data[x].attributes[fieldvar])
			}
		}
		console.log(flddata)
		console.log(Math.min(...flddata))
		console.log(Math.max(...flddata))
		const maxData = Math.max(...flddata)
		const minData = Math.min(...flddata)

		createChart(minData, maxData)
	})
	// console.log(query)
	var content

	var backgroundURL =
		'https://gis.ers.usda.gov/arcgis/rest/services/background/MapServer'
	var refURL =
		'https://gis.ers.usda.gov/arcgis/rest/services/reference/MapServer'
	var backgroundLayer = new ArcGISDynamicMapServiceLayer(backgroundURL)
	var refLayer = new ArcGISDynamicMapServiceLayer(refURL)

	var dynamicLayerDataSource
	var content

	/*  Sets up print request */
	var printURL =
		'https://gis.ers.usda.gov/arcgis/rest/services/Printer/ExportWebMapDynamic/GPServer/Export%20Web%20Map'

	var ext = new esri.geometry.Extent({
		xmin: -2500000,
		ymin: 150000,
		xmax: 2400000,
		ymax: 3900000,
		spatialReference: {
			wkid: 102039
		}
	})

	/// ///////////////Go back to the main extent////////////////////
	on(dom.byId('US'), 'click', function () {
		app.map.setExtent(
			new esri.geometry.Extent({
				xmin: -2500000,
				ymin: 150000,
				xmax: 2400000,
				ymax: 3900000,
				spatialReference: {
					wkid: 102039
				}
			})
		)
	})

	app.map = new Map('mapDiv', {
		extent: ext,
		slider: true,
		sliderStyle: 'small',
		isScrollWheel: false,
		logo: false,
		showAttribution: false,
		zoom: 7
	})
	app.map.on('zoom-end', function () {
		// console.log(app.map)
	})
	app.map.infoWindow.resize(245, 125)
	app.map.addLayer(backgroundLayer)
	/// //////////Set up the mouse over dialog ///////////////////
	var dialog = new TooltipDialog({
		id: 'tooltipDialog',
		style: 'position: absolute; width: 100px; font: normal normal normal 6pt Helvetica;z-index:100'
	})

	dialog.startup()
	var highlightSymbol = new SimpleFillSymbol(
		SimpleFillSymbol.STYLE_SOLID,
		new SimpleLineSymbol(
			SimpleLineSymbol.STYLE_SOLID,
			new Color([255, 0, 0]),
			3
		),
		new Color([125, 125, 125, 0.35])
	)
	/// //////////////////////////////////////////////////////////////

	app.map.on('load', function () {
		//	app.map.graphics.enableMouseEvents();
		app.map.graphics.enableMouseEvents()
		app.map.graphics.on('mouse-out', closeDialog)
	})

	/* Create the FeatureLayers */
	createFlayer()

	// console.log(app.layerName)

	/// ///////////////////Legend////////////////////////////////////////////
	var legendTitle = app.layerName // remove 'ancestry' from field name
	legendDijit = new Legend({
			map: app.map,
			layerInfos: [{
				layer: featureLayer,
				title: legendTitle
			}]
		},
		'legend'
	)
	legendDijit.startup()
	legendDijit.set('layerInfos', [{
		layer: featureLayer,
		title: legendTitle
	}])

	/// //////////////////////////////////////////////////////////////////////
	/// /////////////////CREATE THE CHART /////////////////////////////////////

	function createChart(minData, maxData) {
		var ctx = document.getElementById('myChart').getContext('2d')
		var ldata = [0]
		app.myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['Red'], // ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
				datasets: [{
					label: 'Data',
					data: ldata,
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)'
						/* 'rgba(54, 162, 235, 0.2)',
					                     'rgba(255, 206, 86, 0.2)',
					                     'rgba(75, 192, 192, 0.2)',
					                     'rgba(153, 102, 255, 0.2)',
					                     'rgba(255, 159, 64, 0.2)' */
					],
					borderColor: [
						'rgba(255,99,132,1)'
						/*    'rgba(54, 162, 235, 1)',
					                        'rgba(255, 206, 86, 1)',
					                        'rgba(75, 192, 192, 1)',
					                        'rgba(153, 102, 255, 1)',
					                        'rgba(255, 159, 64, 1)' */
					],
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: false,
							min: minData,
							max: maxData
						}
					}]
				}
			}
		})
	}

	function handleLayerInfo(resp) {
		// (resp)
		app.clsCnt = legendDijit._surfaceItems.length + 1
		app.layerName = resp['name']
		var legInfo = resp.drawingInfo.renderer
		var parsedDesc = '' // JSON.parse(resp.description); // getting units from JSON, unfortunately, this line is duplicated for the layer list.
		app.unitsName = parsedDesc.units
	}

	function handleLayerError() {}

	/* Print tool creation */
	// this will need to be changed to add in
	function createPrintTask(layout, format, title) {
		// input parameters set in dropdown print menu

		// console.log(btnPrint)
		var tpId = pntLayer
		//	console.log(title)
		if (layout == 'MAP_ONLY') {
			var template = new esri.tasks.PrintTemplate()
			template.format = format
			template.layout = layout
			template.layoutOptions = {
				showAttribution: false
			}
			template.exportOptions = {
				width: 988,
				height: 670,
				dpi: 96
			}
		} else {
			var txtVar = 'http://ers.usda.gov' // THIS CAN BE A VARIABLE FROM THE CONFIG FILE
			var template = new esri.tasks.PrintTemplate()
			var legendLayer1 = new esri.tasks.LegendLayer()
			legendLayer1.layerId = featureLayer.id
			template.format = format
			template.layout = layout
			template.layoutOptions = {
				titleText: title,
				scalebarUnit: 'Miles',
				copyrightText: '',
				legendLayers: [legendLayer1],
				customTextElements: [{
						lgndUnit: 'Units: ' + app.unitsName
					},
					{
						documentationSrc: txtVar
					}
				],
				showAttribution: false
			}
			template.exportOptions = {
				dpi: 300
			}
		}
		template.preserveScale = true
		var params = new esri.tasks.PrintParameters()
		params.map = app.map
		params.template = template
		if (layout == 'USATriMap') {
			// This is not being used at the present time (alaska and hawaii insets)
			printTask = new esri.tasks.PrintTask(
				app.lSource +
				'Printer/Triapp.mapPrint/GPServer/AdvancedHighQualityPrinting'
			)
		} else {
			printTask = new esri.tasks.PrintTask(
				'https://gis.ers.usda.gov/arcgis/rest/services/Printer/ExportWebMapDynamic/GPServer/Export%20Web%20Map'
			)
		}

		printTask.execute(params, printResult, printTest)
		printTask.on('complete', function () {})
	}

	function printTest(error) {
		alert("There's a problem with the print tool. \nPlease try again later.")
		console.log(error)
	}

	function printResult(result) {
		var btnPrint = dijit.byId('printbtn')
		btnPrint.set('label', 'Print')
		// alert (result.url);
		if (result.url === '') {
			alert('error')
		}
		var currentTime = new Date()
		result.url += '?ts=' + currentTime.getTime()
		// count = count + 1
		// setTimeout(function(){alert("Hello")},10000);
		var a = document.createElement('a')
		var linkText = document.createTextNode('Click here to open printable map')
		a.appendChild(linkText)
		a.id = 'hyperL'
		a.href = result.url
		a.target = '_blank'
		document.body.appendChild(a)
		document.getElementById('hyperL').className = ''
		window.addEventListener('blur', function () {
			if (a.hasChildNodes()) {
				a.removeChild(linkText)
			}
		})
	}

	function printError(error) {
		alert(error)
		var btnPrint = dijit.byId('printbtn')
		btnPrint.set('label', 'Print')
	}

	/* New version of the Print Interface for the user */
	var menu = new DropDownMenu({
		style: 'display: none;'
	})

	var menuItem1 = new MenuItem({
		label: 'Image (png)',
		onClick: function () {
			title = app.layerName

			// This needs to change to map only, at some point
			createPrintTask('MAP_ONLY', 'png32')
		}
	})

	menu.addChild(menuItem1)

	var menuItem2 = new MenuItem({
		label: 'Landscape (pdf)',
		onClick: function () {
			title = app.layerName
			if (app.classCnt > 6) {
				// console.log("lots of classes");
				createPrintTask('LandscapeLarge', 'PDF', title)
			} else {
				createPrintTask('LandscapeComplex2', 'PDF', title)
			}
		}
	})

	menu.addChild(menuItem2)

	var menuItem3 = new MenuItem({
		label: 'Portrait (pdf)',
		onClick: function () {
			title = app.layerName
			if (app.classCnt > 6) {
				// console.log("lots of classes");
				createPrintTask('PortraitLarge', 'PDF', title)
			} else {
				createPrintTask('PortraitComplex2', 'PDF', title)
			}
		}
	})

	menu.addChild(menuItem3)

	menu.startup()

	var button = new dijit.form.DropDownButton({
		id: 'printbtn',
		label: 'Print',
		dropDown: menu
	})

	button.on('mouseout', function () {
		menu.hide
	})
	button.on('click', function () {
		button.set('label', 'Printing')
	})

	button.startup()

	dom.byId('print').appendChild(button.domNode)

	function myCallbackFunction(ioArgs) {
		// inspect ioArgs

		// or, change some query parameters if necessary
		//  ioArgs.content = ioArgs.content || {};
		// ioArgs.content.token = "ABCDEF123456";

		// don't forget to return ioArgs.
		return ioArgs
	}

	function getUrlVars() {
		var vars = {}
		var parts = window.location.href.replace(
			/[?&]+([^=&]+)=([^&]*)/gi,
			function (m, key, value) {
				vars[key] = value
			}
		)
		return vars
	}

	function closeDialog() {
		app.map.graphics.clear()
		dijitPopup.close(dialog)
	}

	function createFlayer() {
		if (foldervar == '') {
			featureLayer = new FeatureLayer(
				gisServer +
				'arcgis/rest/services/' +
				servicevar +
				'/MapServer/' +
				layervar, {
					mode: FeatureLayer.MODE_SNAPSHOT,
					id: 'dataLayer',
					outFields: ['cnty.Name', 'cnty.STATE_NAME', fieldvar]
				}
			)
		} else {
			featureLayer = new FeatureLayer(
				gisServer +
				'arcgis/rest/services/' +
				foldervar +
				'/' +
				servicevar +
				'/MapServer/' +
				layervar, {
					mode: FeatureLayer.MODE_SNAPSHOT,
					id: 'dataLayer',
					outFields: ['cnty.Name', 'cnty.STATE_NAME', fieldvar]
				}
			)
		}
		featureLayer.on('mouse-over', function (evt) {
			app.map.graphics.clear()
			attr = evt.graphic.attributes

			var content =
				'<b>' +
				attr['cnty.Name'] +
				',' +
				attr['cnty.STATE_NAME'] +
				'</b><br>' +
				'Value: ' +
				attr[fieldvar]
			var highlightGraphic = new Graphic(evt.graphic.geometry, highlightSymbol)
			app.map.graphics.add(highlightGraphic)
			// var myLineChart = document.getElementById(myChart).getContext('2d')
			app.myChart.data.datasets[0].data[0] = attr[fieldvar]
			app.myChart.update()
			// var myChart = document.getElementById('myChart')
			// removeData(myChart)
			dialog.setContent(content)

			domStyle.set(dialog.domNode, 'opacity', 0.85)
			dijitPopup.open({
				popup: dialog,
				x: evt.pageX,
				y: evt.pageY
			})
		})

		if (newLeg == 'static') {
			var stLayer = new FeatureLayer(refURL + '/0', {
				mode: FeatureLayer.MODE_SNAPSHOT
			})
			var cntyLayer = new FeatureLayer(refURL + '/2', {
				mode: FeatureLayer.MODE_SNAPSHOT,
				outFields: ['NAME', 'STATE_NAME']
			})

			cntyLayer.on('mouse-over', function (evt) {
				app.map.graphics.clear()
				attr = evt.graphic.attributes
				var cntyname = attr['NAME']
				var st = attr['STATE_NAME']
				var value
				for (i = 0; i < data.length; i++) {
					if (
						data[i].attributes['cnty.Name'] == cntyname &&
						data[i].attributes['cnty.STATE_NAME'] == st
					) {
						value = data[i].attributes[fieldvar]
					}
				}
				app.myChart.data.datasets[0].data[0] = value
				app.myChart.update()
				content = '<b>' + cntyname + ',' + st + '</b><br>' + value
				var highlightGraphic = new Graphic(
					evt.graphic.geometry,
					highlightSymbol
				)
				app.map.graphics.add(highlightGraphic)

				domStyle.set(dialog.domNode, 'opacity', 0.85)
				dialog.setContent(content)
				dijitPopup.open({
					popup: dialog,
					x: evt.pageX,
					y: evt.pageY
				})

				// });
			})

			//
			app.map.addLayer(featureLayer)
			app.map.addLayer(cntyLayer)
			app.map.addLayer(stLayer)
		}
	}

	function runQuery(cntyname, st, fieldvar) {}

	function addData(chart, label, data) {
		chart.data.labels.push(label)
		chart.data.datasets.forEach(dataset => {
			dataset.data.push(data)
		})
		chart.update()
	}

	function removeData(chart) {
		chart.data.labels.pop()
		chart.data.datasets.forEach(dataset => {
			dataset.data.pop()
		})
		chart.update()
	}
})