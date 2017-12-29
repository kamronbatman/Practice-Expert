var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var moment = require(nodeModulesPath + 'moment');
var FclSearch_dbhelper = remote.getGlobal('dbhelper');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.xrxFclSearch_GetList = function (searchText, searchType, callback) {

    var sqlQuery =  "select RECNO, FCLID, FCLDESC from xrxFcl where " + searchType + " LIKE " + xrxStr.strQuote(searchText+"%") + "";
    var sqlQuery1 =  "select RECNO, FCLID, FCLDESC from xrxFcl where " + searchType + " >= " + xrxStr.strQuote(searchText+"%") + "";
    //console.log(sql);

    FclSearch_dbhelper.query(sqlQuery, function (err, record) {
    	if ((!err) || typeof err === 'undefined') {

            var recordJsonArray = [];
            var i;


            if (record && record.length > 0)
            {
                for (i = 0; i < record.length; i++) {
                    recordJsonArray.push(convertToSimpleJson(record[i]));
                }

                callback(null , recordJsonArray);
            }
            else
            {

              FclSearch_dbhelper.query(sqlQuery1,  function (err1, record1) {

                if(err1)
                {
                  callback(err1, null);
                }
                else
                {
                  if(record1 && record1.length >= 0)
                  {

                    for (i = 0; i < record1.length; i++)
                    {
                        recordJsonArray.push(convertToSimpleJson(record1[i]));
                    }
                    callback(null , recordJsonArray);
                  }
                  else
                  {
                    callback(null , recordJsonArray);
                  }
                }
            });


            }


        }
        else {
            callback('Error: ' + err, null);
        }

    });
};

exports.xrxFclSearch_GetById = function (searchId, callback) {
    var sql =  "select RECNO, FCLID, FCLDESC from xrxFcl where FCLID = '" + searchId + "'";
    console.log(sql);
    FclSearch_dbhelper.query(sql, function (err, record) {
    	if ((!err) || typeof err === 'undefined') {
            var recordJsonArray = [];

            if (record && record.length > 0) {
                    recordJsonArray.push(convertToSimpleJson(record[0]));
            }
            callback(null , recordJsonArray);
        }
        else {
            callback('Error: ' + err, null);
        }

    });
};

function formatDateTime(datetime){
    if(datetime){
        return moment(datetime).utcOffset(new Date().getTimezoneOffset()).format("MM/DD/YYYY");
    }
    else{
        return "";
    }
};

function convertToSimpleJson(recordTedious){

    var record = {
                    RECNO:'', FCLID:'', FCLDESC:''
                };
    if(recordTedious){
        record.RECNO = recordTedious.RECNO.value;
        record.FCLID = recordTedious.FCLID.value;
        record.FCLDESC = recordTedious.FCLDESC.value;
    }
    return record;
};
