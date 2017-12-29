var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.insSearch = function (searchText, searchType, callback)
{
    var searchText = searchText;
    var searchType = searchType;

    var sqlQuery = "select RECNO, INSNAME, SHORTCODE from xrxIns where "+ searchType +" LIKE " + xrxStr.strQuote("%"+searchText+"%") + "";
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
                callback(null, record);
              }
          }
    });
};

exports.insExists = function(id, recordId, callback)
{
  var id = id;
  var recordid = recordId;

  //var sqlWhereClause = req.body.whereClause;

  var sql = "select RECNO, INSNAME, SHORTCODE from xrxIns where ( INSNAME=" + xrxStr.strQuote(id) +" or SHORTCODE= " + xrxStr.strQuote(id) +"  ) ";

  dbhelper.query(sql, function (err, record){

      if ((!err) || typeof err === 'undefined')
      {
          if (record && record.length>0)
          {
            callback(null, record);
          }
          else
          {
            callback(null, record);
          }

      }
      else
      {
        callback(err, null);
      }

  });
};
