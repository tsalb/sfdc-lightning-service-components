public with sharing class DataServiceCtrl {

  @AuraEnabled
  public static Account getAccount(String accountId) {
    try {
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
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }

  }

  @AuraEnabled
  public static List<Contact> getContactsByAccountId(String accountId) {
    try {
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
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }

  }

}