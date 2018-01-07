function publish() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    console.log("Could not obtain lock after 5s");
    Logger.log('Could not obtain lock after 10 seconds.');
    return;
  }
  
  console.log("Publish button clicked");
  
  var targetUrl = "https://www.google.com";
  var result = UrlFetchApp.fetch(targetUrl).getResponseCode();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  MailApp.sendEmail({
    to: "4by34@gmail.com",
    cc: "mail@tyler-johnson.ca",
    subject: "Spreadsheet Publish Button Clicked",
    htmlBody: "The publish button was clicked on <b>" + ss.getName() + "</b>"
  });
  
  lock.releaseLock();
  Browser.msgBox("Result " + result);
}
