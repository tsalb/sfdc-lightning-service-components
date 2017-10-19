({
  // Saves on boilerplate
  dispatchAction : function(component, action, params) {
    action.setCallback(this, function(response) {
      if (response.getState() === "SUCCESS") {
        params.callback(null, response.getReturnValue());
      } else {
        params.callback(response.getError());
      }
    });
    $A.enqueueAction(action);
  }
})