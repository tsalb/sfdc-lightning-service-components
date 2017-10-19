({
  handleFetchAccount : function(component, event, helper) {
    var params = event.getParam("arguments");
    var action = component.get("c.getAccount");
    action.setParams({
      accountId : params.accountIdEventArg
    });
    helper.dispatchAction(component, action, params);
  },
  handleFetchContactsByAccountId : function(component, event, helper) {
    var params = event.getParam("arguments");
    var action = component.get("c.getContactsByAccountId");
    action.setStorable();
    action.setParams({
      accountId : params.accountIdEventArg
    });
    helper.dispatchAction(component, action, params);
  },
})