var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {
  var sql1 = "select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from xrxEhr_CQM cqm \
                where \
                (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"')  \
                and \
                (PatId = '"+patId+"') \
                and \
                (cqm.flag is null) \
                and \
                ( \
                	cqm.Code = '11268-0' or cqm.Code = '17656-0' or cqm.Code = '18481-2' or cqm.Code = '31971-5' or cqm.Code = '49610-9' or cqm.Code = '5036-9' or cqm.Code = '60489-2' or cqm.Code = '626-2' or cqm.Code = '6556-5' or cqm.Code = '6557-3' or cqm.Code = '6558-1' or cqm.Code = '6559-9' or cqm.Code = '68954-7' \
                ) \
                and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
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
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Laboratory Test, Result: Group A Streptococcus Test (result)"});
      }
  });
};
