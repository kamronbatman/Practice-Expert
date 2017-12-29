var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var moment = require(nodeModulesPath + 'moment');
var PatSearch_dbhelper = remote.getGlobal('dbhelper');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.xrxPatSearch_GetList = function (searchText, searchType, callback) {
    var sql =  "select PATID, PATNAME, EXT, COVERAGE, BIRTHDATE, PHONE, RSPNAME, ALIAS, PRIMARYID, CHARTNO from xrxPsrch where " + searchType + " like '" + searchText + "%'";
    PatSearch_dbhelper.query(sql, function (err, record) {
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

exports.xrxPatSearch_GetById = function (searchId, callback) {
    var sql =  "select PATID, PATNAME, EXT, COVERAGE, BIRTHDATE, PHONE, RSPNAME, ALIAS, PRIMARYID, CHARTNO from xrxPsrch where PATID = '" + searchId + "'";
    PatSearch_dbhelper.query(sql, function (err, record) {
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
                    PATID: '', PATNAME: '', EXT: '', COVERAGE: '', BIRTHDATE: '', PHONE: '', RSPNAME: '', ALIAS : '', PRIMARYID: '', CHARTNO: ''
                };
    if(recordTedious)
    {
        record.PATID        = recordTedious.PATID.value;
        record.PATNAME        = recordTedious.PATNAME.value;
        record.EXT     = recordTedious.EXT.value;
        record.COVERAGE    = recordTedious.COVERAGE.value;
        record.BIRTHDATE    = formatDateTime(recordTedious.BIRTHDATE.value);
        record.PHONE          = recordTedious.PHONE.value;
        record.RSPNAME        = recordTedious.RSPNAME.value;
        record.ALIAS        = recordTedious.ALIAS.value;
        record.PRIMARYID    = recordTedious.PRIMARYID.value;
        record.CHARTNO    = recordTedious.CHARTNO.value;

    }
    return record;
};
