public with sharing class DataServiceCtrl {

  @AuraEnabled
  public static Account getAccount(String accountId) {
    return [
      SELECT
        Name,
        Industry,
        Id
      FROM 
        Account 
      WHERE 
        Id =: accountId 
      LIMIT 1
    ];
  }

  @AuraEnabled
  public static List<Contact> getContactsByAccountId(String accountId) {
    return [
      SELECT 
        Name,
        Email,
        Phone,
        Id
      FROM 
        Contact 
      WHERE 
        AccountId =: accountId
    ];
  }

}