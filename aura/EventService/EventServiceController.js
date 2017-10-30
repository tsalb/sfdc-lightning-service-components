({
  handleFireApplicationEvent : function(component, event) {
    var params = event.getParam("arguments");
    var appEvent = $A.get("e.c:ServiceAppEvent");
    
    appEvent.setParams({
      appEventKey : params.eventKey,
      appEventValue : params.eventValue
    });
    appEvent.fire();
  },
  handleFireComponentEvent : function(component, event) {
    var params = event.getParam("arguments");
    var compEvent = component.getEvent("ServiceCompEvent");
    
    compEvent.setParams({
      compEventKey : params.eventKey,
      compEventValue : params.eventValue
    });
    compEvent.fire();
  },
})