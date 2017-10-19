({
  handleAccountLookupChange : function(component, event, helper) {
    // I suffix my service compoennts because it's possible to shorthand this.
    // so when shorthanding, you can still read specifically which service
    // component you're calling. I found that this also avoided some issues with
    // component.find("service") that cropped up when nesting components that had 
    // the same service component
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
          eventService.utilShowToast(
            "Error",
            "Fetching Account: "+error[0].message,
            "error"
          );
        }
      })
    );
  },
  handleClearTableOnly : function(component, event, helper) {
    component.find("eventService_header").fireAppEvent("HEADER_CLEARTABLE");
  },
})