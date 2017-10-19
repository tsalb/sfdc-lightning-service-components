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
})