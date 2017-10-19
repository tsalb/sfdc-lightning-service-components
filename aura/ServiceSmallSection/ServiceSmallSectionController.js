({
  handleLoadContact : function(component, event, helper) {
    var params = event.getParam("arguments");
    component.set("v.contactId", params.contactIdFromCaller);
  },
})