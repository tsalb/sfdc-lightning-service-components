({
  handleAccountLookupChange : function(component, event, helper) {
    var service = component.find("service_header");
    var eventService = component.find("eventService_header");
    var lookedUpAccountId = component.get("v.con.AccountId");

    if (!lookedUpAccountId) {
      component.set("v.acc", null);
      eventService.fireAppEvent("HEADER_ACCOUNT_BLANK");
      return false;
    }

    service.fetchAccount(
      lookedUpAccountId,
      $A.getCallback(function(error, data) {
        // This returns whatever datatype is specified in the controller
        if (data) {
          component.set("v.acc", data);
          eventService.utilShowToast(null, "Account Found!", "info");
          eventService.fireAppEvent("HEADER_ACCOUNT_SET", lookedUpAccountId);
        } else {
          // Let inputField handle the error
        }
      })
    );
  },
  handleClearTableOnly : function(component, event, helper) {
    component.find("eventService_header").fireAppEvent("HEADER_CLEARTABLE");
  },
})