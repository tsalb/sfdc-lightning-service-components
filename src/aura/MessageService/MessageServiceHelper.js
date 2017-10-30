({
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

    switch(componentType) {
      case "c" : //custom component
        $A.createComponent(
          params.body,
          {
            "aura:id": params.auraId,
          },
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
            "value": params.body
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
        "onclick": params.mainActionReference
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