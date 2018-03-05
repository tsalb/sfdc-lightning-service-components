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
    var tableColumns = [
      {
        label: "Name",
        fieldName: "Name",
        type: "text",
        initialWidth: 130
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
        initialWidth: 200
      },
      {
        label: "City",
        fieldName: "MailingCity",
        type: "text",
        initialWidth: 100
      },
      {
        label: "State",
        fieldName: "MailingState",
        type: "text",
        initialWidth: 60
      },
      {
        label: "Zip",
        fieldName: "MailingPostalCode",
        type: "text",
        initialWidth: 90
      }
    ];
    return tableColumns;
  },
})