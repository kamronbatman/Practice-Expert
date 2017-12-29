var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.refCount = function(sqlWhereClause, callback) {

  var sqlWhereClause = sqlWhereClause;
  if(!sqlWhereClause)
    sqlWhereClause = "";

  var sql = "SELECT COUNT(*) AS COUNT FROM xrxRef " + sqlWhereClause;

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
exports.refRows = function(sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback) {

      if(!sqlWhereClause){
        sqlWhereClause = "";
      }
      else{
        //sqlWhereClause = xrxStr.strClean(sqlWhereClause);
      }

      var tableName = "xrxRef"
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
exports.refRowRecNo = function(recNo, callback) {
  var sql = "SELECT * FROM xrxRef WHERE RECNO='" + recNo + "'";
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
exports.refExistsId = function (id, recNo, callback) {

  var sql = "select * from xrxRef where REFNAME=" + xrxStr.strQuote(id) +" ";
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
exports.refSave = function(record, callback) {

  var recordnumber = record.RECNO.value;
  var sqlInsert = "";

  if(!recordnumber){
      sqlInsert = " INSERT INTO xrxRef (RECNO, REFNAME) VALUES (NEWID(), '"+ record.REFNAME.value +"'); ";
  }

  var sqlUpdate =
      " UPDATE xrxRef SET "+
      " RefName  = " + xrxStr.strQuoteComma(record.REFNAME.value) +
      " ShortCode = " + xrxStr.strQuoteComma(record.SHORTCODE.value) +
      " LastName   = " + xrxStr.strQuoteComma(record.LASTNAME.value) +
      " FirstName  = " + xrxStr.strQuoteComma(record.FIRSTNAME.value) +
      " Title  = " + xrxStr.strQuoteComma(record.TITLE.value) +
      " Mi  = " + xrxStr.strQuoteComma(record.MI.value) +
      " Addr      = " + xrxStr.strQuoteComma(record.ADDR.value) +
      " Addr2     = " + xrxStr.strQuoteComma(record.ADDR2.value) +
      " City      = " + xrxStr.strQuoteComma(record.CITY.value) +
      " State     = " + xrxStr.strQuoteComma(record.STATE.value) +
      " Zip       = " + xrxStr.strQuoteComma(record.ZIP.value) +
      " Phone = " + xrxStr.strQuoteComma(record.PHONE.value) +
      " PhoneExt = " + xrxStr.strQuoteComma(record.PHONEEXT.value) +
      " Fax       = " + xrxStr.strQuoteComma(record.FAX.value) +
      " Email     = " + xrxStr.strQuoteComma(record.EMAIL.value) +
      " RefClass = " + xrxStr.strQuoteComma(record.REFCLASS.value) +
      " ENTRYDATE = "+ xrxStr.strQuoteComma(record.ENTRYDATE.value) +
      " USERID = " + xrxStr.strQuote(record.USERID.value) + " ";
                  if(recordnumber)
                      sqlUpdate += "WHERE RECNO = '"+ recordnumber +"'; ";
                  else
                      sqlUpdate += "WHERE REFNAME = '"+ record["REFNAME"].value +"'; ";

    var sql =   " BEGIN TRY "+
                " BEGIN TRANSACTION REF "+
                sqlInsert+
                sqlUpdate+
                " COMMIT TRANSACTION REF "+
                " END TRY "+
                " BEGIN CATCH "+
                " IF @@TRANCOUNT>0 ROLLBACK TRANSACTION REF "+
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

exports.refShortCodeExsists = function (shortCode, recNo, callback) {

    var shortCode = shortCode;
    var recNo = recNo;

    var sql = "select * from xrxRef where ShortCode=" + xrxStr.strQuote(shortCode) +" ";
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

exports.refDelete = function(recNo, callback) {

    var sql = "DELETE FROM xrxRef WHERE RECNO ='"+ recNo +"'";
    dbhelper.query(sql, function (err, record) {
        if ((!err) || typeof err === 'undefined') {
            callback(null, record);
        }
        else {
            callback(err, null);
        }
    });
};
