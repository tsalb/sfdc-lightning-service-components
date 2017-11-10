({
  handleOpenComponentModal : function(component) {
    var msgService = component.find("messageService_large");
    var selectedArr = component.find("searchTable").getSelectedRows();

    msgService.modal(
      "update-address-modal",
      "Update Address: "+selectedArr.length+" Row(s)",
      "c:ServiceSmallSection",
      {
        "contactList": selectedArr
      },
      "c.handleUpdateMultiAddress",
      "Update"
    );
  },
  handleApplicationEvent : function(component, event, helper) {
    var params = event.getParams();

    switch(params.appEventKey) {
      case "ACCOUNT_ID_SELECTED":
      case "CONTACTS_UPDATED":
        var service = component.find("service_large");
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
        break;
      case "HEADER_CLEARTABLE":
        component.set("v.tableData", null);
        break;
    }
  },
})