({
  doInit: function (component) {
    helper.service(component).fetchAccountCombobox(
      $A.getCallback(function(error, data) {
        // This returns whatever datatype is specified in the controller
        if (data) {
          var parsedData = JSON.parse(data);
          component.set("v.topAccounts", parsedData.items);
        } else {
          helper.messageService(component).showToast(
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

    helper.eventService(component).fireAppEvent("ACCOUNT_ID_SELECTED", selectedOptionValue);
  },
  handleClearTableOnly : function(component) {
    helper.eventService(component).fireAppEvent("HEADER_CLEARTABLE");
  },
})