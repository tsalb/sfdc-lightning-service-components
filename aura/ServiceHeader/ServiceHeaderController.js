({
  doInit: function (component) {
    var service = component.find("service_header");
    var eventService = component.find("eventService_header");
    var msgService = component.find("messageService_header");

    service.fetchAccountCombobox(
      $A.getCallback(function(error, data) {
        // This returns whatever datatype is specified in the controller
        if (data) {
          var parsedData = JSON.parse(data);
          component.set("v.topAccounts", parsedData.items);
        } else {
          msgService.showToast(
            null,
            "No Accounts in org!",
            "error"
          );
        }
      })
    );
  },
  handleAccountOptionSelected : function(component, event) {
    var selectedOptionValue = event.getParam("value");
    var eventService = component.find("eventService_header");

    eventService.fireAppEvent("ACCOUNT_ID_SELECTED", selectedOptionValue);
  },
  handleClearTableOnly : function(component) {
    var eventService = component.find("eventService_header");

    eventService.fireAppEvent("HEADER_CLEARTABLE");
  },
})