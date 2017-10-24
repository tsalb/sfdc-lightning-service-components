# sfdc-lightning-service-components

This design pattern is an implementation of the following artice found on salesforce dev blogs: https://developer.salesforce.com/blogs/developer-relations/2016/12/lightning-components-code-sharing.html

We can more fully leverage the new Winter 18 dynamic lightning page layouts using this pattern. Since it's now possible to handle conditional render of components (both native and custom) via platform config, it makes sense to move conditional render of an entire component "card" to platform config.

The platform's new dynamic lightning page layouts can be leveraged to "re-configure" the page more akin to a SPA when paired with something like an object's `Status__c` field. Using this design pattern, we can leverage both native and custom lightning components on a record home page and use `Status__c` to show a different set of components on each status.

The Service Component design pattern makes it easy for custom components placed separately from each other (not having any parent-child hierarchy) to easily share a single Apex Controller and reduce redundancy of inter-component communication through key-value events.

Having no component hierarchy makes it more simple to place components anywhere on a lightning page and allowing more flexibility of creating a dynamic user experience out of mixing native and custom components.

---

The two primary service components are:

`DataService.cmp` which encapsulates serverside callouts. A single Apex Controller is attributed to this headless component which uses methods to pass parameters to the JS controller which handles serverside configuration like `action.setStorable()` or `action.setParams()`.

This will be passed to `helper.dispatch()` to make the asynchronous callout.

`EventService.cmp` which encapsulates a key-value pair (optional value) model for both application and component events. This component registers and fires generic events which need to be parsed by the handling component(s) via key-value.

This sample app doesn't showcase dynamic page layouts and conditional render based on `Status__c` or similar. It's meant to show only Service Component architecture and usage.

---

## DataService Usage Example:

Drop this into a component that needs serverside data:
```html
<!-- ServiceHeader.cmp -->
<aura:component implements="flexipage:availableForAllPageTypes">
  <c:DataService aura:id="service_header"/> 
  <aura:handler name="init" value="{! this }" action="{! c.doInit }"/>
</aura:component>
```

And on the component's controller:
```javascript
// ServiceHeaderController.js
doInit: function (component, event, helper) {
  var service = component.find("service_header");

  service.fetchAccountCombobox(
    $A.getCallback(function(error, data) {
      if (data) {
        console.log("data from my apex controller is: "+data);
      }
    })
  );
},
```

## Wiring Up DataService
Notice the `service.fetchAccountCombobox` method call above. This is something that is defined in the Service Component like below. Notice this method doesn't have any parameters, only a callback:
```html
<!-- DataService.cmp -->
<aura:component controller="DataServiceCtrl">
  <aura:method name="fetchAccountCombobox" action="{! c.handleFetchAccountCombobox }">
    <aura:attribute name="callback" type="function"/>
  </aura:method>
</aura:component>
```
No parameters or storables are set against the `action` here in `DataService.cmp`:
```javascript
// DataServiceController.js
({
  handleFetchAccountCombobox : function(component, event, helper) {
    var params = event.getParam("arguments");
    var action = component.get("c.getAccountOptions");
    helper.dispatchAction(component, action, params);
  }
})
```
And the component `helper`:
```javascript
({
  dispatchAction : function(component, action, params) {
    action.setCallback(this, function(response) {
      if (response.getState() === "SUCCESS") {
        params.callback(null, response.getReturnValue());
      } else {
        params.callback(response.getError());
      }
    });
    $A.enqueueAction(action);
  }
})
```

## EventService Usage Examples

Some samples from the app:
```javascript

component.find("eventService_header").fireAppEvent("ACCOUNT_ID_SELECTED", selectedOptionValue);

component.find("eventService_header").fireAppEvent("HEADER_CLEARTABLE");

component.find("eventService_header").utilShowToast(
  "error",
  "No Accounts in org!",
  "error"
);
```

## How EventService is wired
Unless you'd like to add your own utility events (per above, showing toast can be a shared "event" of sorts), `EventService.cmp` can already handle key-value parameter pairs. Drop in `EventService.cmp` into any component that needs to fire an application or component event.

Component:
```html
<!-- EventService.cmp -->
<aura:component >
  <aura:registerEvent name="ServiceAppEvent" type="c:ServiceAppEvent"/>
  <aura:registerEvent name="ServiceCompEvent" type="c:ServiceCompEvent"/>

  <aura:method name="fireAppEvent" action="{! c.handleFireApplicationEvent }">
    <aura:attribute name="eventKey" type="String"/>
    <aura:attribute name="eventValue" type="String"/>
  </aura:method>

  <aura:method name="fireCompEvent" action="{! c.handleFireComponentEvent }">
    <aura:attribute name="eventKey" type="String"/>
    <aura:attribute name="eventValue" type="String"/>
  </aura:method>
</aura:component>
```
Controller:
```javascript
// EventServiceController.JS
({
  handleFireApplicationEvent : function(component, event, helper) {
    var params = event.getParam("arguments");
    var appEvent = $A.get("e.c:ServiceAppEvent");
    
    appEvent.setParams({
      appEventKey : params.eventKey,
      appEventValue : params.eventValue
    });
    
    appEvent.fire();
  },
  handleFireComponentEvent : function(component, event, helper) {
    var params = event.getParam("arguments");
    var compEvent = component.getEvent("ServiceCompEvent");
    
    compEvent.setParams({
      compEventKey : params.eventKey,
      compEventValue : params.eventValue
    });
    
    compEvent.fire();
  }
})
```
## Handling events in EventService
In any component that needs to listen to either an Application or Component event, handle it like this:

Component:
```html
<aura:component>
  <aura:handler event="c:ServiceAppEvent" action="{! c.handleApplicationEvent }"/>
</aura:component>
```
Controller:
```javascript
handleApplicationEvent : function(component, event, helper) {
  var params = event.getParams();

  if (params.appEventKey == "ACCOUNT_ID_SELECTED") {
    console.log("Do something with the value: " + params.appEventValue);
  }
  if (params.appEventKey == "HEADER_CLEARTABLE") {
    component.set("v.tableData", null);
  }
},
```
