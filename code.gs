var AppName="Gmail Manager by uday"
var managed=7;
var applabels=["G+","Facebook","twitter","recommendations","family","friend","Quora","Delete","Remind","SaveAsPDF"];
function myFunction()
{getMailLength()
 
}
function onOpen(e)
{//this is executed each time the add on is run
 updatePrefSheet();
}
function Sheetsetup() //should run after onInstall #takencare @uday
{fileid=PropertiesService.getUserProperties().getProperty("defaults");
 Logger.log("opened defaults successfully");
 var sheet=SpreadsheetApp.openById(fileid).getActiveSheet();
 sheet.clear();
 sheet.appendRow([' ','Know what you are doing before altering any values on this sheet.']);
 sheet.appendRow([' ','This sheet this sheet was created automatically by '+ AppName +'.'])
 sheet.appendRow([' ']);
 sheet.appendRow([' ']);
 sheet.appendRow(['App clears times are as follows']);
 sheet.appendRow([' ']);
 sheet.appendRow(['name','delete time','reminder time','unit','','remarks']);
 sheet.appendRow(['cycle','3','3','days','','min time for one cycles is one day']);
 sheet.appendRow(['G+','3','2','cycles']);
 sheet.appendRow(['Facebook','7','4','cycles']);
 sheet.appendRow(['Twitter','5','4','cycles']);
 sheet.appendRow(['Recommendations','3','2','cycles']); 
 sheet.appendRow(['Quora','6','4','cycles'])
 sheet.appendRow(['delete','1','0','cycles']);
 sheet.appendRow(['remind','1','0','cycles']);
 
 
  }
function saveaspdf()
{//saves emails as pdf in drive in gmail manager by uday/pdf
}
function getPlainStats() {//returns Total,unread,ImportantAndUnread
  //get stats like read unread important and important unread
  var unread,important,imp_unread,stared,total;
  total=GmailApp.getInboxThreads();
  unread=0;
  important=0;
  imp_unread=0;
  var j=0;
  while((total=GmailApp.getInboxThreads(j,j+500)))
  {for (i=0;i<total.length;i++)
  {
   if(total[i].isImportant())
     {important+=1;}
   if(total[i].isUnread())
     {unread+=1;}
   if(total[i].isUnread()&&total[i].isImportant())
     {imp_unread+=1;}
  }}
  return [total.length,unread,important,imp_unread];
  
}
function getMailLength()//analising new mails is just waste of time lets go back in time :@udaykrishna
{prop=PropertiesService.getUserProperties();
 var total=0;
 var i=0;
 Logger.log("service started");
 var x=100;
 var n=0;
 try{
 var maillist=GmailApp.getInboxThreads(i,i+x);}
 catch(e){
 Logger.log("minimum 100 mails are needed. "+e);
 }
 Logger.log("starting Loop");
 do
 { try{
   var maillist=GmailApp.getInboxThreads(i,i+x);
   n+=1;
//   Logger.log("i = "+i);
//   Logger.log("50th maillist "+maillist[50].getFirstMessageSubject()+' count '+maillist[50].getMessageCount());
//   Logger.log("maillist = "+maillist.length);
  i+=x;
  total+=maillist.length;
  }
 catch(e){if(x>1){x/=2;continue;}else{Logger.log("total mails "+labels);break;}
 return [total,n];//returns total no of mails and total no. of requests sent.
 }
 }while(maillist.length>0)
// sealed
// for(j=0;j<maillist.length;j++){
// var mails=maillist[j].getMessages();
// Utilities.sleep(100);
// for(k=0;k<mails.length;k++){
// Logger.log(mails[k].getDate());
// Logger.log("k = "+k);
//  }
//  Logger.log('j = '+j);
// sealed

 }
 
 

function getTypeStats(){
  // get number of messages from banks,facebook,google+,twitter
  getPlainStats();
}
function SocialRead()
{//mark social messages from g+,facebook,twitter,quora,zorpia and other sites as marked after a few days i.e after 1st remainder

}
function Remind()
{//remind messages from social apps after a few days i.e after given cycle
}
function CreateLabels()
{//create and assign lables
  prop=PropertiesService.getUserProperties()
  userlabels=GmailApp.getUserLabels();
  sheet=SpreadsheetApp.openById(prop.getProperty('backup'));
  var labels=[];  
    for(i=0;i<userlabels.length;i++)
    {Logger.log(userlabels[i].getName());
    labels.push(userlabels[i].getName())}
    sheet.getActiveSheet().clear();
    sheet.appendRow(['userlabels'].concat(labels));
    sheet.appendRow(['applabels'].concat(applabels));
    for (i=0;i<applabels.length;i++)
    {var make=1;
    for(j=0;j<userlabels.length;j++)
    {Logger.log(applabels[i].toLowerCase()+' : '+labels[j].toLowerCase());
    if(applabels[i].toLowerCase()==labels[j].toLowerCase())
    {make=0;}
    }
    if(make==1){
    GmailApp.createLabel(applabels[i]);
    Logger.clear();
    Logger.log('made label '+applabels[i]);
    }
    }}
    

function updatePrefSheet() //should run on every start #yet-to-implement @uday
{//create a sheet for preferences
  scriptproperties=PropertiesService.getUserProperties();
  var sheet=SpreadsheetApp.openById(scriptproperties.getProperty('defaults'));
  values=sheet.getSheetValues(8, 1, (managed+1), 3);
  //future goal is to change the storage from properties to Cache.@uday
  for(i=0;i<values.length;i++)
  {
   scriptproperties.setProperty('del_'+values[i][0],values[i][1]);
   scriptproperties.setProperty('rem_'+values[i][0],values[i][2]);  
  }
  Logger.log(scriptproperties.getProperties())
}
function onInstall()
{ Logger.log("Starting install procedure");
 precheck=DriveApp.getFoldersByName(AppName);
 if(precheck.hasNext())
 {precheck.next().setTrashed(true); }
 var root=DriveApp.createFolder(AppName);//has bug is returning a folderiterator
 var pdf=root.createFolder(pdf).getId();
 var sheet=SpreadsheetApp.create("defaults");
 var backup=SpreadsheetApp.create("backup");
 Logger.log("folder created,sheet created in root moving pendng");
 var id=DriveApp.getFileById(sheet.getId()).makeCopy('defaults',root).getId();
 var bid=DriveApp.getFileById(backup.getId()).makeCopy('backup',root).getId();
 DriveApp.getFileById(sheet.getId()).setTrashed(true);
 DriveApp.getFileById(backup.getId()).setTrashed(true);
 Logger.log("Moving complete");
 PropertiesService.getUserProperties().setProperty('defaults', id);
 PropertiesService.getUserProperties().setProperty('backup', bid);
 PropertiesService.getUserProperties().setProperty('cycles', '0');
 PropertiesService.getUserProperties().setProperty('pdf', pdf);
 Logger.log("property set complete:: set property defaults");
 Sheetsetup();
 CreateLabels();
}
var AppName="Gmail Manager by uday"
var managed=7;
var applabels=["G+","Facebook","twitter","recommendations","family","friend","Quora","Delete","Remind","SaveAsPDF"];
function myFunction()
{getMailLength()
 
}
function onOpen(e)
{//this is executed each time the add on is run
 updatePrefSheet();
}
function Sheetsetup() //should run after onInstall #takencare @uday
{fileid=PropertiesService.getUserProperties().getProperty("defaults");
 Logger.log("opened defaults successfully");
 var sheet=SpreadsheetApp.openById(fileid).getActiveSheet();
 sheet.clear();
 sheet.appendRow([' ','Know what you are doing before altering any values on this sheet.']);
 sheet.appendRow([' ','This sheet this sheet was created automatically by '+ AppName +'.'])
 sheet.appendRow([' ']);
 sheet.appendRow([' ']);
 sheet.appendRow(['App clears times are as follows']);
 sheet.appendRow([' ']);
 sheet.appendRow(['name','delete time','reminder time','unit','','remarks']);
 sheet.appendRow(['cycle','3','3','days','','min time for one cycles is one day']);
 sheet.appendRow(['G+','3','2','cycles']);
 sheet.appendRow(['Facebook','7','4','cycles']);
 sheet.appendRow(['Twitter','5','4','cycles']);
 sheet.appendRow(['Recommendations','3','2','cycles']); 
 sheet.appendRow(['Quora','6','4','cycles'])
 sheet.appendRow(['delete','1','0','cycles']);
 sheet.appendRow(['remind','1','0','cycles']);
 
 
  }
function saveaspdf()
{//saves emails as pdf in drive in gmail manager by uday/pdf
}
function getPlainStats() {//returns Total,unread,ImportantAndUnread
  //get stats like read unread important and important unread
  var unread,important,imp_unread,stared,total;
  total=GmailApp.getInboxThreads();
  unread=0;
  important=0;
  imp_unread=0;
  var j=0;
  while((total=GmailApp.getInboxThreads(j,j+500)))
  {for (i=0;i<total.length;i++)
  {
   if(total[i].isImportant())
     {important+=1;}
   if(total[i].isUnread())
     {unread+=1;}
   if(total[i].isUnread()&&total[i].isImportant())
     {imp_unread+=1;}
  }}
  return [total.length,unread,important,imp_unread];
  
}
function getMailLength()//analising new mails is just waste of time lets go back in time :@udaykrishna
{prop=PropertiesService.getUserProperties();
 var total=0;
 var i=0;
 Logger.log("service started");
 var x=100;
 var n=0;
 try{
 var maillist=GmailApp.getInboxThreads(i,i+x);}
 catch(e){
 Logger.log("minimum 100 mails are needed. "+e);
 }
 Logger.log("starting Loop");
 do
 { try{
   var maillist=GmailApp.getInboxThreads(i,i+x);
   n+=1;
//   Logger.log("i = "+i);
//   Logger.log("50th maillist "+maillist[50].getFirstMessageSubject()+' count '+maillist[50].getMessageCount());
//   Logger.log("maillist = "+maillist.length);
  i+=x;
  total+=maillist.length;
  }
 catch(e){if(x>1){x/=2;continue;}else{Logger.log("total mails "+labels);break;}
 return [total,n];//returns total no of mails and total no. of requests sent.
 }
 }while(maillist.length>0)
// sealed
// for(j=0;j<maillist.length;j++){
// var mails=maillist[j].getMessages();
// Utilities.sleep(100);
// for(k=0;k<mails.length;k++){
// Logger.log(mails[k].getDate());
// Logger.log("k = "+k);
//  }
//  Logger.log('j = '+j);
// sealed

 }
 
 

function getTypeStats(){
  // get number of messages from banks,facebook,google+,twitter
  getPlainStats();
}
function SocialRead()
{//mark social messages from g+,facebook,twitter,quora,zorpia and other sites as marked after a few days i.e after 1st remainder

}
function Remind()
{//remind messages from social apps after a few days i.e after given cycle
}
function CreateLabels()
{//create and assign lables
  prop=PropertiesService.getUserProperties()
  userlabels=GmailApp.getUserLabels();
  sheet=SpreadsheetApp.openById(prop.getProperty('backup'));
  var labels=[];  
    for(i=0;i<userlabels.length;i++)
    {Logger.log(userlabels[i].getName());
    labels.push(userlabels[i].getName())}
    sheet.getActiveSheet().clear();
    sheet.appendRow(['userlabels'].concat(labels));
    sheet.appendRow(['applabels'].concat(applabels));
    for (i=0;i<applabels.length;i++)
    {var make=1;
    for(j=0;j<userlabels.length;j++)
    {Logger.log(applabels[i].toLowerCase()+' : '+labels[j].toLowerCase());
    if(applabels[i].toLowerCase()==labels[j].toLowerCase())
    {make=0;}
    }
    if(make==1){
    GmailApp.createLabel(applabels[i]);
    Logger.clear();
    Logger.log('made label '+applabels[i]);
    }
    }}
    

function updatePrefSheet() //should run on every start #yet-to-implement @uday
{//create a sheet for preferences
  scriptproperties=PropertiesService.getUserProperties();
  var sheet=SpreadsheetApp.openById(scriptproperties.getProperty('defaults'));
  values=sheet.getSheetValues(8, 1, (managed+1), 3);
  //future goal is to change the storage from properties to Cache.@uday
  for(i=0;i<values.length;i++)
  {
   scriptproperties.setProperty('del_'+values[i][0],values[i][1]);
   scriptproperties.setProperty('rem_'+values[i][0],values[i][2]);  
  }
  Logger.log(scriptproperties.getProperties())
}
function onInstall()
{ Logger.log("Starting install procedure");
 precheck=DriveApp.getFoldersByName(AppName);
 if(precheck.hasNext())
 {precheck.next().setTrashed(true); }
 var root=DriveApp.createFolder(AppName);//has bug is returning a folderiterator
 var pdf=root.createFolder(pdf).getId();
 var sheet=SpreadsheetApp.create("defaults");
 var backup=SpreadsheetApp.create("backup");
 Logger.log("folder created,sheet created in root moving pendng");
 var id=DriveApp.getFileById(sheet.getId()).makeCopy('defaults',root).getId();
 var bid=DriveApp.getFileById(backup.getId()).makeCopy('backup',root).getId();
 DriveApp.getFileById(sheet.getId()).setTrashed(true);
 DriveApp.getFileById(backup.getId()).setTrashed(true);
 Logger.log("Moving complete");
 PropertiesService.getUserProperties().setProperty('defaults', id);
 PropertiesService.getUserProperties().setProperty('backup', bid);
 PropertiesService.getUserProperties().setProperty('cycles', '0');
 PropertiesService.getUserProperties().setProperty('pdf', pdf);
 Logger.log("property set complete:: set property defaults");
 Sheetsetup();
 CreateLabels();
}
