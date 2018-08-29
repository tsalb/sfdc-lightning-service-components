({
  initUpdatePromiseChain : function(component, event, helper) {
    helper.initializeLightningDataService(component, event)
        .then($A.getCallback((callback) => {
          return helper.pollCheckWhenFullyLoaded(component, event, callback);
        }))
        .catch((error) => {
          $A.reportError("Promise Error", error);
          helper.messageService(component).showToast(null, error, "error", 10000, "sticky");
        });
  },
  handleRecordUpdated : function(component, event, helper) {
    let changeType = event.getParams().changeType;
    switch(changeType.toUpperCase()) {
      case "ERROR":
        helper.messageService(component).showToast(null, component.get("v.simpleRecordError"), "error", 10000, "sticky");
        break;
      case "LOADED" :
        component.set("v.lightningDataServiceLoaded", true);
        break;
      case "CHANGED":
        // destroy using aura:if
        component.set("v.transactionInProgress", false);
        // clear everything
        component.set("v.fieldUpdates", null);
        component.set("v.fieldApiNameToUpdateValueMap", null);
        component.set("v.recordId", null);
        component.set("v.fields", null);
        component.set("v.simpleRecord", null);
        component.set("v.simpleRecordError", null);
        component.set("v.lightningDataServiceLoaded", false);
        break;
    }
  },
})