var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.rfdExists = function (rfd, recNo, callback) {

  var sql = "select RecNo, RfdId, ShortCode,  LastName, FirstName, Phone, Fax from xrxRfd where RfdId = " + xrxStr.strQuote(rfd) +" ";
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

};

exports.rfdSearch = function (searchText, searchType, callback){

    var searchText = searchText;
    var searchType = searchType;

    var searchColName = "";

    if (searchType === "RFDID")
    {
      searchColName = "RFDID";
    }
    else if(searchType === "NAME")
    {
      searchColName = "LASTNAME";
    }

    var sql = "select RecNo, RfdId, ShortCode,  LastName, FirstName, Phone, Fax from xrxRfd ";

    var sqlQuery = sql + " where "+ searchColName +" LIKE " + xrxStr.strQuote(searchText+"%") + "";;
    var sqlQuery1 = sql + " where "+ searchColName +" >= " + xrxStr.strQuote(searchText) + "";



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
