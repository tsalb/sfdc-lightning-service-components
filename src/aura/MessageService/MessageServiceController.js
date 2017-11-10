({
  handleShowToast : function(component, event, helper) {
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

          // if mainActionReference has a c. prefix, it means we want an action on the body just created
          var str = String(params.mainActionReference);
          if (str.startsWith("c.")) {
            params.mainActionReference = modalBody.getReference(params.mainActionReference);
          }

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
                        showCloseButton: true
                        // Haven't had a use for this yet so temporarily deprecating
                        // closeCallback: function() {
                        //   if (params.closeKey) {
                        //     eventService.fireCompEvent(params.closeKey, params.closeValue);
                        //   }
                        // }
                      }).then(function (overlay) {
                        eventService.fireAppEvent("MODAL_READY");
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