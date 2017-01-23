jQuery.sap.require("sap.ca.ui.model.type.Date");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
sap.ui.core.mvc.Controller.extend("com.sap.sdc.hcp.bootcamp1.view.Details", {
	_oItemTemplate: null,
	_oNavigationTable: null,
	_sItemPath: "",
	_sNavigationPath: "",
	onInit: function() {
		this._oView = this.getView();
		this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
		this._oRouter = this._oComponent.getRouter();
		this._oNavigationTable = this.byId("navigationTable");
		this._oItemTemplate = this.byId("navigationListItem").clone();
		// Get Context Path for Page 2 Screen
		this._oRouter.attachRoutePatternMatched(this._onRoutePatternMatched, this);
	},
	// Bind Review Table using oData Reviews Entity
	_bindNavigationTable: function(sURL) {
		this._oNavigationTable.bindItems({
			path: sURL,
			template: this._oItemTemplate
		});
	},
	_onRoutePatternMatched: function(oEvent) {
		if (oEvent.getParameter("name") !== "details") {
			return;
		}
		this._sItemPath = "/" + oEvent.getParameters().arguments.entity;
		this._sNavigationPath = this._sItemPath + "/" + "";
		// Bind Object Header and Form using oData
		this.byId("DetailsPage").bindElement({
			path: this._sItemPath
		});
		// Bind Review Table using oData Reviews Entity
		this._bindNavigationTable(this._sNavigationPath);
	},
	onNavBack: function() {
		window.history.go(-1);
	},
	/**
	 *@memberOf com.sap.sdc.hcp.bootcamp1.view.Details
	 */
	applyJob: function(oEvent) {

		var oData = {
			"JOBID": oEvent.getSource().getModel().getProperty(oEvent.getSource().getBindingContext().getPath()).JOBID,
			"PERSONID": this.getView().getModel('userapi').getProperty("/name"),
			"CREATED_ON": new Date(),
			"EMAIL": this.getView().getModel('userapi').getProperty("/email"),
			"FIRST_NAME": this.getView().getModel('userapi').getProperty("/firstName"),
			"LAST_NAME": this.getView().getModel('userapi').getProperty("/lastName"),
			"LOCATION": this.getView().getModel('userapi').getProperty("/country")
		};
		this.getView().getModel().create("/Enrollments", oData, {
			success: function() {
				sap.m.MessageToast.show("Enrollment Successfully");
			},
			error: function(oError) {
				sap.m.MessageToast.show("Already Enrolled");
			}
		});
	}
});
