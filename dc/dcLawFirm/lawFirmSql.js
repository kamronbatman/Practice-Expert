var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.lawFirmCount = function(sqlWhereClause, callback) {

  var sqlWhereClause = sqlWhereClause;
  if(!sqlWhereClause)
    sqlWhereClause = "";

  var sql = "SELECT COUNT(*) AS COUNT FROM xrxLawFirm " + sqlWhereClause;

  dbhelper.query(sql,  function (err, record) {
    if ((!err) || typeof err === 'undefined'){
      if (record && record.length>0){
        callback(null,  record[0].COUNT.value);
      }
      else{
        callback (null,  0);
      }
    }
    else{
        callback(err, null);
    }
  });
};
exports.lawFirmRows = function(sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback) {

      if(!sqlWhereClause){
        sqlWhereClause = "";
      }
      else{
        //sqlWhereClause = xrxStr.strClean(sqlWhereClause);
      }

      var tableName = "xrxLawFirm"
      var sqlJoin = " ";
      var selectColumns = "*";

      var sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY "+ sortBy +" "+ sortType +" ) AS rownumber FROM " + tableName + sqlJoin + sqlWhereClause + ") AS MyDerivedTable "+
                  "WHERE rownumber >= '" + rowStart + "' AND rownumber <= '"+ rowEnd +"'";
      
      dbhelper.query(sql, function (err, record) {
        if ((!err) || typeof err === 'undefined'){
              if (record) {
                callback(null, record);
              }
              else{
                  callback(null, null);
              }
        }
        else{
              callback(err, null);
        }
      });
};
exports.lawFirmRowRecNo = function(recNo, callback) {

  var sql = "SELECT * FROM xrxLawFirm WHERE RECNO='" + recNo + "'";
  dbhelper.query(sql, function (err, record) {
    if ((!err) || typeof err === 'undefined'){
          if (record && record.length>0){
            callback(null, record[0]);
          }
          else{
              callback(null, null);
          }
    }
    else{
          callback(err, null);
    }
  });
};
exports.lawFirmExistsId = function (id, recNo, callback) {

  var sql = "select * from xrxLawFirm where LAWFIRM=" + xrxStr.strQuote(id) +" ";
  if(recNo){
      sql += " AND RECNO <> '" + recNo + "'";
  }
  dbhelper.query(sql, function (err, record) {
      if (err){
          callback(err, null);
      }
      else{
        callback(null , record);
      }
  });
};
exports.lawFirmSave = function(record, callback) {

  var recordnumber = record.RECNO.value;
  var sqlInsert = "";

  if(!recordnumber){
      sqlInsert = " INSERT INTO xrxLawFirm (RECNO, LAWFIRM) VALUES (NEWID(), '"+ record.LAWFIRM.value +"'); ";
  }

    var sqlUpdate = " UPDATE xrxLawFirm SET "+
        " LawFirm = " + xrxStr.strQuoteComma(record.LAWFIRM.value) +
        " ShortCode = " + xrxStr.strQuoteComma(record.SHORTCODE.value) +
        " Contact   = " + xrxStr.strQuoteComma(record.CONTACT.value) +
        " Addr      = " + xrxStr.strQuoteComma(record.ADDR.value) +
        " Addr2     = " + xrxStr.strQuoteComma(record.ADDR2.value) +
        " City      = " + xrxStr.strQuoteComma(record.CITY.value) +
        " State     = " + xrxStr.strQuoteComma(record.STATE.value) +
        " Zip       = " + xrxStr.strQuoteComma(record.ZIP.value) +
        " Phone = " + xrxStr.strQuoteComma(record.PHONE.value) +
        " Ext = " + xrxStr.strQuoteComma(record.EXT.value) +
        " Fax       = " + xrxStr.strQuoteComma(record.FAX.value) +
        " Email     = " + xrxStr.strQuoteComma(record.EMAIL.value) +
        " ENTRYDATE = "+ xrxStr.strQuoteComma(record.ENTRYDATE.value) +
        " USERID = " + xrxStr.strQuote(record.USERID.value) + " ";
    if(recordnumber)
        sqlUpdate += "WHERE RECNO = '"+ recordnumber +"'; ";
    else
        sqlUpdate += "WHERE LAWFIRM = '"+ record["LAWFIRM"].value +"'; ";

    var sql =   " BEGIN TRY "+
                " BEGIN TRANSACTION LAWFIRM "+
                sqlInsert+
                sqlUpdate+
                " COMMIT TRANSACTION LAWFIRM "+
                " END TRY "+
                " BEGIN CATCH "+
                " IF @@TRANCOUNT>0 ROLLBACK TRANSACTION LAWFIRM "+
                " END CATCH ";

  dbhelper.query(sql,  function (err, record) {
      if (err){
        callback(err, null);
      }
      else{
        callback(null , record);
      }
  });
};

exports.lawFirmShortCodeExsists = function (shortCode, recNo, callback) {

    var shortCode = shortCode;
    var recNo = recNo;

    var sql = "select * from xrxLawFirm where ShortCode=" + xrxStr.strQuote(shortCode) +" ";
    if(recNo)
    {
        sql += " AND RECNO <> '" + recNo + "'";
    }

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

exports.lawFirmDelete = function(recNo, callback) {

    var sql = "DELETE FROM xrxLawFirm WHERE RECNO ='"+ recNo +"'";
    dbhelper.query(sql, function (err, record) {
        if ((!err) || typeof err === 'undefined') {
            callback(null, record);
        }
        else {
            callback(err, null);
        }
    });
};
