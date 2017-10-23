({
  doInit: function (component) {
    var service = component.find("service_header");
    var eventService = component.find("eventService_header");

    service.fetchAccountCombobox(
      $A.getCallback(function(error, data) {
        // This returns whatever datatype is specified in the controller
        if (data) {
          var parsedData = JSON.parse(data);
          component.set("v.topAccounts", parsedData.items);
        } else {
          eventService.utilShowToast(
            "error",
            "No Accounts in org!",
            "error"
          );
        }
      })
    );
  },
  handleAccountOptionSelected : function(component, event) {
    var selectedOptionValue = event.getParam("value");

    component.find("eventService_header").fireAppEvent("ACCOUNT_ID_SELECTED", selectedOptionValue);
  },
  handleClearTableOnly : function(component) {
    component.find("eventService_header").fireAppEvent("HEADER_CLEARTABLE");
  },
})