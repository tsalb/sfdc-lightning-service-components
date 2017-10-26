({
  handleOpenModal : function(component, event, helper) {
    var modalMain = helper.getMain(component);
    var modalBackdrop = helper.getBackdrop(component);

    $A.util.addClass(modalMain, "slds-fade-in-open");
    $A.util.addClass(modalBackdrop, "slds-backdrop_open");
  },
  handleCloseModal : function(component, event, helper) {
    var modalMain = helper.getMain(component);
    var modalBackdrop = helper.getBackdrop(component);
    
    $A.util.removeClass(modalMain, "slds-fade-in-open");
    $A.util.removeClass(modalBackdrop, "slds-backdrop_open");
  },
})