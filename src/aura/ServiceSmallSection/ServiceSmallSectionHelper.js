({
  service : function(component) {
    return component.find("service");
  },
  messageService : function(component) {
    return component.find("messageService");
  },
  eventService : function(component) {
    return component.find("eventService");
  },
  updateMultiAddress : function(component) {
    let _self = this;
    let contactList = component.get("v.contactList");
    _self.service(component).updateMultiContactAddress(
      contactList,
      component.get("v.contactMailingStreet"),
      component.get("v.contactMailingCity"),
      component.get("v.contactMailingState"),
      component.get("v.contactMailingZip"),
      $A.getCallback((error, data) => {
        if (data) {
          _self.messageService(component).showToast(null, "Updated Successfully", "success");
          _self.eventService(component).fireAppEvent("CONTACTS_UPDATED", contactList[0].AccountId);
          _self.messageService(component).find("overlayLib").notifyClose(); // must be last, as this destroys this component
        } else {
          if (!$A.util.isUndefinedOrNull(error) && error[0].hasOwnProperty("message")) {
            _self.messageService(component).showToast(
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