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
    var _self = this;
    var contactList = component.get("v.contactList");

    _self.service(component).updateMultiContactAddress(
      contactList,
      component.get("v.contactMailingStreet"),
      component.get("v.contactMailingCity"),
      component.get("v.contactMailingState"),
      component.get("v.contactMailingZip"),
      $A.getCallback(function(error, data) {
        if (data) {
          _self.messageService(component).showToast(null, "Updated Successfully", "success");
          _self.eventService(component).fireAppEvent("CONTACTS_UPDATED", contactList[0].AccountId);
          _self.messageService(component).find("overlayLib").notifyClose(); // must be last, as this destroys this component
        } else {
          if (error.length > 0 && error[0].hasOwnProperty('message')) {
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