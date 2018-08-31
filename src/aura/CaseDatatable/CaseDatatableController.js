({
  doInit : function(component, event, helper) {
    let contactRecordId = [].concat(component.get("v.contactRecordId")); // guarantees array for idSet
    if (!$A.util.isUndefinedOrNull(contactRecordId)) {
      let tableRequest = {
        queryString: "SELECT "
                    +"Id, CaseNumber, CreatedDate, ClosedDate, Description, Comments, Status, Subject, Type "
                    +"FROM Case "
                    +"WHERE ContactId =: idSet "
                    +"ORDER BY CaseNumber ASC",
        bindVars: {
          idSet: contactRecordId,
        }
      }
      helper.tableService(component).fetchData(
        tableRequest,
        $A.getCallback((error, data) => {
          if (!$A.util.isUndefinedOrNull(data) && !$A.util.isEmpty(data)) {
            component.set("v.tableData", data.tableData);
            component.set("v.tableColumns", data.tableColumns);
          } else {
            if (!$A.util.isUndefinedOrNull(error) && error[0].hasOwnProperty("message")) {
              helper.messageService(component).showToast(null, error[0].message, "error");
            }
          }
        })
      );
    }
  }
})