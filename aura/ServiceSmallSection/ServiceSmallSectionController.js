({
  handleApplicationEvent : function(component, event, helper) {
    var params = event.getParams();

    if (params.appEventKey == "CONTACT_ROWS") {
      var parsedValue = JSON.parse(params.appEventValue);
      
      component.set("v.contactList", parsedValue);
      helper.updateMultiAddress(component);
    }
  },
})