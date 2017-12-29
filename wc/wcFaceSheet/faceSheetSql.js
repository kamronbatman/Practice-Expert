var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.nppGet = function (patId, callback) {

    sp = "xrxWc_FaceSheet";

    parameters = [
        {parameter: 'PatId', type: 'VarChar', value: patId}
    ];

    dbhelper.storeProcedure(sp, parameters, function (err, record) {
        if (err) {
            console.log(err);
            callback('Error: ' + err, record);
        }
        else {
            callback(null , record);
        }
    });
};

