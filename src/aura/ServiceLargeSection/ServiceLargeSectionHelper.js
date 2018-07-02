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
      }
    ];
    return tableColumns;
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
            _self.messageService(component).showToast(
              null,
              error[0].message,
              "error"
            );
          }
        }
      })
    );
  },
})