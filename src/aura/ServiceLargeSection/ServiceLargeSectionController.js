({
  handleOpenComponentModal : function(component, event, helper) {
    var selectedArr = component.find("searchTable").getSelectedRows();

    if ($A.util.isEmpty(selectedArr)) {
      helper.messageService(component).showToast(
        null,
        "Please choose at least one Contact.",
        "info"
      );
    } else {
      helper.messageService(component).modal(
        "update-address-modal",
        "Update Address: "+selectedArr.length+" Row(s)",
        "c:ServiceSmallSection",
        {
          "contactList": selectedArr
        },
        "c.handleUpdateMultiAddress",
        "Update"
      );
    }
  },
  handleApplicationEvent : function(component, event, helper) {
    var params = event.getParams();

    switch(params.appEventKey) {
      case "ACCOUNT_ID_SELECTED":
      case "CONTACTS_UPDATED":
        var tableColumns = helper.getTableColumnDefinition();

        helper.service(component).fetchContactsByAccountId(
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