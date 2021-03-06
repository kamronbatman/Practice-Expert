var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.astCount = function(sqlWhereClause, callback) {

  var sqlWhereClause = sqlWhereClause;
  if(!sqlWhereClause)
    sqlWhereClause = "";

  var sql = "SELECT COUNT(*) AS COUNT FROM xrxAst " + sqlWhereClause;

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
exports.astRows = function(sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback) {

      if(!sqlWhereClause){
        sqlWhereClause = "";
      }
      else{
        //sqlWhereClause = xrxStr.strClean(sqlWhereClause);
      }

      var tableName = "xrxAst"
      var sqlJoin = " ";
      var selectAstumns = "*";

      var sql = "SELECT  *  FROM (SELECT "+selectAstumns+", ROW_NUMBER() OVER (ORDER BY "+ sortBy +" "+ sortType +" ) AS rownumber FROM " + tableName + sqlJoin + sqlWhereClause + ") AS MyDerivedTable "+
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
exports.astRowRecNo = function(recNo, callback) {

  var sql = "SELECT * FROM xrxAst WHERE RECNO='" + recNo + "'";
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
exports.astExistsId = function (id, recNo, callback) {

  var sql = "select * from xrxAst where ASTID=" + xrxStr.strQuote(id) +" ";
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
exports.astSave = function(record, callback) {

  var recordnumber = record.RECNO.value;
  var sqlInsert = "";

  if(!recordnumber){
      sqlInsert = " INSERT INTO xrxAst (RECNO, ASTID) VALUES (NEWID(), '"+ record.ASTID.value +"'); ";
  }

  var sqlUpdate =
      " UPDATE xrxAst SET "+
      " AstId  = " + xrxStr.strQuoteComma(record.ASTID.value) +
      " ShortCode = " + xrxStr.strQuoteComma(record.SHORTCODE.value) +
      " FullName   = " + xrxStr.strQuoteComma(record.FULLNAME.value) +
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
      " TypeQualifier   = " + xrxStr.strQuoteComma(record.TYPEQUALIFIER.value) +
      " HcfaLastName   = " + xrxStr.strQuoteComma(record.HCFALASTNAME.value) +
      " HcfaFirstName  = " + xrxStr.strQuoteComma(record.HCFAFIRSTNAME.value) +
      " HcfaTitle  = " + xrxStr.strQuoteComma(record.HCFATITLE.value) +
      " HcfaMi  = " + xrxStr.strQuoteComma(record.HCFAMI.value) +
      " ClassCd = " + xrxStr.strQuoteComma(record.CLASSCD.value) +
      " Specialty      = " + xrxStr.strQuoteComma(record.SPECIALTY.value) +
      " TaxonomyCode      = " + xrxStr.strQuoteComma(record.TAXONOMYCODE.value) +
      " ENTRYDATE = "+ xrxStr.strQuoteComma(record.ENTRYDATE.value) +
      " USERID = " + xrxStr.strQuote(record.USERID.value) + " ";
                  if(recordnumber)
                      sqlUpdate += "WHERE RECNO = '"+ recordnumber +"'; ";
                  else
                      sqlUpdate += "WHERE ASTID = '"+ record["ASTID"].value +"'; ";

    var sql =   " BEGIN TRY "+
                " BEGIN TRANSACTION AST "+
                sqlInsert+
                sqlUpdate+
                " COMMIT TRANSACTION AST "+
                " END TRY "+
                " BEGIN CATCH "+
                " IF @@TRANCOUNT>0 ROLLBACK TRANSACTION AST "+
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

exports.astShortCodeExsists = function (shortCode, recNo, callback) {

    var shortCode = shortCode;
    var recNo = recNo;

    var sql = "select * from xrxAst where ShortCode=" + xrxStr.strQuote(shortCode) +" ";
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
exports.astDelete = function(recNo, callback) {

    var sql = "DELETE FROM xrxAst WHERE RECNO ='"+ recNo +"'";
    dbhelper.query(sql, function (err, record) {
        if ((!err) || typeof err === 'undefined') {
            callback(null, record);
        }
        else {
            callback(err, null);
        }
    });
};
