var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                 (PatId = '"+patId+"') \
                 and (pat.Birthdate is not null) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 18) \
              )";


  var sql2 = "select cqm.PatId \
              from xrxEhr_CQM cqm \
              where \
              ( \
                (PatId = '"+patId+"') \
                and (cqm.ReasonCode is null) \
                and \
                ( \
                  cqm.Code = '10178000' or cqm.Code = '110473004' or cqm.Code = '112963003' or cqm.Code = '112964009' or cqm.Code = '12163000' or cqm.Code = '231744001' or cqm.Code = '308694002' or cqm.Code = '308695001' or cqm.Code = '313999004' or cqm.Code = '31705006' or cqm.Code = '335636001' or cqm.Code = '336651000' or cqm.Code = '35717002' or cqm.Code = '361191005' or cqm.Code = '385468004' or cqm.Code = '39243005' or cqm.Code = '397544007' or cqm.Code = '404628003' or cqm.Code = '415089008' or cqm.Code = '417493007' or cqm.Code = '418430006' or cqm.Code = '419767009' or cqm.Code = '420260004' or cqm.Code = '420526005' or cqm.Code = '424945000' or cqm.Code = '446548003' or cqm.Code = '46309001' or cqm.Code = '46426006' or cqm.Code = '46562009' or cqm.Code = '50538003' or cqm.Code = '5130002' or cqm.Code = '51839008' or cqm.Code = '54885007' or cqm.Code = '65812008' or cqm.Code = '67760003' or cqm.Code = '69360005' or cqm.Code = '74490003' or cqm.Code = '75814005' or cqm.Code = '79611007' or cqm.Code = '82155009' or cqm.Code = '84149000' or cqm.Code = '85622008' or cqm.Code = '88282000' or cqm.Code = '89153001' or cqm.Code = '9137006' or cqm.Code = '66840' or cqm.Code = '66850' or cqm.Code = '66852' or cqm.Code = '66920' or cqm.Code = '66930' or cqm.Code = '66940' or cqm.Code = '66982' or cqm.Code = '66983' or cqm.Code = '66984' \
                ) \
                and (cqm.DateOfVisit >= '"+fromDate+"') and (cqm.DateOfVisit <= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              )";

    cqmGuideController.cqmCheck(sql1, function(err, record){

        if(record && record.length > 0)
        {

              cqmGuideController.cqmCheck(sql2, function(err, record){

                if(record && record.length > 0)
                {
                  callback({criteriaName: "Denominator", isCriteriaQualify : true,  message : null});
                }
                else if(err)
                {
                  callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                }
                else
                {
                  callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Procedure, Performed: Cataract Surgery"});
                }

              });
        }
        else if(err)
        {
            callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
        }
        else
        {
            callback({criteriaName: "Denominator", isCriteriaQualify : false, message : null});
        }

    });

}
