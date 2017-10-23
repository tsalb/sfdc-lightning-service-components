({
  handleRowSelection : function(component) {
    var selectedArr = component.find("searchTable").getSelectedRows();
    
    component.find("eventService_large").fireAppEvent("CONTACTS_SELECTED", selectedArr);
  },
  handleApplicationEvent : function(component, event, helper) {
    var params = event.getParams();

    if (params.appEventKey == "ACCOUNT_ID_SELECTED" || params.appEventKey == "CONTACTS_UPDATED") {
      component.find("service_large").fetchContactsByAccountId(
        params.appEventValue,
        $A.getCallback(function(error, data) {
          if (data) {
            component.set("v.tableData", data);
            component.set("v.tableColumns", helper.getTableColumnDefinition());
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