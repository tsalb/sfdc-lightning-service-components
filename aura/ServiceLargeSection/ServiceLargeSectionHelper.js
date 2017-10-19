({
  getTableColumnDefinition : function () {
    var tableColumns = [
      {
        label: "Name",
        fieldName: "Name",
        type: "text",
        initialWidth: 200
      },
      {
        label: "Email",
        fieldName: "Email",
        type: "email",
        initialWidth: 300
      },
      {
        label: "Phone",
        fieldName: "Phone",
        type: "phone",
        initialWidth: 200
      },
    ];
    return tableColumns;
  },
})