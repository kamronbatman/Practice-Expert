var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");
var cmGlb = remote.getGlobal('cmGlb');

const _paramName = "DepositTicket";

exports.printBankDeposit = function (para, callback) {

    _storedProcedure = "xrxRpt_DepositSlip";
    _reportName = "xrxRpt_DepositTicket";
    parameters = [
      {parameter: 'UserId', type: 'VarChar', value: para.USERID},
      {parameter: 'FromDate', type: 'SmallDateTime', value: para.FROMDATE},
      {parameter: 'ToDate', type: 'SmallDateTime', value: para.TODATE},
      {parameter: 'BllPrvId', type: 'VarChar', value: para.BLLPRV},
      {parameter: 'PayerName', type: 'VarChar', value: para.PAYERNAME},
      {parameter: 'BatchNo', type: 'VarChar', value: para.BATCHNO},
      {parameter: 'UserIdFilter', type: 'VarChar', value: para.USERIDFILTER},
      {parameter: 'cash', type: 'VarChar', value: para.CASH},
      {parameter: 'EFT', type: 'VarChar', value: para.EFT},
      {parameter: 'checks', type: 'VarChar', value: para.CHECKS},
      {parameter: 'credits', type: 'VarChar', value: para.CREDITS},
      {parameter: 'BulkPay', type: 'VarChar', value: para.BULKPAY},
      {parameter: 'autoRemitt', type: 'VarChar', value: para.AUTOREMITT},
      {parameter: 'showPayerName', type: 'VarChar', value: para.SHOWPAYERNAME}
  ];

    dbhelper.storeProcedure(_storedProcedure, parameters, function (err, record) {
        if (err) {
            console.log(err);
            callback('Error: ' + err, record);
        }
        else {
           var child = require('child_process').execFile;
           //Change this path
           var executablePath = cmGlb.mainFolder + "xrxRpCrystalReports.exe";
           //var executablePath = "D:\\Calmed_NodeJs\\Supporting_Projects\\xrxReporting_VS10\\xrxReporting_VS10\\bin\\Debug\\xrxReporting_VS10";
           var reportParameters = {
             'CompanyName'  : para.COMPANYNAME,
             'ProviderName' : para.PROVIDERNAME,
             '@UserId' : para.USERID,
             'FromDate' : para.FROMDATE,
             'ToDate' : para.TODATE,
             'BllPrvId' : para.BLLPRV,
             'BatchNo' : para.BATCHNO,
             '@UserIdFilter'  : para.USERIDFILTER
          };
          var reportParametersStr =  JSON.stringify(reportParameters);
          var parameters = [cmGlb.connectionDataSourceName, dbhelper.config.options.database, dbhelper.config.userName, dbhelper.config.password, _paramName, _reportName, cmGlb.mainFolder, reportParametersStr];
          child(executablePath, parameters, function(err, data) {
                if(err) {
                  console.log(err);
                  callback(err , null);
                }
                else {
                  console.log(data.toString());
                  callback(null , record);
                }
           });

        }
    });
}
exports.xmlGetParam = function (callback) {
  var sql = "select XmlText from xrxParam where ParamName = " + xrxStr.strQuote(_paramName);
  dbhelper.query(sql, function (err, record) {
      if (err) {
          callback(err, null);
      }
      else {
        callback(null , record);
        }
  });
};
exports.xmlUpdateParam = function(xmlText, userId, callback) {
  var sql = "DELETE FROM xrxParam WHERE ParamName = " +
             xrxStr.strQuote(_paramName) +
            ";  INSERT INTO xrxParam (ParamName, XmlText, EntryDate, UserId) VALUES (" +
             xrxStr.strQuote(_paramName) + ", " + xrxStr.strQuote(xmlText) + ", GETDATE(), " + xrxStr.strQuote(userId) + ");";
  dbhelper.query(sql, function (err, record) {
      if (err)
      {
          callback(err, null);
      }
      else
      {
        callback(null , record);
      }
  });
}
