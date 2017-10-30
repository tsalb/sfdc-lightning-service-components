({
  updateMultiAddress : function(component) {
    var service = component.find("service_small");
    var eventService = component.find("eventService_small");
    var msgService = component.find("messageService_small");
    var contactList = component.get("v.contactList");

    service.updateMultiContactAddress(
      contactList,
      component.get("v.contactMailingStreet"),
      component.get("v.contactMailingCity"),
      component.get("v.contactMailingState"),
      component.get("v.contactMailingZip"),
      $A.getCallback(function(error, data) {
        if (data) {
          msgService.showToast(null, "Updated Successfully", "success");
          eventService.fireAppEvent("CONTACTS_UPDATED", contactList[0].AccountId);
          msgService.find("overlayLib").notifyClose(); // must be last, as this destroys this component
        } else {
          if (error.length > 0 && error[0].hasOwnProperty('message')) {
            msgService.showToast(
              null,
              error[0].message,
              "error"
            );
          }
        }
      })
    );
  }
})