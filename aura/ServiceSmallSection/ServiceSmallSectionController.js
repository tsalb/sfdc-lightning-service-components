({
  handleUpdateMailingAddress : function(component, event, helper) {
    var contactList = component.get("v.contacts");

    component.find("service_small").updateMultiContactAddress(
      contactList,
      component.get("v.contactMailingStreet"),
      component.get("v.contactMailingCity"),
      component.get("v.contactMailingState"),
      component.get("v.contactMailingZip"),
      $A.getCallback(function(error, data) {
        if (data) {
          component.find("eventService_small").fireAppEvent("CONTACTS_UPDATED", contactList[0].AccountId);
        } else {
          // Fail silently
          console.log(error);
        }
      })
    );
  },
  handleApplicationEvent : function(component, event, helper) {
    var params = event.getParams();

    if (params.appEventKey == "CONTACTS_SELECTED") {
      component.set("v.contacts", params.appEventValue);
    }
  },
})