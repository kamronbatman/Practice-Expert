var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select pn.patid from xrxEhr_pn pn  \
              where \
              ( \
                (pn.BMI is not null) or (pn.BMI <> '') \
              ) \
              and (pn.DateOfVisit>= '"+fromDate+"') and (pn.DateOfVisit<= '"+toDate+"') \
              and  (isNull(pn.FclId, '') = case when ('"+fclId+"' = '')  then isNull(pn.FclId, '') else '"+fclId+"' end) and  (isNull(pn.DctId, '') = case when ('"+dctId+"' = '')  then isNull(pn.DctId, '') else '"+dctId+"' end) \
              and (PatId = '"+patId+"') \
              ";


    cqmGuideController.cqmCheck(sql1, function(err, record){
        if(record && record.length > 0)
        {
          callback({criteriaName: "Numerator 1", isCriteriaQualify : true,  message : null});
        }
        else if(err) {
          callback({criteriaName: "Numerator 1", isCriteriaQualify : false,  message : err});
        }
        else {
          callback({criteriaName: "Numerator 1", isCriteriaQualify : false,  message : "BMI percentile."});
        }
    });

}
