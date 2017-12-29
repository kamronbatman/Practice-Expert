var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var moment = require(nodeModulesPath + 'moment');
var snomedSearch_dbhelper = remote.getGlobal('dbhelper');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.xrxSnomedSearch_GetList = function (searchText, searchType, callback) {
    var sql =  "select top 50 Recno, SnomedCode, SnomedDesc from xrxSnomed where 1=1 AND ";
    var where = " ";
    if(searchType === "SNOMEDCODE"){
        where += searchType + " like '%" + searchText + "%'";
    }else if(searchType === "SNOMEDDESC"){
        where += "(SNOMEDDESC like '%" + searchText + "%')";
    }
    sql += where;

    //console.log(sql);
    snomedSearch_dbhelper.query(sql, function (err, record) {
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

exports.xrxSnomedSearch_GetById = function (searchId, callback) {
    var sql =  "select Recno, SnomedCode, SnomedDesc from xrxSnomed where SnomedCode = '" + searchId + "'";
    //console.log(sql);
    snomedSearch_dbhelper.query(sql, function (err, record) {
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
                    RECNO: '', SNOMEDCODE: '', SNOMEDDESC: ''
                };
    if(recordTedious)
    {
        record.RECNO        = recordTedious.RECNO.value;
        record.SNOMEDCODE        = recordTedious.SNOMEDCODE.value;
        record.SNOMEDDESC     = recordTedious.SNOMEDDESC.value;
    }

    return record;
};
