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

                      component.find("overlayLib").showCustomModal({
                        header: params.headerLabel,
                        body: modalBody, 
                        footer: completedFooter,
                        showCloseButton: true,
                        closeCallback: function() {
                          if (params.closeKey) {
                            helper.eventService(component).fireCompEvent(params.closeKey, params.closeValue);
                          }
                        }
                      }).then(function (overlay) {
                        // This is a cool trick to establish a live reference from 
                        // any originating component data to the modal data
                        // 
                        // This allows for us to modify data directly in the modal and
                        // not have to pass it back to the originating component
                        // and doing any component.set("v.value", somethingFromModal)
                        // 
                        // We still need to mimic a {!v} bind by doing a manual get/set in
                        // the original component though. TODO check if passing a bound {!v.dataset}
                        // to the modal from the originating component bypasses the manual get/set
                        if (!$A.util.isEmpty(params.bodyParams)) {
                          Object.keys(params.bodyParams).forEach(function(v,i,a) {
                            var valueProviderAdded = "v."+v;
                            modalBody.set(valueProviderAdded, params.bodyParams[v]);
                          });
                        }
                        helper.eventService(component).fireAppEvent("MODAL_READY");
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