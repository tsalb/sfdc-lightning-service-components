({
  handleRowSelection : function(component, event, helper) {
    var contactArr = component.find("searchTable").getSelectedRows();

    if (contactArr.length > 0) {
      component.set("v.rowSelected", true);

      // Just handle first selected for method demo
      component.find("smallSectionCard").loadContact(contactArr[0].Id);

    } else {
      component.set("v.rowSelected", false);
    }
  },
  handleApplicationEvent : function(component, event, helper) {
    var appEventKey = event.getParam("appEventKey");
    var appEventValue = event.getParam("appEventValue");

    if (appEventKey === "HEADER_ACCOUNT_SET") {
      // Short hand declaration here
      component.find("service_large").fetchContactsByAccountId(
        appEventValue,
        $A.getCallback(function(error, data) {
          // This returns whatever datatype is specified in the controller
          if (data) {
            component.set("v.tableData", data);
            component.set("v.tableColumns", helper.getTableColumnDefinition());
          } else {
            console.log(error);
            // This component doesn't have eventService so it can't fire the util modal
          }
        })
      );
    }
    if (appEventKey === "HEADER_ACCOUNT_BLANK" || appEventKey === "HEADER_CLEARTABLE") {
      component.set("v.tableData", null);
    }
  },
})