var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath+"/xrx_modules/xrx-str");


exports.cqmCheck = function (sql, callback) {

    dbhelper.query(sql, function (err, record) {
        if (err) {
            callback(err, null);
        }
        else {

            callback(null , record);
          }

    });
};
exports.xmlGetParam = function (paramName, callback) {

  var sql = "select XmlText from xrxParam where ParamName = '" + paramName + "'";

  dbhelper.query(sql, function (err, record) {
      if (err) {
          callback(err, null);
      }
      else {
        callback(null , record);
        }
  });
};
