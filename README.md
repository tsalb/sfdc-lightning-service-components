# sfdc-lightning-service-components

The Service Component design pattern makes it easy for custom components placed separately from each other (not having any parent-child hierarchy) to easily share a single Apex Controller and reduce redundancy of inter-component communication through key-value events.

Having no component hierarchy makes it more simple to place components anywhere on a lightning page and allowing more flexibility of creating a dynamic user experience out of mixing native and custom components.

Additionally, the Service Component design pattern allows wrapping of base lightning components to provide much more utility than what is currently offered.

**tl;dr: Deploy > App Launcher > Service Components**

<a href="https://githubsfdeploy.herokuapp.com?owner=tsalb&repo=sfdc-lightning-service-components&ref=master">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

---

The four service components in this example are:

`DataService` which encapsulates serverside callouts. A single Apex Controller is attributed to this headless component which uses `aura:methods` to pass parameters to the JS controller which handles serverside configuration like `action.setStorable()` or `action.setParams()`. The action will be passed to `helper.dispatch()` to make the asynchronous callout.

`EventService` which encapsulates a key-value pair (optional value) model for both application and component events. This component registers and fires generic events which need to be parsed by the handling component(s) via key-value.

`MessageService` which wraps `lightning:overlayLibrary` and provides dynamic creation `aura:methods` for modal bodies and footers.

`QuickUpdateService` which wraps Lightning Data Service (i.e. `force:recordData`) and provides an `aura:method` to very quickly configure a single-object, single-record DML to any sObject. Since this uses LDS, profile security is respected. This is a POC component.

`DataTableService` which can quickly generate `tableData` and `tableColumns` in a format expected by `lightning:datatable`. It's designed primary for read-only tables, but it's still possible to perform further processing either serverside or clientside to configure `lightning:datatable` more granularly.

---

## DataService Usage Example
Drop this into a component that needs serverside data:

**ServiceHeader.cmp**
```xml
<aura:component implements="flexipage:availableForAllPageTypes">
  <c:DataService aura:id="service"/> 
  <aura:handler name="init" value="{! this }" action="{! c.doInit }"/>
</aura:component>
```

**ServiceHeaderController.js**
```javascript
doInit: function (component, event, helper) {

  helper.service(component).fetchAccountCombobox(
    $A.getCallback((error, data) => {
      if (data) {
        console.log("data from my apex controller is: "+data);
      }
    })
  );
},
```

**ServiceHeaderHelper.js**
```javascript
// ServiceHeaderHelper.js
service : function(component) {
  return component.find("service");
},
```

## Wiring Up DataService
Notice the `service.fetchAccountCombobox` method call above. This is something that is defined in the Service Component like below. Notice this method doesn't have any parameters, only a callback:

**DataService.cmp**
```xml
<aura:component controller="DataServiceCtrl">
  <aura:method name="fetchAccountCombobox" action="{! c.handleFetchAccountCombobox }">
    <aura:attribute name="callback" type="function"/>
  </aura:method>
</aura:component>
```
**DataServiceController.js**

No parameters or storables are set against the `action` here in `DataServiceController.js`:
```javascript
({
  handleFetchAccountCombobox : function(component, event, helper) {
    let params = event.getParam("arguments");
    let action = component.get("c.getAccountOptions");
    helper.dispatchAction(component, action, params);
  }
})
```
**DataServiceHelper.js**
```javascript
({
  dispatchAction : function(component, action, params) {
    action.setCallback(this, (response) => {
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

helper.eventService(component).fireAppEvent("ACCOUNT_ID_SELECTED", selectedOptionValue);

helper.eventService(component).fireAppEvent("HEADER_CLEARTABLE");

```

## How EventService is wired
`EventService.cmp` can handle key-value parameter pairs. Drop in `EventService.cmp` into any component that needs to fire an application or component event.

**EventService.cmp**
```xml
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
**EventServiceController.js**
```javascript
({
  handleFireApplicationEvent : function(component, event, helper) {
    let params = event.getParam("arguments");
    let appEvent = $A.get("e.c:ServiceAppEvent");
    
    appEvent.setParams({
      appEventKey : params.eventKey,
      appEventValue : params.eventValue
    });
    
    appEvent.fire();
  },
  handleFireComponentEvent : function(component, event, helper) {
    let params = event.getParam("arguments");
    let compEvent = component.getEvent("ServiceCompEvent");
    
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

**ContactDatatable.cmp**
```xml
<aura:component>
  ...
  <aura:handler event="c:ServiceAppEvent" action="{! c.handleApplicationEvent }"/>
  ...
</aura:component>
```
**ContactDatatableController.js**
```javascript
handleApplicationEvent : function(component, event, helper) {
  let params = event.getParams();
  switch(params.appEventKey) {
    case "ACCOUNT_ID_SELECTED": // fallthrough
    case "CONTACTS_UPDATED":
      helper.loadContactTable(component, params.appEventValue);
      break;
    case "HEADER_CLEARTABLE":
      component.set("v.tableData", null);
      break;
  }
},
```

## MessageService Usage Examples
At its core, this is a wrapper around the lightning:overlayLibrary which provides some helper functionality for creating both the body and the footer. There are some special features:

- Able to handle text or custom component as the modal body.
- Always handles the footer cancel button.
- Specify a main action function which can be either:
  - On the originating component by using `component.getReference("someFunction")`.
  - On the modal component (the body) that's being created by using `"c.someFunctionOnTheModalComponent"`.
- Pass an Object of parameters to the modal component (the body) from the originating component by using object notation while setting up the modal.

When you drop in `MessageService.cmp` into a component, such as `ContactDatatable.cmp`, this is an example of how you can open a modal from a function in `ContactDatatableController.js`.

**ContactDatatableController.js**
```javascript
handleOpenComponentModal : function(component, event, helper) {
  let selectedArr = component.find("searchTable").getSelectedRows();

  helper.messageService(component).modal(
    "update-address-modal",                           // auraId
    "Update Address: "+selectedArr.length+" Row(s)",  // headerLabel
    "c:ContactAddressForm",                           // body, MessageService will dynamically create this
    {
      contactList: selectedArr                        // bodyParams, MessageService will dynamically inject this into the previous body
    },
    "c.handleUpdateMultiAddress",                     // mainActionReference, see above on where you can feed this
    "Update"                                          // mainActionLabel
  );
},
```

The above `c.handleUpdateMultiAddress` is a reference to a function found on `ContactAddressForm.cmp`. `MessageService.cmp` is able to grab reference appropriately and wire it up to the `Update` main action found in the modal footer.

**ContactAddressFormController.js**
```javascript
handleUpdateMultiAddress : function(component, event, helper) {
  helper.updateMultiAddress(component);
},
```

So, even though overlayLibrary `modalBody` and `modalFooter` are siblings, the footer is referencing a controller action on the body. This makes it easier to write all your container logic on a `modalBody` and leverage `MessageService.cmp` to just open a self-contained `modalBody` component.


## QuickUpdateService Usage Examples
At its core, this is a wrapper around force:recordData which allows for simple single record DML.

This example from `ContactDatatable.cmp` uses a single button to update multiple fields on a single record. The only attributes `QuickUpdateService.cmp` expects is a `configObject` containing the `recordId` and `fieldUpdates` properties.

Currently, there is no type checking or much error handling.

**ContactDatatableHelper.js**
```javascript
  clearMailingAddressWithLightningDataService : function(component, row) {
    let _self = this;
    let configObject = { // QuickUpdateService only expects this object with recordId and fieldUpdates properties
      recordId: row["Id"],
      fieldUpdates: {
        "MailingStreet": null,
        "MailingCity": null,
        "MailingState": null,
        "MailingPostalCode": null,
        "MailingCountry": null
      }
    }
    _self.quickUpdateService(component).LDS_Update(
      configObject,
      $A.getCallback((saveResult) => {
        switch(saveResult.state.toUpperCase()) {
          case "SUCCESS":
            _self.messageService(component).showToast(null, "Cleared Mailing Address.", "success");
            _self.loadContactTable(component, row["AccountId"]);
            break;
          case "ERROR":
            _self.messageService(component).showToast(
              null,
              "Error Clearing Mailing Address: "+JSON.stringify(saveResult.error),
              "error",
              10000,
              "sticky"
            );
            break;
        }
      })
    );
  },
```


## DataTableService Usage Examples
This is a library service component. It's designed to make read-only lightning:datatable very quick to spin up.

This example is from `CaseDatatable.cmp` (which is actually created inside a modal from `ContactDatatable.cmp`). The only attributes `DataTableService.cmp` expects is a `tableRequest` Object containing the `queryString` and `bindVars` properties.

There is no way to fetch the more granular `tableColumns` specific configurations that are offered from `lightning:datatable` however it's possible to post-process the `tableColumns` data even futher serverside OR clientside.

**CaseDatatableController.js**
```javascript
  doInit : function(component, event, helper) {
    let contactRecordId = [].concat(component.get("v.contactRecordId")); // guarantees array for idSet
    if (!$A.util.isUndefinedOrNull(contactRecordId)) {
      let tableRequest = {
        queryString: "SELECT "
                    +"Id, CaseNumber, CreatedDate, ClosedDate, Description, Comments, Status, Subject, Type "
                    +"FROM Case "
                    +"WHERE ContactId =: idSet "
                    +"ORDER BY CaseNumber ASC",
        bindVars: {
          idSet: contactRecordId,
        }
      }
      helper.tableService(component).fetchData(
        tableRequest,
        $A.getCallback((error, data) => {
          if (!$A.util.isUndefinedOrNull(data) && !$A.util.isEmpty(data)) {
            component.set("v.tableData", data.tableData);
            component.set("v.tableColumns", data.tableColumns);
          } else {
            if (!$A.util.isUndefinedOrNull(error) && error[0].hasOwnProperty("message")) {
              helper.messageService(component).showToast(null, error[0].message, "error");
            }
          }
        })
      );
    }
  }
```
