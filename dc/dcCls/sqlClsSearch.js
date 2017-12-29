var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");



exports.clsExists = function (cat, desc, callback) {

  var sql = "SELECT * FROM xrxCls WHERE CLSCAT = '"+ cat +"' AND CLSDESC = '"+ desc +"' ";

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

exports.clsSearch = function(cat, desc, callback)
{

  var sql = "SELECT * FROM xrxCls WHERE CLSCAT = '"+ cat +"'";
  var sql1 = "SELECT * FROM xrxCls WHERE CLSCAT = '"+ cat +"'";
  if(desc){

    sql +=  " AND CLSDESC  LIKE " + xrxStr.strQuote(desc+"%") + "";
    sql1 += " AND CLSDESC >= "+ xrxStr.strQuote(desc) +" ";
  }


  dbhelper.query(sql, function (err, record) {
      if ((!err) || typeof err === 'undefined')
      {
          if (record && record.length > 0)
          {
            callback(null, record);
          }
          else
          {
            dbhelper.query(sql1,  function (err1, record1) {

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
      else
      {
        callback(err, null);
      }
  });

}

exports.clsSave = function(cat, desc, callback)
{
  var sql = "INSERT INTO xrxCls (CLSCAT, CLSDESC, ORDERNO) VALUES ('"+ cat +"', '"+ desc +"', NULL) ";
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

exports.clsDelete = function(cat, desc, callback)
{
  var sql = "DELETE FROM xrxCls WHERE CLSCAT ='"+ cat +"' AND CLSDESC = '"+ desc +"'";
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
