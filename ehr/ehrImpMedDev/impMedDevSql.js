var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");


exports.getImpMedDev = function (recNo, callback) {
    var sql =  "select * from xrxEhr_ImpMedDev where (Recno = " + xrxStr.strQuote(recNo) + ")";
    dbhelper.query(sql, function (err, record) {
        callback(err , record);
    });
};

exports.saveImpMedDev = function (recNo, impRecord, callback) {

  var sqlSave = "";

  if(recNo)
  {

     sqlSave =
        "update xrxEhr_ImpMedDev set " +

        " PatId = " + xrxStr.strQuoteComma(impRecord.patId) +
        " IMDDate = " + xrxStr.datQuoteComma(impRecord.imdDate) +
        " IMDCode = " + xrxStr.strQuoteComma(impRecord.imdCode) +
        " IMDDesc = " + xrxStr.strQuoteComma(impRecord.imdDesc) +
        " Json = " + xrxStr.strQuoteComma(impRecord.json) +
        " DctId = " + xrxStr.strQuoteComma(impRecord.dctId) +
        " FclId = " + xrxStr.strQuoteComma(impRecord.fclId) +
        " SNOMED = " + xrxStr.strQuoteComma(impRecord.SNOMED) +
      //  " PostDate = " + xrxStr.datQuoteComma(impRecord.postDate) +
        " UserId = " + xrxStr.strQuote(impRecord.userId) +

        "where RecNo = " + xrxStr.strQuote(recNo);

  }
  else
  {

     sqlSave =
        "insert into xrxEhr_ImpMedDev (Recno, PatId, IMDDate, IMDCode, IMDDesc, Json, DctId, FclId, SNOMED, PostDate, UserId) " +
        " values(  NEWID (), " +
        xrxStr.strQuoteComma(impRecord.patId) +
        xrxStr.datQuoteComma(impRecord.imdDate) +
        xrxStr.strQuoteComma(impRecord.imdCode) +
        xrxStr.strQuoteComma(impRecord.imdDesc) +
        xrxStr.strQuoteComma(impRecord.json) +
        xrxStr.strQuoteComma(impRecord.dctId) +
        xrxStr.strQuoteComma(impRecord.fclId) +
        xrxStr.strQuoteComma(impRecord.SNOMED) +
        " GETDATE(), " +
        xrxStr.strQuote(impRecord.userId) +
        " ) ";
    }

    //console.log(sqlSave);


    dbhelper.query(sqlSave, function (err, record) {
        callback(err , record);
    });

};
