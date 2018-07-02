({
  handleOpenComponentModal : function(component, event, helper) {
    let selectedArr = component.find("searchTable").getSelectedRows();
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
          contactList: selectedArr
        },
        "c.handleUpdateMultiAddress",
        "Update"
      );
    }
  },
  handleApplicationEvent : function(component, event, helper) {
    let params = event.getParams();
    switch(params.appEventKey) {
      case "ACCOUNT_ID_SELECTED": // fallthrough
      case "CONTACTS_UPDATED":
        helper.loadContactTable(component, params.appEventValue);
        break;
      case "HEADER_CLEARTABLE":
        component.set("v.tableData", null);
        break;
    }
  },
})