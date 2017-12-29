var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var moment = require(nodeModulesPath + 'moment');
var InvSearch_dbhelper = remote.getGlobal('dbhelper');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.xrxInvSearch_GetList = function (searchText, searchType, callback) {
    var sql =  "select RECNO, PARTNUMBER, DESCRIPTION, SERIALNUMBER, CPTCODE from xrxSerializedInv where " + searchType + " like '%" + searchText + "%'";
    console.log(sql);
    InvSearch_dbhelper.query(sql, function (err, record) {
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

exports.xrxInvSearch_GetById = function (searchId, callback) {
    var sql =  "select RECNO, PARTNUMBER, DESCRIPTION, SERIALNUMBER, CPTCODE from xrxSerializedInv where PARTNUMBER = '" + searchId + "'";
    console.log(sql);
    InvSearch_dbhelper.query(sql, function (err, record) {
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

exports.xrxInvSearch_GetBySerialNo = function (searchId, callback) {
    var sql =  "select RECNO, PARTNUMBER, DESCRIPTION, SERIALNUMBER, CPTCODE from xrxSerializedInv where SERIALNUMBER = '" + searchId + "'";
    console.log(sql);
    InvSearch_dbhelper.query(sql, function (err, record) {
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
                    RECNO:'', PARTNUMBER:'', DESCRIPTION:'', SERIALNUMBER:'', CPTCODE: ''
                };
    if(recordTedious){
        record.RECNO = recordTedious.RECNO.value;
        record.PARTNUMBER = recordTedious.PARTNUMBER.value;
        record.DESCRIPTION = recordTedious.DESCRIPTION.value;
        record.SERIALNUMBER = recordTedious.SERIALNUMBER.value;
        record.CPTCODE = recordTedious.CPTCODE.value;
    }
    return record;
};
