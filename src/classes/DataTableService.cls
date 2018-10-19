/*************************************************************
*  @author: James Hou, james@sparkworks.io
*  Date: 8-2018
**************************************************************/

public with sharing class DataTableService {

  // tableRequest
  public static final String QUERY_STRING_KEY   = 'queryString';
  public static final String BIND_VAR_KEY       = 'bindVars';
  public static final String ID_SET_KEY         = 'idSet';

  // tableCache
  public static final String TABLE_DATA_KEY     = 'tableData';
  public static final String TABLE_COLUMNS_KEY  = 'tableColumns';

  // lightning:datatable type translation map
  // https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_enum_Schema_DisplayType.htm
  // https://developer.salesforce.com/docs/component-library/bundle/lightning:datatable/documentation
  public static final Map<Schema.DisplayType, String> DISPLAY_TYPE_TO_DATATABLE_TYPE_MAP = new Map<Schema.DisplayType, String>{
    Schema.DisplayType.address        => 'text',
    Schema.DisplayType.anytype        => 'text',
    Schema.DisplayType.base64         => 'text',
    Schema.DisplayType.Boolean        => 'boolean',
    Schema.DisplayType.Combobox       => 'text',
    Schema.DisplayType.Currency       => 'currency',
    Schema.DisplayType.Date           => 'date-local', // my preference
    Schema.DisplayType.DateTime       => 'date-local', // my preference
    Schema.DisplayType.Double         => 'number',
    Schema.DisplayType.Email          => 'email',
    Schema.DisplayType.ID             => 'text',
    Schema.DisplayType.Integer        => 'number',
    Schema.DisplayType.MultiPicklist  => 'text',
    Schema.DisplayType.Percent        => 'percent',
    Schema.DisplayType.Phone          => 'text',
    Schema.DisplayType.Picklist       => 'text',
    Schema.DisplayType.Reference      => 'text',
    Schema.DisplayType.String         => 'text',
    Schema.DisplayType.TextArea       => 'text',
    Schema.DisplayType.Time           => 'text',
    Schema.DisplayType.URL            => 'url'
  };

/**
 * Creates a lightning:datatable ready object keys:
 * tableData and tableColumns can be used as attributes directly clientside.
 * 
 * @param  tableRequest [Object with configs, see DataTableService.cmp]
 * @return              [Object with tableCache.tableData, tableCache.tableColumns]
 */
  @AuraEnabled
  public static Map<String, Object> createTableCache(Map<String, Object> tableRequest) {
    Map<String, Object> tableCache = new Map<String, Object>();

    if (!tableRequest.containsKey(QUERY_STRING_KEY)) {
      throw new AuraHandledException('tableService queryString is missing.');
    }
    List<SObject> tableData = DataTableService.getSObjectData(tableRequest);

    if (!tableData.isEmpty()) {
      tableCache.put(TABLE_DATA_KEY, tableData);
      tableCache.put(TABLE_COLUMNS_KEY, DataTableService.getColumnData((String)tableRequest.get(QUERY_STRING_KEY), tableData[0]));
    }
    return tableCache;
  }

/**
 * Routing method to see if there are any Binding Variables (BIND_VAR_KEY) to scope the dynamic query
 * 
 * @param  tableRequest [Object with configs]
 */
  private static List<SObject> getSObjectData(Map<String, Object> tableRequest) {
    if (tableRequest.get(BIND_VAR_KEY) == null) {
      return DataTableService.getSObjectDataFromQueryString((String)tableRequest.get(QUERY_STRING_KEY));
    } else {
      return DataTableService.getSObjectDataFromQueryString((String)tableRequest.get(QUERY_STRING_KEY), tableRequest.get(BIND_VAR_KEY));
    }
  }

/**
 * No dynamic binding vars, returns everything specific directly from SOQL string
 * 
 * @param  queryString [Dynamic SOQL string]
 * @return             [List of dynamically queried SObjects]
 */
  private static List<SObject> getSObjectDataFromQueryString(String queryString) {
    try {
      System.debug('getSObjectDataFromQueryString queryString is: '+queryString);
      return Database.query(queryString);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

/**
 * Contains dynamic binding vars, returns everything bound to the dynamic variable
 * 
 * @param  queryString     [Dynamic SOQL string]
 * @param  orderedBindVars [Currently only an ID_SET_KEY, containing a list of sObject Ids to scope the query]
 * @return                 [List of dynamically queried SObjects scoped by some BIND_VAR]
 */
  private static List<SObject> getSObjectDataFromQueryString(String queryString, Object orderedBindVars) {
    Set<Id> idSet = new Set<Id>();
    System.debug('getSObjectDataFromQueryString orderedBindVars '+orderedBindVars);

    Map<Object, Object> reconstructedBindVars = (Map<Object, Object>) orderedBindVars;

    if (reconstructedBindVars.get(ID_SET_KEY) != null) {
      List<String> idList = (List<String>) JSON.deserialize(
        JSON.serialize(
          reconstructedBindVars.get(ID_SET_KEY)
        ),
        List<String>.class
      );
      for (String sObjectId : idList) {
        idSet.add(sObjectId.trim());
      }
    }
    try {
      return Database.query(queryString);
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

/**
 * Creates lightning:datatable ready tableColumns using the queryString and the queried object's schema.
 * 
 * @param  queryString    [Dynamic SOQL String, to parse out fields]
 * @param  queriedSObject [To grab full schema of fields, primarily for labels]
 * @return                [List of individual tableColumn, i.e. tableColumns]
 */
  private static List<Map<String, Object>> getColumnData(String queryString, SObject queriedSObject) {
    String soqlFields = queryString.subString(queryString.indexOfIgnoreCase('select') + 6, queryString.indexOfIgnoreCase('from')).trim();
    List<String> soqlColumns = soqlFields.split('[,]{1}[\\s]?'); // sanitizes the spacing between commas
    List<Map<String, Object>> tableColumns = new List<Map<String, Object>>();
    Map<String, Schema.SObjectField> fieldMap = queriedSObject.getSObjectType().getDescribe().fields.getMap();

    for (String fieldName : soqlColumns){
      Schema.DescribeFieldResult field = fieldMap.get(fieldName).getDescribe();

      // IDs are usually keyFields, so we skip display of this
      if (field.getType() == Schema.DisplayType.ID) {
        continue;
      }
      Map<String, Object> fieldColumn = new Map<String, Object>();
      fieldColumn.put('label', field.getLabel());
      fieldColumn.put('fieldName', fieldName);
      fieldColumn.put('type', DISPLAY_TYPE_TO_DATATABLE_TYPE_MAP.get(field.getType()));
      tableColumns.add(fieldColumn);
    }
    return tableColumns;
  }

}