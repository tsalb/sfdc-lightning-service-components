({
  handleModalStyleSelect : function(component, event, helper) {
    var selectedMenuItemValue = event.getParam("value");
    component.set("v.modalStyle", selectedMenuItemValue);

    var menuItemArr = component.find("menuItemBtn");

    for (var menuItem of menuItemArr) {
      if (selectedMenuItemValue != menuItem.get("v.value")) {
        menuItem.set("v.checked", false);
      } else {
        menuItem.set("v.checked", true);
      }
    }
  },
  handleUpdateMailingAddress : function(component) {
    var selectedArr = component.find("searchTable").getSelectedRows();
    var modalStyle = component.get("v.modalStyle");

    if (modalStyle == "utilmodal") {    
      component.find("smallSection").set("v.contacts", selectedArr);
      component.set("v.selectedArrLength", selectedArr.length);
      component.find("smallSectionModal").open();
    } else if (modalStyle == "overlaylibrary") {
      component.find("eventService_large").utilShowToast(
        null,
        "This is coming soon.",
        "info"
      );
    }
  },
  handleSave : function(component, event) {
    component.find("smallSectionModal").saveAction(event.getSource().get("v.value"));
  },
  handleApplicationEvent : function(component, event, helper) {
    var params = event.getParams();

    if (params.appEventKey == "ACCOUNT_ID_SELECTED" || params.appEventKey == "CONTACTS_UPDATED") {
      var tableColumns = helper.getTableColumnDefinition();

      component.find("service_large").fetchContactsByAccountId(
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