var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");
var cmGlb = remote.getGlobal('cmGlb');

const _paramName = "DailyActivity";

exports.printDailyActivity = function (para, callback) {

    _storedProcedure = "xrxRpt_DailyActivity";
    _reportName = "xrxRpt_DailyActivity";
    parameters = [
        {parameter: 'UserId', type: 'VarChar', value: para.USERID}, //Current user generating the report
        {parameter: 'UserIdFilter', type: 'VarChar', value: para.USERIDFILTER}, //used for filter
        {parameter: 'FromDate', type: 'SmallDateTime', value: para.FROMDATE},
        {parameter: 'ToDate', type: 'SmallDateTime', value: para.TODATE},
        {parameter: 'ReportType', type: 'VarChar', value: para.ReportType},
        {parameter: 'Coverage', type: 'VarChar', value: para.Coverage},
        {parameter: 'PrmInsId', type: 'VarChar', value: para.PrmInsId},
        {parameter: 'SecInsId', type: 'VarChar', value: para.SecInsId},
        {parameter: 'EmpId', type: 'VarChar', value: para.EmpId},
        {parameter: 'RefPerson', type: 'VarChar', value: para.RefPerson},
        {parameter: 'AttId', type: 'VarChar', value: para.AttId},
        {parameter: 'PatClass', type: 'VarChar', value: para.PatClass},
        {parameter: 'CptCode', type: 'VarChar', value: para.CptCode},
        {parameter: 'State', type: 'VarChar', value: para.State},
        {parameter: 'CptClass', type: 'VarChar', value: para.CptClass},
        {parameter: 'DctCLass', type: 'VarChar', value: para.DctCLass},
        {parameter: 'DctId', type: 'VarChar', value: para.DctId},
        {parameter: 'AstId', type: 'VarChar', value: para.AstId},
        {parameter: 'RfdId', type: 'VarChar', value: para.RfdId},
        {parameter: 'FclId', type: 'VarChar', value: para.FclId},
        {parameter: 'BllPrvId', type: 'VarChar', value: para.BllPrvId},
        {parameter: 'Group1By', type: 'VarChar', value: para.Group1By},
        {parameter: 'Group2By', type: 'VarChar', value: para.Group2By},
        {parameter: 'BatchNo', type: 'VarChar', value: para.BatchNo},
        {parameter: 'superBillNo', type: 'VarChar', value: para.superBillNo},
        {parameter: 'ICF', type: 'VarChar', value: para.ICF},
        {parameter: 'ParamCharges', type: 'VarChar', value: para.ParamCharges},
        {parameter: 'ParamClaims', type: 'VarChar', value: para.ParamClaims},
        {parameter: 'ParamPayments', type: 'VarChar', value: para.ParamPayments},
        {parameter: 'ParamWriteoffs', type: 'VarChar', value: para.ParamWriteoffs},
        {parameter: 'ParamAdjustments', type: 'VarChar', value: para.ParamAdjustments},
        {parameter: 'ParamRefunds', type: 'VarChar', value: para.ParamRefunds},
        {parameter: 'ParamStatements', type: 'VarChar', value: para.ParamStatements},
        {parameter: 'PageBreakBetDay', type: 'VarChar', value: para.PageBreakBetDay},
        {parameter: 'UseDepositDate', type: 'VarChar', value: para.UseDepositDate},
        {parameter: 'CalcHist', type: 'VarChar', value: para.CalcHist},
        {parameter: 'ParamChargesOnly', type: 'VarChar', value: para.PARAMCHARGESONLY}
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
            '@UserId' : para.USERID,
            '@UserIdFilter' : para.USERIDFILTER,
            'FromDate' : para.FROMDATE,
            'ToDate' : para.TODATE,
            'ReportType' : para.ReportType,
            'Coverage' : para.Coverage,
            'PrmInsId' : para.PrmInsId,
            'SecInsId' : para.SecInsId,
            'EmpId' : para.EmpId,
            'RefPerson' : para.RefPerson,
            'AttId' : para.AttId,
            'PatClass' : para.PatClass,
            'CptCode' : para.CptCode,
            'State' : para.State,
            'CptClass' : para.CptClass,
            'DctCLass' : para.DctCLass,
            'DctId' : para.DctId,
            'AstId' : para.AstId,
            'RfdId' : para.RfdId,
            'FclId' : para.FclId,
            'BllPrvId' : para.BllPrvId,
            'Group1By' : para.Group1By,
            'Group2By' : para.Group2By,
            'BatchNo' : para.BatchNo,
            'superBillNo' : para.superBillNo,
            'ICF' : para.ICF,
            'ParamCharges' : para.ParamCharges,
            'ParamClaims' : para.ParamClaims,
            'ParamPayments' : para.ParamPayments,
            'ParamWriteoffs' : para.ParamWriteoffs,
            'ParamAdjustments' : para.ParamAdjustments,
            'ParamRefunds' : para.ParamRefunds,
            'ParamStatements' : para.ParamStatements,
            'PageBreakBetDay' : para.PageBreakBetDay,
            'UseDepositDate' : para.UseDepositDate,
            'CalcHist' : para.CalcHist,
            'ParamChargesOnly' : para.PARAMCHARGESONLY
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
