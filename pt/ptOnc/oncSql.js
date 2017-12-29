var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.oncGet = function (patId, callback) {
    var sql =  "select Recno, PatId, BirthSex, SexualOrientation, GenderIdentity from xrxNpp where PatId = " + xrxStr.strQuote(patId);
    dbhelper.query(sql, function (err, record) {
        if (err) {
            callback('Error: ' + err, record);
        }
        else if (record.length === 0) {
            record[0] = {
                RECNO : {value : ''},
                PATID : {value : patId},
                BIRTHSEX : {value : ''},
                SEXUALORIENTATION : {value : ''},
                GENDERIDENTITY : {value : ''}
            };
        }
        callback(null , record);
    });
};
exports.oncSave = function (
        RecNo,
        PatId,
        BirthSex,
        SexualOrientation,
        GenderIdentity,
        callback)
        {
          if (RecNo) {
              var sqlupdate =
                  "update xrxNpp set " +
                  " BirthSex = " + xrxStr.strQuoteComma(BirthSex) +
                  " SexualOrientation = " + xrxStr.strQuoteComma(SexualOrientation) +
                  " GenderIdentity = " + xrxStr.strQuote(GenderIdentity) +
                  " where PatId = " + xrxStr.strQuote(PatId);
              dbhelper.query(sqlupdate, function (err, record) {
                  if (err) {
                      callback('Error: ' + err, false);
                  }
                  else {
                      callback(null, true);
                  }
              });
          }
          else {
              var sqlinsert =
                  "insert into xrxNpp(patId, BirthSex, SexualOrientation, GenderIdentity) " +
                  " values(" +
                  xrxStr.strQuoteComma(patId) +
                  xrxStr.strQuoteComma(BirthSex) +
                  xrxStr.strQuoteComma(SexualOrientation) +
                  xrxStr.strQuote(GenderIdentity) +
                  ")";
              dbhelper.query(sqlinsert, function (err, record) {
                  if (err) {
                      callback('Error: ' + err, false);
                  }
                  else {
                      callback(null, true);
                  }
              });
          }

};
