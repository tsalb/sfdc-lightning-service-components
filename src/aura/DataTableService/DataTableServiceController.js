({
  handleFetchData : function(component, event, helper) {
    let params = event.getParam("arguments");
    let action = component.get("c.createTableCache");
    if (!$A.util.isUndefinedOrNull(params.tableRequest.setStorable)) {
      if ($A.util.getBooleanValue(params.tableRequest.setStorable)) {
        action.setStorable();
      }
    }
    if (!$A.util.isUndefinedOrNull(params.tableRequest.setBackground)) {
      if ($A.util.getBooleanValue(params.tableRequest.setBackground)) {
        action.setBackground();
      }
    }
    action.setParams({
      tableRequest : params.tableRequest
    });
    helper.dispatchAction(component, action, params);
  },
})