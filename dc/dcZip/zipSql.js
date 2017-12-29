var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.zipCount = function(sqlWhereClause, callback) {

  var sqlWhereClause = sqlWhereClause;
  if(!sqlWhereClause)
  sqlWhereClause = "";

  var sql = "SELECT COUNT(*) AS COUNT FROM xrxZip " + sqlWhereClause;

  dbhelper.query(sql,  function (err, record) {
    if ((!err) || typeof err === 'undefined')
    {
      if (record && record.length>0)
      {
        callback(null,  record[0].COUNT.value);
      }
      else
      {
        callback (null,  0);
      }
    }
    else
    {
        callback(err, null);
    }
  });

}

exports.zipRows = function(sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback) {

      if(!sqlWhereClause)
        sqlWhereClause = "";

      var tableName = "xrxZip"
      var sqlJoin = " ";
      var selectColumns = "*";

      var sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY "+ sortBy +" "+ sortType +" ) AS rownumber FROM " + tableName + sqlJoin + sqlWhereClause + ") AS MyDerivedTable "+
                "WHERE rownumber >= '" + rowStart + "' AND rownumber <= '"+ rowEnd +"'";

      console.log(sql);
      dbhelper.query(sql, function (err, record) {
        if ((!err) || typeof err === 'undefined')
        {
              if (record) {

                callback(null, record);

              }
              else
              {
                  callback(null, null);

              }
        }
        else
        {
              callback(err, null);
        }
      });
}

exports.zipRowRecNo = function(recNo, callback) {

  var sql = "SELECT * FROM xrxZip WHERE RECNO='" + recNo + "'";


  dbhelper.query(sql, function (err, record) {
    if ((!err) || typeof err === 'undefined')
    {
          if (record && record.length>0)
          {
            callback(null, record[0]);
          }
          else
          {
              callback(null, null);
          }
    }
    else
    {
          callback(err, null);
    }
  });
}

exports.zipRowZipCode = function(zipCode, callback) {

  var sql = "select * from xrxZip where ZipCode='" + zipCode + "'";

  dbhelper.query(sql, function (err, record) {

    if ((!err) || typeof err === 'undefined')
    {
          if (record && record.length>0)
          {
            callback(null, record[0]);
          }
          else
          {
              callback(null, null);
          }
    }
    else
    {
          callback(err, null);
    }
  });
}

exports.zipExists = function (zip, recNo, callback) {

  var zip = zip;
  var recNo = recNo;

  var sql = "select RecNo, ZipCode, ShortCode, City, State, Phone, Tax, TaxCode from xrxZip where ZipCode=" + xrxStr.strQuote(zip) +" ";
  if(recNo){
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

exports.zipShortCodeExsists = function (shortCode, recNo, callback) {

  var shortCode = shortCode;
  var recNo = recNo;

  var sql = "select * from xrxZip where ShortCode=" + xrxStr.strQuote(shortCode) +" ";
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

exports.zipSave = function(record, callback) {



  var recordnumber = record.RECNO.value;

  var sqlInsert = "";
  if(!recordnumber)
      sqlInsert = " INSERT INTO xrxZip (RECNO, ZIPCODE, CITY) VALUES (NEWID(), " + xrxStr.strQuote(record.ZIPCODE.value) + "," + xrxStr.strQuote(record.CITY.value) +" ); ";
  var sqlUpdate = " UPDATE xrxZip SET "+
                  " ZipCode   = " + xrxStr.strQuoteComma(record.ZIPCODE.value) +
                  " ShortCode = " + xrxStr.strQuoteComma(record.SHORTCODE.value) +
                  " City     = " + xrxStr.strQuoteComma(record.CITY.value) +
                  " State     = " + xrxStr.strQuoteComma(record.STATE.value) +
                  " Phone     = " + xrxStr.strQuoteComma(record.PHONE.value) +
                  " TaxCode   = " + xrxStr.strQuoteComma(record.TAXCODE.value) +
                  " Tax       = " + xrxStr.floatQuoteComma(record.TAX.value) +
                  " EntryDate  = " + xrxStr.strQuoteComma(record.ENTRYDATE.value) +
                  " UserId = " + xrxStr.strQuote(record.USERID.value) + " ";
                  if(recordnumber)
                      sqlUpdate += "WHERE RECNO = '"+ recordnumber +"'; ";
                  else
                      sqlUpdate += "WHERE ZIPCODE = " + xrxStr.strQuote(record.ZIPCODE.value) +  "; ";

  var sql =   " BEGIN TRY "+
              " BEGIN TRANSACTION ZIP "+
              sqlInsert+
              sqlUpdate+
              " COMMIT TRANSACTION ZIP "+
              " END TRY "+
              " BEGIN CATCH "+
              " IF @@TRANCOUNT>0 ROLLBACK TRANSACTION ZIP "+
              " END CATCH ";


  dbhelper.query(sql,  function (err, record) {
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

exports.zipDelete = function(recNo, callback) {

    var sql = "DELETE FROM xrxZip WHERE RECNO ='"+ recNo +"'";

    dbhelper.query(sql, function (err, record) {
        if ((!err) || typeof err === 'undefined') {
            callback(null, record);
        }
        else {
            callback(err, null);
        }
    });
}

exports.zipSearch = function (searchText, searchType, callback){
    var searchText = searchText;
    var searchType = searchType;

    var sqlQuery = "select RecNo, ZipCode, ShortCode, City, State, Phone, Tax, TaxCode from xrxZip where "+ searchType +" LIKE " + xrxStr.strQuote(searchText+"%") + "";

    var sqlQuery1 = "select RecNo, ZipCode, ShortCode, City, State, Phone, Tax, TaxCode from xrxZip where "+ searchType +" >= " + xrxStr.strQuote(searchText) + "";

    console.log(sqlQuery1);

    dbhelper.query(sqlQuery,  function (err, record) {

          if(err)
          {
              callback(err, null);
          }
          else
          {
              if(record && record.length > 0)
              {
                callback(null, record);
              }
              else
              {

                dbhelper.query(sqlQuery1,  function (err1, record1) {

                    if(err1)
                    {
                      callback(err1, null);
                    }
                    else
                    {
                      if(record1 && record1.length >= 0)
                      {
                        callback(null, record1);
                      }
                      else
                      {
                        callback(null, record1);
                      }
                    }
                });

              }
          }
    });
};
