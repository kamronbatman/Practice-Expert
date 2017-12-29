var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var moment = require(nodeModulesPath + 'moment');
var DctSearch_dbhelper = remote.getGlobal('dbhelper');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.xrxDctSearch_GetList = function (searchText, searchType, callback) {
    var sql =  "select RECNO, DCTID, LASTNAME, FIRSTNAME from xrxDct where 1=1 AND ";
    var where = " ";
    if(searchType === "DCTID"){
        where += searchType + " like '%" + searchText + "%'";
    }else if(searchType === "NAME"){
        where += "(LASTNAME like '%" + searchText + "%' OR FIRSTNAME like '%"+ searchText +"%')";
    }
    sql += where;

    console.log(sql);
    DctSearch_dbhelper.query(sql, function (err, record) {
    	if ((!err) || typeof err === 'undefined') {
            var recordJsonArray = [];
            var i;
            if (record && record.length > 0) {
                for (i = 0; i < record.length; i++) {
                    recordJsonArray.push(convertToSimpleJson(record[i]));
                }
            }
            callback(null , recordJsonArray);
        }
        else {
            callback('Error: ' + err, null);
        }

    });
};

exports.xrxDctSearch_GetById = function (searchId, callback) {
    var sql =  "select RECNO, DCTID, LASTNAME, FIRSTNAME from xrxDct where DCTID = '" + searchId + "'";
    console.log(sql);
    DctSearch_dbhelper.query(sql, function (err, record) {
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
                    RECNO:'', LASTNAME:'', FIRSTNAME:'', DCTID:''
                };
    if(recordTedious){
        record.RECNO = recordTedious.RECNO.value;
        record.DCTID = recordTedious.DCTID.value;
        record.LASTNAME = recordTedious.LASTNAME.value;
        record.FIRSTNAME = recordTedious.FIRSTNAME.value;
    }
    return record;
};
