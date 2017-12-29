var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxEhr_cqm cqm \
              where \
              ( \
                (cqm.ReasonCode is null) \
                and \
                ( \
                cqm.Code = '56308' or cqm.Code = '51925' or cqm.Code = '57540' or cqm.Code = '57545' or cqm.Code = '57550' or cqm.Code = '57555' or cqm.Code = '57556' or cqm.Code = '58150' or cqm.Code = '58152' or cqm.Code = '58200' or cqm.Code = '58210' or cqm.Code = '58240' or cqm.Code = '58260' or cqm.Code = '58262' or cqm.Code = '58263' or cqm.Code = '58267' or cqm.Code = '58270' or cqm.Code = '58275' or cqm.Code = '58280' or cqm.Code = '58285' or cqm.Code = '58290' or cqm.Code = '58291' or cqm.Code = '58292' or cqm.Code = '58293' or cqm.Code = '58294' or cqm.Code = '58548' or cqm.Code = '58550' or cqm.Code = '58552' or cqm.Code = '58553' or cqm.Code = '58554' or cqm.Code = '58570' or cqm.Code = '58571' or cqm.Code = '58572' or cqm.Code = '58573' or cqm.Code = '58951' or cqm.Code = '58953' or cqm.Code = '58954' or cqm.Code = '58956' or cqm.Code = '59135' or cqm.Code = '112918004' or cqm.Code = '116140006' or cqm.Code = '116142003' or cqm.Code = '116143008' or cqm.Code = '116144002' or cqm.Code = '236888001' or cqm.Code = '236891001' or cqm.Code = '24293001' or cqm.Code = '265056007' or cqm.Code = '27185000' or cqm.Code = '27950001' or cqm.Code = '287924009' or cqm.Code = '30160001' or cqm.Code = '307771009' or cqm.Code = '309880009' or cqm.Code = '31545000' or cqm.Code = '35955002' or cqm.Code = '359971002' or cqm.Code = '359974005' or cqm.Code = '359977003' or cqm.Code = '359983000' or cqm.Code = '361222003' or cqm.Code = '361223008' or cqm.Code = '413145007' or cqm.Code = '414575003' or cqm.Code = '41566006' or cqm.Code = '43791001' or cqm.Code = '441820006' or cqm.Code = '446446002' or cqm.Code = '446679008' or cqm.Code = '447771005' or cqm.Code = '448539002' or cqm.Code = '54490004' or cqm.Code = '59750000' or cqm.Code = '63516002' or cqm.Code = '75835007' or cqm.Code = '77902002' or cqm.Code = '86477000' or cqm.Code = '88144003' \
                or cqm.Code = 'V88.01' or cqm.Code = 'Z90.710' \
                ) \
              ) \
              and ((cqm.StopDate is not null) and (cqm.StopDate <= '"+toDate+"')) and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              and (PatId = '"+patId+"') \
              ";

  cqmGuideController.cqmCheck(sql1, function(err, record){
        if(record && record.length > 0)
        {
            callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : true,  message : null});
        }
        else if(err) {

            callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : false,  message : err});
        }
        else
        {
            callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : false,  message : "Hysterectomy with No Residual Cervix"});
        }
  });
};
