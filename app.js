const fs = require('fs');
const os = require('os');
const path = require('path');
const electron = require('electron');

// Module to control application life.
const app = electron.app;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
//*************
//require("electron-reload")(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

const ipcMain = require('electron').ipcMain;
const shell = electron.shell

//Module to parse command line arguements.
const parseCommandline = require('./xrx_modules/parse-commandline');

const dbhelper = require("./xrx_modules/sqldbhelper");
const cmGlb = require("./cm/cm-glb");

let appPath = app.getAppPath();

global.dbhelper = dbhelper;
global.cmGlb = cmGlb;
global.appPath = appPath.replace(/\\/g, '/');
global.nodeModulesPath = appPath.replace(/\\/g, '/') + "/node_modules/";


let mainWindow;
let currentWindow;

function getCmdArgs()
{
  //Command line arguements
  //console.log(process.argv[1]);

  let args = process.argv;

  if (args && args.length > 0)
  {
      if((args[1] && args[1] == '.') || (!args[1]))
      {
        // Username/password to test database has been changed to protect original author, whoever that may be.
        parseCommandline.parseCommandLineArgs("/ConnectionString:Provider=SQLOLEDB.1;Integrated|Security=SSPI;Persist|Security|Info=True;Initial|Catalog=Xerex_dowood;Data|Source=calmedtest.database.windows.net;User|Id=sa;password=password;Use|Procedure|for|Prepare=1;Auto|Translate=True;Packet|Size=4096;Workstation|ID=tommagami-pc;Use|Encryption|for|Data=False /UserId:DOT /SqlAzure:true /CompanyId:Xerex_DOWOOD /CompanyName:DOWOOD /License:EMG /MainFolder:\\CALMED\\ /DctId:DW /FclId:11 /RfdId:11 /RfdFax:949-719-6771 /PatId:1111 /PatName:TEST /InsType:1 /DateOfVisit:1/23/17|0:00:00 /Recno:8B7AFEE0-F9EE-46B0-B1F3-54A70CAF289A /RunningApp:portalNotRegistered");
      }
      else if(args[1])
      {
        parseCommandline.parseCommandLineArgs(args[1]);
      }
  }

  let connection = parseCommandline.getdbConnectionParas();

  let server = '';
  let instanceName = '';

  if(connection.DataSource)
  {
    var arrDataSource = connection.DataSource.split("\\");
    if(arrDataSource)
    {
      if(arrDataSource[0])
      {
        server = arrDataSource[0].trim();
      }
      if(arrDataSource[1])
      {
        instanceName = arrDataSource[1].trim();
      }
    }
  }

  dbhelper.config.server = server;
  dbhelper.config.options.instanceName = instanceName;
  dbhelper.config.userName = connection.UserId;
  dbhelper.config.password = connection.password;
  dbhelper.config.options.database = connection.InitialCatalog;

  var cmdArgs = parseCommandline.getcommandLineArgs();

  cmGlb.companyId = cmdArgs.CompanyId;
  cmGlb.companyName = cmdArgs.CompanyName;
  cmGlb.companyStreet = cmdArgs.CompanyStreet;
  cmGlb.companyCityStateZip = cmdArgs.CompanyCityStateZip;
  cmGlb.companyPhoneFax = cmdArgs.CompanyPhoneFax;
  console.log(cmdArgs.SqlAzure);
  cmGlb.isSqlAzure = false;

  if (dbhelper.config.server.toLowerCase() == 'calmedsql1.database.windows.net')
  {
      dbhelper.config.options.encrypt = true;
      cmGlb.isSqlAzure = true;

  };

  cmGlb.providerName = cmdArgs.ProviderName;
  if (cmGlb.providerName == "") cmGlb.providerName = cmGlb.companyName;
  cmGlb.providerStreet = cmdArgs.ProviderStreet;
  if (cmGlb.providerStreet == "") cmGlb.providerStreet = cmGlb.companyStreet
  cmGlb.providerCityStateZip = cmdArgs.ProviderCityStateZip;
  if (cmGlb.providerCityStateZip == "") cmGlb.providerCityStateZip = cmGlb.companyCityStateZip;
  cmGlb.providerPhoneFax = cmdArgs.ProviderPhoneFax;
  if (cmGlb.providerPhoneFax == "") cmGlb.providerPhoneFax = cmGlb.companyPhoneFax;

  cmGlb.userId = cmdArgs.UserId;
  cmGlb.patId = cmdArgs.PatId;
  cmGlb.patName = cmdArgs.PatName;
  cmGlb.dctId = cmdArgs.DctId;
  cmGlb.fclId = cmdArgs.FclId;
  cmGlb.rfdId = cmdArgs.RfdId;
  cmGlb.rfdFax = cmdArgs.RfdFax;
  cmGlb.license = cmdArgs.License;
  cmGlb.mainFolder = cmdArgs.MainFolder;
  cmGlb.dateOfVisit = cmdArgs.DateOfVisit;
  cmGlb.recno = cmdArgs.Recno;
  cmGlb.insType = cmdArgs.InsType;
  if (cmGlb.isSqlAzure == true) {
      cmGlb.databaseI = dbhelper.config.options.database;
  }
  else
  {
      cmGlb.databaseI = dbhelper.config.options.database + "_I";
  }
  cmGlb.connectionDataSourceName =  connection.DataSource? connection.DataSource.trim() : "";
  cmGlb.patEmail = cmdArgs.PatEmail;
  cmGlb.firstName = cmdArgs.FirstName;
  cmGlb.visitType = cmdArgs.VisitType;
  cmGlb.RunningApp = cmdArgs.RunningApp;
}

function createWindow () {

  getCmdArgs();

  if (cmGlb.RunningApp == 'dcZip'){
    mainWindow = new BrowserWindow({ width: 1024, height: 600, center: true});
    mainWindow.loadURL('file://' + __dirname + '/dc/dcZip/zipList.html');
  }
  else if (cmGlb.RunningApp == 'dcRldx'){
    mainWindow = new BrowserWindow({ width: 1024, height: 660, center: true });
    mainWindow.loadURL('file://' + __dirname + '/dc/dcRldx/rldxList.html');
    currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'dcAst'){
    mainWindow = new BrowserWindow({ width: 1000, height: 770, center: true });
    mainWindow.loadURL('file://' + __dirname + '/dc/dcAst/astList.html');
    currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'dcRfd'){
      mainWindow = new BrowserWindow({ width: 1000, height: 770, center: true });
      mainWindow.loadURL('file://' + __dirname + '/dc/dcRfd/rfdList.html');
      currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'dcLawFirm'){
    mainWindow = new BrowserWindow({ width: 1024, height: 660, center: true });
    mainWindow.loadURL('file://' + __dirname + '/dc/dcLawFirm/lawFirmList.html');
    currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'dcAtt'){
      mainWindow = new BrowserWindow({ width: 1024, height: 660, center: true });
      mainWindow.loadURL('file://' + __dirname + '/dc/dcAtt/attList.html');
      currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'dcAtt'){
    mainWindow = new BrowserWindow({ width: 1024, height: 660, center: true });
    mainWindow.loadURL('file://' + __dirname + '/dc/dcAtt/attList.html');
    currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'dcCol'){
    mainWindow = new BrowserWindow({ width: 1024, height: 660, center: true });
    mainWindow.loadURL('file://' + __dirname + '/dc/dcCol/colList.html');
    currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'dcRef'){
      mainWindow = new BrowserWindow({ width: 1024, height: 660, center: true });
      mainWindow.loadURL('file://' + __dirname + '/dc/dcRef/refList.html');
      currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'dcFcl'){
    mainWindow = new BrowserWindow({ width: 1024, height: 660, center: true });
    mainWindow.loadURL('file://' + __dirname + '/dc/dcFcl/fclList.html');
    currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'dcBllPrv'){
    mainWindow = new BrowserWindow({ width: 1024, height: 660, center: true });
    mainWindow.loadURL('file://' + __dirname + '/dc/dcBllPrv/bllPrvList.html');
    currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'appRooms'){
    mainWindow = new BrowserWindow({width: 1024, height: 768, center : true});
    mainWindow.loadURL('file://' + __dirname + '/xrxAppRooms/views/approoms.html');
  }
  else if (cmGlb.RunningApp == 'xrxScanIns'){
    mainWindow = new BrowserWindow({width: 1024, height: 768, center : true});
    mainWindow.loadURL('file://' + __dirname + '/xrxAcuantScan/views/scan-ins.html');
  }
  else if (cmGlb.RunningApp == 'xrxScanDl'){
    mainWindow = new BrowserWindow({width: 1024, height: 768, center : true});
    mainWindow.loadURL('file://' + __dirname + '/xrxAcuantScan/views/scan-dl.html');
  }
  else if (cmGlb.RunningApp == 'rpDepositTicket'){
    mainWindow = new BrowserWindow({
        width: 850,
        height: 570,
        minWidth: 800,
        minHeight: 480,
        center: true,
        resizable : false
    });
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/rp/rpDepositTicket/depositTicketEdit.html');
  }
  else if (cmGlb.RunningApp == 'rpDailyActivity'){
      mainWindow = new BrowserWindow({
          width: 850,
          height: 570,
          minWidth: 800,
          minHeight: 480,
          center: true,
          resizable : false
      });
      // and load the index.html of the app.
      mainWindow.loadURL('file://' + __dirname + '/rp/rpDailyActivity/dailyActivityEdit.html');
  }
  else if(cmGlb.RunningApp == 'ehrIcd'){
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 760, height: 600, resizable: false});
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/ehr/ehrIcdEdit/icdEdit.html');
  }
  else if (cmGlb.RunningApp == 'xrxEhrCqmGuide'){
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 850, height: 768, center : true});
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/onc/xrxEhrCqmGuide/cqm-guide.html');
  }
  else if(cmGlb.RunningApp == 'trIcdSearch'){
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 750, height: 500, resizable: false});
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/tr/trIcdSearch/trIcdSearch.html');
  }
  else if (cmGlb.RunningApp == 'wcFaceSheet'){
    mainWindow = new BrowserWindow({
      width: 960,
      height: 720,
      minWidth: 800,
      minHeight: 600,
      center: true
    });
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/wc/wcFaceSheet/faceSheetEdit.html');
  }
  else if (cmGlb.RunningApp == 'xrxPtDemographic'){
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1024, height: 768});
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/pt/xrxPtDemographic/views/edit.html');

  }
  else if (cmGlb.RunningApp == 'ptNpp'){
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 886,
      height: 536,
      center: true,
      resizable: false
      //frame: false,
    });
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/pt/ptNpp/nppEdit.html');
  }
  else if (cmGlb.RunningApp == 'ptOnc'){
      // Create the browser window.
      mainWindow = new BrowserWindow({
          width: 886,
          height: 336,
          center: true,
          resizable: false
          //frame: false,
      });
      // and load the index.html of the app.
      mainWindow.loadURL('file://' + __dirname + '/pt/ptOnc/oncEdit.html');
  }
  else if (cmGlb.RunningApp == 'letters'){
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        center: true
      //frame: false,
    });
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/letters/letters.html');
  }
  else if (cmGlb.RunningApp == 'ehrClinicalSummary'){
      mainWindow = new BrowserWindow({ width: 1024, height: 768, minWidth: 800, minHeight: 600, center: true });
      mainWindow.loadURL('file://' + __dirname + '/ehr/ehrClinicalSummary/clinicalSummary.html');
      currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'ehrClinicalSummaries'){
      mainWindow = new BrowserWindow({ width: 1024, height: 768, minWidth: 800, minHeight: 600, center: true });
      mainWindow.loadURL('file://' + __dirname + '/ehr/ehrClinicalSummaries/clinicalSummaries.html');
      currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'ehrPcpLetter'){
      mainWindow = new BrowserWindow({ width: 1024, height: 768, minWidth: 800, minHeight: 600, center: true });
      mainWindow.loadURL('file://' + __dirname + '/ehr/ehrPcpLetter/pcpLetter.html');
      currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'wcProofOfService'){
    mainWindow = new BrowserWindow({
        width: 900,
        height: 768,
        minWidth: 850,
        minHeight: 650,
        center: true
    });
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/wc/wcProofOfService/proofOfServiceEdit.html');
  }
  else if (cmGlb.RunningApp == 'wcPr1'){

      mainWindow = new BrowserWindow({
          width: 1024,
          height: 768,
          minWidth: 850,
          minHeight: 650,
          center: true
      });
      // and load the index.html of the app.
      mainWindow.loadURL('file://' + __dirname + '/wc/pr1/pr1Edit.html');
  }
  else if (cmGlb.RunningApp == 'wcPr2'){

    mainWindow = new BrowserWindow({
        width: 900,
        height: 768,
        minWidth: 850,
        minHeight: 650,
        center: true
    });
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/wc/pr2/pr2Edit.html');
  }
  else if (cmGlb.RunningApp == 'xrxInventory') {
      mainWindow = new BrowserWindow({width: 1024, height: 768, center : true});
      mainWindow.loadURL('file://' + __dirname + '/dc/xrxInventory/views/list.html');
  }
  else if (cmGlb.RunningApp == 'xrxTransaction') {
      mainWindow = new BrowserWindow({width: 1024, height: 768, center : true});
      mainWindow.loadURL('file://' + __dirname + '/dc/xrxTransaction/views/list.html');
  }
  else if (cmGlb.RunningApp == 'ehrImpMedDev') {

      mainWindow = new BrowserWindow({ width: 800, height: 300, minWidth: 400, minHeight: 200, center: true });
      mainWindow.loadURL('file://' + __dirname + '/ehr/ehrImpMedDev/impMedDev.html');
      currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp == 'ehrImpMedDevView') {

      mainWindow = new BrowserWindow({ width: 1024, height: 768, minWidth: 800, minHeight: 600, center: true });
      mainWindow.loadURL('file://' + __dirname + '/ehr/ehrImpMedDev/impMedDevView.html');
      currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp.toLowerCase() == 'portalnotregistered') {

      mainWindow = new BrowserWindow({ width: 1024, height: 768, minWidth: 800, minHeight: 600, center: true });
      mainWindow.loadURL('file://' + __dirname + '/ehr/ehrPortalInformation/didNotRegister.html');
      currentWindow = mainWindow;
  }
  else if (cmGlb.RunningApp.toLowerCase() == 'portalunreadmessages') {

      mainWindow = new BrowserWindow({ width: 1024, height: 768, minWidth: 800, minHeight: 600, center: true });
      mainWindow.loadURL('file://' + __dirname + '/ehr/ehrPortalInformation/unReadMessages.html');
      currentWindow = mainWindow;
  }




    // Open the DevTools *******.
  //mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
