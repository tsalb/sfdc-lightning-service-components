public with sharing class DataServiceCtrl {

  @AuraEnabled
  public static String getAccountOptions() {
    Data valueLabels = new Data();

    List<AggregateResult> aggList = new List<AggregateResult>([
      SELECT 
        AccountId accId, 
        Account.Name accName
      FROM
        Contact 
      GROUP BY 
        AccountId, Account.Name
      HAVING 
        count(Name) > 0
      ORDER BY
        count(Name) DESC
      LIMIT 10
    ]);

    for (AggregateResult ar : aggList) {
      valueLabels.items.add(new Item((String)ar.get('accId'), (String)ar.get('accName')));
    }
    
    //we need to serialize this because lightning cant have @AuraEnabled on inner classes
    return JSON.serialize(valueLabels);
  }

  @AuraEnabled
  public static List<Contact> getContactsByAccountId(String accountId) {
    try {
      return [
        SELECT 
          Name,
          Email,
          Phone,
          MailingStreet,
          MailingCity,
          MailingState,
          MailingPostalCode,
          AccountId,
          Id
        FROM 
          Contact 
        WHERE 
          AccountId =: accountId
      ];
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Boolean updateMultiContactAddress(List<Contact> conList, String conStreet, String conCity, String conState, String conZip) {
    System.debug('updateMultiContactAddress conList is: '+conList);

    for (Contact c : conList) {
      c.MailingStreet = conStreet;
      c.MailingCity = conCity;
      c.MailingState = conState;
      c.MailingPostalCode = conZip;
    }

    try {
      update conList;
      return true;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
      return false;
    }
  }

  public class Item {
    public String value;
    public String label;

    public Item(String value, String label) {
      this.value = value;
      this.label = label;
    }
  }

  public class Data {
    public List<Item> items;

    public Data() {
      this.items = new List<Item>();
    }
  }

}