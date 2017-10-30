({
  handleShowToast : function(component, event, helper) {
    console.log("toasting")
    var params = event.getParam("arguments");
    helper.showToast(
      params.title,
      params.message,
      params.type,
      params.duration,
      params.mode
    );
  },
  handleModal : function(component, event, helper) {
    var params = event.getParam("arguments");
    var eventService = component.find("eventService_messaging");

    // Creating the body first - this can be a custom component or text wrapped in formattedText
    helper.createBody(params,
      $A.getCallback(function(error, modalBody) {
        if (modalBody.isValid()) {

          helper.createButton(params,
            $A.getCallback(function(error, mainAction) {
              if (mainAction.isValid()) {

                // Final assembly
                $A.createComponent(
                  "c:modalFooter",
                  {
                    "actions": mainAction
                  },
                  function(completedFooter, status, errorMessage){
                    if (status === "SUCCESS") {

                      component.find('overlayLib').showCustomModal({
                        header: params.headerLabel,
                        body: modalBody, 
                        footer: completedFooter,
                        showCloseButton: true,
                        closeCallback: function() {
                          if (params.closeKey) {
                            eventService.fireCompEvent(params.closeKey, params.closeValue);
                          }
                        }
                      });
                    }
                  }
                );
      
              } else {
                console.log("mainAction error is: "+error[0].message);
              }
            })
          );

        } else {
          console.log("modalBody error is: "+error[0].message);
        }
      })
    );

  },
})