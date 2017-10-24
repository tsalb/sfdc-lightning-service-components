({
  doInit : function(component, event) {
    component.find("service_progress").fetchSteps(
      $A.getCallback(function(error, data) {
        if (data) {
          var parsedData = JSON.parse(data);
          var valueToStepMap = new Map();
          // List of components to create, starting with the parent
          var stepsPreComponents = [[
            "lightning:progressIndicator",
            {
              "type" : "base"
            }
          ]];
          // Add the steps
          for (var item of parsedData.items) {
            stepsPreComponents.push([
              "lightning:progressStep",
              {
                "value":item.value,
                "label":item.label
              }
            ]);
            valueToStepMap.set(parsedData.items.indexOf(item), item.value);
          }
          $A.createComponents(
            stepsPreComponents,
            function(components, status, errorMessage){
              if (status === "SUCCESS") {
                // Remove the parent from components
                var progressIndicator = components.shift();
                // Add the children to the parent
                progressIndicator.set('v.body',components);
                // Assign it to the view Attribute
                component.set('v.progressIndicator',progressIndicator);
              } else {
                console.log(errorMessage);
              }
            }
          );
          component.set("v.valueToStepMap", valueToStepMap);
        } else {
          console.log(error);
        }
      })
    );
  },
  handleNextStep : function(component, event) {
    
  },
  handlePreviousStep : function(component, event) {

  },
  handleResetSteps : function(component, event) {

  },
  handleApplicationEvent : function(component, event) {
    
  },
})