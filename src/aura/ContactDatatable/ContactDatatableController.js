({
  handleRowAction: function (component, event, helper) {
    let action = event.getParam('action');
    let row = event.getParam('row');
    switch (action.name) {
      case 'clear_address':
        let configObject = {
          recordId: row["Id"],
          fieldUpdates: {
            "MailingStreet": null,
            "MailingCity": null,
            "MailingState": null,
            "MailingPostalCode": null,
            "MailingCountry": null
          }
        }
        helper.quickUpdateService(component).LDS_Update(
          configObject,
          $A.getCallback((saveResult) => {
            switch(saveResult.state.toUpperCase()) {
              case "SUCCESS":
                helper.messageService(component).showToast(null, "Cleared Mailing Address.", "success");
                helper.loadContactTable(component, row["AccountId"]);
                break;
              case "ERROR":
                helper.messageService(component).showToast(
                  null,
                  "Error Clearing Mailing Address: "+JSON.stringify(saveResult.error),
                  "error",
                  10000,
                  "sticky"
                );
                break;
            }
          })
        );
        break;
    }
  },
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
        "c:ContactAddressForm",
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