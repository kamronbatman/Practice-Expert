var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.getTrnILL = function (patId, dateOfVisit, callback) {

        console.log(patId);
        console.log(dateOfVisit);

        sp = "xrxIllGetIcds";

        parameters = [
          {parameter: 'PatId', type: 'VarChar', value: patId},
          {parameter: 'ServDate', type: 'SmallDateTime', value: dateOfVisit}
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
exports.saveTrnILL = function (isNew, patId, patName, dctId, fclId, dateOfVisit, icds, callback) {

    var sql = "";
    if(!isNew)
    {

        sql = "UPDATE [xrxTrnIll] SET [PatId] = '"+patId+"' , [PatName] = '"+patName+"', [DctId] = '"+dctId+"', [FclId] = '"+fclId+"', [ServDate] = '"+dateOfVisit+"' \
          ,[IllIcd1] = nullif('"+icds.illIcd1+"', '') \
          ,[IllIcd2] = nullif('"+icds.illIcd2+"', '') \
          ,[IllIcd3] = nullif('"+icds.illIcd3+"', '') \
          ,[IllIcd4] = nullif('"+icds.illIcd4+"', '') \
          ,[IllIcd5] = nullif('"+icds.illIcd5+"', '') \
          ,[IllIcd6] = nullif('"+icds.illIcd6+"', '') \
          ,[IllIcd7] = nullif('"+icds.illIcd7+"', '') \
          ,[IllIcd8] = nullif('"+icds.illIcd8+"', '') \
          ,[IllIcd9] = nullif('"+icds.illIcd9+"', '') \
          ,[IllIcd10] = nullif('"+icds.illIcd10+"', '') \
          ,[IllIcd11] = nullif('"+icds.illIcd11+"', '') \
          ,[IllIcd12] = nullif('"+icds.illIcd12+"', '') WHERE PatId = '"+patId+"' and  (DATEDIFF(day, ServDate, '"+dateOfVisit+"') = 0) ";
    }
    else
    {
      sql = "INSERT INTO [xrxTrnIll] ([RecNo], [PatId], [PatName], [DctId], [FclId], [ServDate], [IllIcd1], [IllIcd2], [IllIcd3], [IllIcd4], [IllIcd5], [IllIcd6], [IllIcd7], [IllIcd8], [IllIcd9], [IllIcd10], [IllIcd11], [IllIcd12], [ParentId]) \
            VALUES ( \
                NEWID(), '"+patId+"', '"+patName+"', '"+dctId+"', '"+fclId+"', '"+dateOfVisit+"', nullif('"+icds.illIcd1+"', ''), \
                nullif('"+icds.illIcd2+"', ''), nullif('"+icds.illIcd3+"', ''), nullif('"+icds.illIcd4+"', ''), nullif('"+icds.illIcd5+"', ''),  nullif('"+icds.illIcd6+"', ''), \
                nullif('"+icds.illIcd7+"', ''), nullif('"+icds.illIcd8+"', ''), nullif('"+icds.illIcd9+"', ''), nullif('"+icds.illIcd10+"', ''), nullif('"+icds.illIcd11+"', ''), nullif('"+icds.illIcd12+"', ''), '"+patId+"' )";
    }


     dbhelper.query(sql, function (err, record) {

        if (err) {

            callback('Error: ' + err, false);
        }
        else {

            callback(null, true);
        }
    });
}
