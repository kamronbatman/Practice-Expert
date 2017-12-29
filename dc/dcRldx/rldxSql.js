var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.rldxCount = function(sqlWhereClause, callback) {

  var sqlWhereClause = sqlWhereClause;
  if(!sqlWhereClause)
    sqlWhereClause = "";

  var sql = "SELECT COUNT(*) AS COUNT FROM xrxRldx " + sqlWhereClause;

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
exports.rldxRows = function(sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback) {

      if(!sqlWhereClause){
        sqlWhereClause = "";
      }
      else{
        //sqlWhereClause = xrxStr.strClean(sqlWhereClause);
      }

      var tableName = "xrxRldx"
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
exports.rldxRowRecNo = function(recNo, callback) {

  var sql = "SELECT * FROM xrxRldx WHERE RECNO='" + recNo + "'";
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
exports.rldxExistsId = function (id, recNo, callback) {

  var sql = "select * from xrxRldx where RLDXNAME=" + xrxStr.strQuote(id) +" ";
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
exports.rldxShortCodeExsists = function (shortCode, recNo, callback) {

  var shortCode = shortCode;
  var recNo = recNo;

  var sql = "select * from xrxRldx where ShortCode=" + xrxStr.strQuote(shortCode) +" ";
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
exports.rldxSave = function(record, callback) {

  var recordnumber = record.RECNO.value;
  var sqlInsert = "";

  if(!recordnumber){
      sqlInsert = " INSERT INTO xrxRldx (RECNO, RLDXNAME) VALUES (NEWID(), '"+ record.RLDXNAME.value +"'); ";
  }

  var sqlUpdate = " UPDATE xrxRldx SET "+
                  " RldxName  = " + xrxStr.strQuoteComma(record.RLDXNAME.value) +
                  " ShortCode = " + xrxStr.strQuoteComma(record.SHORTCODE.value) +
                  " Contact   = " + xrxStr.strQuoteComma(record.CONTACT.value) +
                  " RldxType  = " + xrxStr.strQuoteComma(record.RLDXTYPE.value) +
                  " RldxClass = " + xrxStr.strQuoteComma(record.RLDXCLASS.value) +
                  " Addr      = " + xrxStr.strQuoteComma(record.ADDR.value) +
                  " Addr2     = " + xrxStr.strQuoteComma(record.ADDR2.value) +
                  " City      = " + xrxStr.strQuoteComma(record.CITY.value) +
                  " State     = " + xrxStr.strQuoteComma(record.STATE.value) +
                  " Zip       = " + xrxStr.strQuoteComma(record.ZIP.value) +
                  " HomePhone = " + xrxStr.strQuoteComma(record.HOMEPHONE.value) +
                  " WorkPhone = " + xrxStr.strQuoteComma(record.WORKPHONE.value) +
                  " CellPhone = " + xrxStr.strQuoteComma(record.CELLPHONE.value) +
                  " Fax       = " + xrxStr.strQuoteComma(record.FAX.value) +
                  " Email     = " + xrxStr.strQuoteComma(record.EMAIL.value) +
                  " Http      = " + xrxStr.strQuoteComma(record.HTTP.value) +
                  " AppColor  = " + xrxStr.strQuoteComma(record.APPCOLOR.value) +
                  " DirectAddr = " + xrxStr.strQuoteComma(record.DIRECTADDR.value) +
                  " ENTRYDATE = "+ xrxStr.strQuoteComma(record.ENTRYDATE.value) +
                  " USERID = " + xrxStr.strQuote(record.USERID.value) + " ";
                  if(recordnumber)
                      sqlUpdate += "WHERE RECNO = '"+ recordnumber +"'; ";
                  else
                      sqlUpdate += "WHERE RLDXNAME = '"+ record["RLDXNAME"].value +"'; ";

    var sql =   " BEGIN TRY "+
                " BEGIN TRANSACTION RLDX "+
                sqlInsert+
                sqlUpdate+
                " COMMIT TRANSACTION RLDX "+
                " END TRY "+
                " BEGIN CATCH "+
                " IF @@TRANCOUNT>0 ROLLBACK TRANSACTION RLDX "+
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
exports.rldxDelete = function(recNo, callback) {

    var sql = "DELETE FROM xrxRldx WHERE RECNO ='"+ recNo +"'";
    dbhelper.query(sql, function (err, record) {
        if ((!err) || typeof err === 'undefined') {
            callback(null, record);
        }
        else {
            callback(err, null);
        }
    });
};
