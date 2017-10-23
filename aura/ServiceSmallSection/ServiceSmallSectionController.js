({
  handleUpdateMailingAddress : function(component) {
    var contactList = component.get("v.contacts");
    var eventService = component.find("eventService_small");

    component.find("service_small").updateMultiContactAddress(
      contactList,
      component.get("v.contactMailingStreet"),
      component.get("v.contactMailingCity"),
      component.get("v.contactMailingState"),
      component.get("v.contactMailingZip"),
      $A.getCallback(function(error, data) {
        if (data) {
          eventService.fireAppEvent("CONTACTS_UPDATED", contactList[0].AccountId);
        } else {
          console.log(error);
          // Fail gracefully
          if (error.length > 0 && error[0].hasOwnProperty('message'))
          {
            eventService.utilShowToast(
              "error",
              error[0].message,
              "error"
            );
          }
        }
      })
    );
  },
  handleApplicationEvent : function(component, event) {
    var params = event.getParams();

    if (params.appEventKey == "CONTACTS_SELECTED") {
      component.set("v.contacts", params.appEventValue);
    }
  },
})