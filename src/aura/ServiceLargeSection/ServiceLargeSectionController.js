({
  handleOpenComponentModal : function(component) {
    var msgService = component.find("messageService_large");
    var selectedArr = component.find("searchTable").getSelectedRows();
    var modalMainActionReference = component.getReference("c.handleModalSaveEvent");

    msgService.modal(
      "update-address-modal",
      "Update Address: "+selectedArr.length+" Row(s)",
      "c:ServiceSmallSection",
      modalMainActionReference,
      "Update"
    );
  },
  // If we need to send data from this component to the modal, we seem to have to do it via application event 
  // since there is a different hierarchy. component.find() from either this component or the modal cannot find one another
  handleModalSaveEvent : function(component, event) {
    var eventService = component.find("eventService_large");
    var selectedArr = component.find("searchTable").getSelectedRows();

    eventService.fireAppEvent("CONTACT_ROWS", JSON.stringify(selectedArr));
  },
  handleApplicationEvent : function(component, event, helper) {
    var params = event.getParams();
    var service = component.find("service_large");

    if (params.appEventKey == "ACCOUNT_ID_SELECTED" || params.appEventKey == "CONTACTS_UPDATED") {
      var tableColumns = helper.getTableColumnDefinition();

      service.fetchContactsByAccountId(
        params.appEventValue,
        $A.getCallback(function(error, data) {
          if (data) {
            component.set("v.tableData", data);
            component.set("v.tableColumns", tableColumns);
          } else {
            // Fail silently
            console.log(error);
          }
        })
      );
    }
    if (params.appEventKey == "HEADER_CLEARTABLE") {
      component.set("v.tableData", null);
    }
  },
})