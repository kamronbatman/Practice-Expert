var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.patid from xrxEhr_cqm cqm \
              where \
              (cqm.ReasonCode is null) \
              and \
              ( \
              	( \
              		(cqm.Flag is null) \
              		and \
              		(cqm.Code =	'33') \
              	) \
              	or \
              	( \
              		cqm.Code = '12866006' or cqm.Code = '394678003' or cqm.Code = '90732' \
              	) \
              	or \
              	( \
              		cqm.Code = '310578008' or cqm.Code = '473165003' \
              	) \
              ) \
              and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              and (PatId = '"+patId+"') \
              ";

        cqmGuideController.cqmCheck(sql1, function(err, record){
            if(record && record.length > 0)
            {
              callback({criteriaName: "Numerator", isCriteriaQualify : true,  message : null});
            }
            else if(err) {
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : err});
            }
            else {
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Pneumococcal Vaccine."});
            }
        });
}
