({
  eventService : function(component) {
    return component.find("eventService");
  },
  showToast : function(title, message, type, duration, mode) {
    var type = (type ? type : "other");
    var duration = (duration ? parseInt(duration) : 5000);
    var mode = (mode ? mode : "dismissible");
    var toastEvent = $A.get("e.force:showToast");

    toastEvent.setParams({
      title: title,
      message: message,
      type: type,
      duration: duration,
      mode: mode
    });
    toastEvent.fire();
  },
  createBody : function(params, ctrlCallback) {
    var componentType = params.body.split(":")[0];
    var componentParams = {};

    // if we had some bodyParams, let's set the target modal body with their data
    if (!$A.util.isEmpty(params.bodyParams)) {
      Object.keys(params.bodyParams).forEach(function(v,i,a) {
        componentParams[v] = params.bodyParams[v];
      });
    }

    switch(componentType) {
      case "c" : //custom component
        $A.createComponent(
          params.body,
          componentParams,
          function(newModalBody, status, errorMessage){
            if (status === "SUCCESS") {
              ctrlCallback(null, newModalBody);
            } else {
              ctrlCallback(errorMessage);
            }
          }
        );
        break;
      default:
        $A.createComponent(
          "lightning:formattedText",
          { 
            "value": params.body,
            "class": "slds-align_absolute-center"
          },
          function(formattedText, status, errorMessage){
            if (status === "SUCCESS") {
              ctrlCallback(null, formattedText);
            } else {
              ctrlCallback(errorMessage);
            }
          }
        );
    }
  },
  createButton : function(params, ctrlCallback) {
    $A.createComponent(
      "lightning:button",
      {
        "aura:id": params.auraId+"-main-action",
        "label": params.mainActionLabel,
        "onclick": params.mainActionReference,
        "variant": "brand"
      },
      function(newButton, status, errorMessage){
        if (status === "SUCCESS") {
          ctrlCallback(null, newButton);
        } else {
          ctrlCallback(errorMessage);
        }
      }
    );
  },
})