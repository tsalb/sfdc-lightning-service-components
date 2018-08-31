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
  quickUpdateService : function(component) {
    return component.find("quickUpdateService");
  },
  getTableColumnDefinition : function () {
    let tableColumns = [
      {
        label: "Name",
        fieldName: "Name",
        type: "text",
        initialWidth: 110
      },
      {
        label: "Email",
        fieldName: "Email",
        type: "email",
        initialWidth: 170
      },
      {
        label: "Phone",
        fieldName: "Phone",
        type: "phone",
        initialWidth: 130
      },
      {
        label: "Street",
        fieldName: "MailingStreet",
        type: "text",
      },
      {
        label: "City",
        fieldName: "MailingCity",
        type: "text",
      },
      {
        label: "State",
        fieldName: "MailingState",
        type: "text",
      },
      {
        label: "Zip",
        fieldName: "MailingPostalCode",
        type: "text",
      },
      {
        label: "Country",
        fieldName: "MailingCountry",
        type: "text",
      },
      {
        type: 'button',
        initialWidth: 135,
        typeAttributes: {
          label: 'Clear Address',
          name: 'clear_address',
          title: 'Click to clear out Mailing Address'
        }
      },
      {
        type: 'button',
        initialWidth: 130,
        typeAttributes: {
          label: 'View Cases',
          name: 'view_cases',
          title: 'Click to view all cases against this Contact'
        }
      },
    ];
    return tableColumns;
  },
  clearMailingAddressWithLightningDataService : function(component, row) {
    let _self = this;
    let configObject = { // QuickUpdateService only expects this object with recordId and fieldUpdates properties
      recordId: row["Id"],
      fieldUpdates: {
        "MailingStreet": null,
        "MailingCity": null,
        "MailingState": null,
        "MailingPostalCode": null,
        "MailingCountry": null
      }
    }
    _self.quickUpdateService(component).LDS_Update(
      configObject,
      $A.getCallback((saveResult) => {
        switch(saveResult.state.toUpperCase()) {
          case "SUCCESS":
            _self.messageService(component).showToast(null, "Cleared Mailing Address.", "success");
            _self.loadContactTable(component, row["AccountId"]);
            break;
          case "ERROR":
            _self.messageService(component).showToast(
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
  },
  openViewCasesModal : function(component, row) {
    let _self = this;
    _self.messageService(component).bodyModalLarge(
      "view-cases-modal",
      "Cases For "+row["Name"],
      "c:CaseDatatable",
      {
        contactRecordId: row["Id"]
      }
    );
  },
  loadContactTable : function(component, accountId) {
    let _self = this;
    _self.service(component).fetchContactsByAccountId(
      accountId,
      $A.getCallback((error, data) => {
        if (!$A.util.isUndefinedOrNull(data)) {
          component.set("v.tableData", data);
          component.set("v.tableColumns", _self.getTableColumnDefinition());
        } else {
          if (!$A.util.isUndefinedOrNull(error) && error[0].hasOwnProperty("message")) {
            _self.messageService(component).showToast(null, error[0].message, "error");
          }
        }
      })
    );
  },
})