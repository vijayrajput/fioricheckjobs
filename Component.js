// define a root UI component that exposes the main view
jQuery.sap.declare("com.sap.sdc.hcp.bootcamp.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ui.core.routing.History");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");

sap.ui.core.UIComponent.extend("com.sap.sdc.hcp.bootcamp.Component", {
	metadata: {
		"name": "fioricheckjobs",
		"version": "1.1.0-SNAPSHOT",
		"library": "com.sap.sdc.hcp.bootcamp",
		"includes": ["css/fullScreenStyles.css"],
		"dependencies": {
			"libs": ["sap.m", "sap.ui.layout"],
			"components": []
		},
		"config": {
			resourceBundle: "i18n/messageBundle.properties",
			serviceConfig: {
				name: "odata.srv",
				serviceUrl: "/BootCampDestination/JobEnrollmentDemo/odata.srv/"
			}
		},
		routing: {
			// The default values for routes
			config: {
				"viewType": "XML",
				"viewPath": "com.sap.sdc.hcp.bootcamp.view",
				"targetControl": "fioriContent", // This is the control in which new views are placed
				"targetAggregation": "pages", // This is the aggregation in which the new views will be placed
				"clearTarget": false
			},
			routes: [{
				pattern: "",
				name: "main",
				view: "Master"
			}, {
				name: "details",
				view: "Details",
				pattern: "{entity}"
			}]
		}
	},

	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent: function() {
		var oViewData = {
			component: this
		};

		return sap.ui.view({
			viewName: "com.sap.sdc.hcp.bootcamp.view.Main",
			type: sap.ui.core.mvc.ViewType.XML,
			viewData: oViewData
		});
	},

	init: function() {
		// call super init (will call function "create content")
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var sRootPath = jQuery.sap.getModulePath("com.sap.sdc.hcp.bootcamp");
		sRootPathcheckjobs = sRootPath;
		// The service URL for the oData model 
		var oServiceConfig = this.getMetadata().getConfig().serviceConfig;
		var sServiceUrl = oServiceConfig.serviceUrl;

		// the metadata is read to get the location of the i18n language files later
		var mConfig = this.getMetadata().getConfig();
		this._routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter(), this._bRouterCloseDialogs);

		// create oData model
		this._initODataModel(sServiceUrl);

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: [sRootPath, mConfig.resourceBundle].join("/")
		});
		this.setModel(i18nModel, "i18n");
		
		// set userService model
		var userModel = new sap.ui.model.json.JSONModel("/BootCampDestination/JobEnrollmentDemo/GetUserAttributes");
		userModel.setDefaultBindingMode("OneWay");
		this.setModel(userModel, "userapi");
	

		// initialize router and navigate to the first page
		this.getRouter().initialize();

	},

	exit: function() {
		this._routeMatchedHandler.destroy();
	},

	// This method lets the app can decide if a navigation closes all open dialogs
	setRouterSetCloseDialogs: function(bCloseDialogs) {
		this._bRouterCloseDialogs = bCloseDialogs;
		if (this._routeMatchedHandler) {
			this._routeMatchedHandler.setCloseDialogs(bCloseDialogs);
		}
	},

	// creation and setup of the oData model
	_initODataModel: function(sServiceUrl) {
		jQuery.sap.require("com.sap.sdc.hcp.bootcamp.util.messages");
		var oConfig = {
			metadataUrlParams: {},
			json: true,
			// loadMetadataAsync : true,
			defaultBindingMode: "TwoWay",
			defaultCountMode: "Inline",
			useBatch: true
		};
		var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, oConfig);
		oModel.attachRequestFailed(null, com.sap.sdc.hcp.bootcamp.util.messages.showErrorMessage);
		this.setModel(oModel);
	}
});