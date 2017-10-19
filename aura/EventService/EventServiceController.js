({
  handleFireApplicationEvent : function(component, event, helper) {
    var params = event.getParam("arguments");
    var appEvent = $A.get("e.c:ServiceAppEvent");
    
    appEvent.setParams({
      appEventKey : params.eventKey,
      appEventValue : params.eventValue
    });
    
    appEvent.fire();
  },
  handleFireComponentEvent : function(component, event, helper) {
    var params = event.getParam("arguments");
    var compEvent = component.getEvent("ServiceCompEvent");
    
    compEvent.setParams({
      compEventKey : params.eventKey,
      compEventValue : params.eventValue
    });
    
    compEvent.fire();
  },
  // Example of function easily callable via component methods
  handleUtilShowToast : function(component, event, helper) {
    var params = event.getParam("arguments");
    helper.showToast(
      params.title,
      params.message,
      params.type,
      params.duration,
      params.mode
    );
  },
})