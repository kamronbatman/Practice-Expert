var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {
  var sql1 =  "select cqm.patid from xrxEhr_cqm cqm \
              where \
              (PatId = '"+patId+"') \
              and \
              ( \
              	cqm.Code =  '428191000124101' \
              ) \
              and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
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
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Set medication documented from med-history"});
      }
  });

};
