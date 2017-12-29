var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.PatId from xrxEhr_cqm cqm \
              where \
                (cqm.PatId = '"+patId+"') \
                and \
                ( \
                  cqm.Code = '80055' or cqm.Code = '87340' or cqm.Code = '10674-0' or cqm.Code = '10675-7' or cqm.Code = '24313-9' or cqm.Code = '24363-4' or cqm.Code = '24364-2' or cqm.Code = '42191-7' or cqm.Code = '5195-3' or cqm.Code = '5196-1' or cqm.Code = '5197-9' or cqm.Code = '58452-4' or cqm.Code = '63557-3' or cqm.Code = '65633-0' or cqm.Code = '70154-0' or cqm.Code = '72061-5' or cqm.Code = '7905-3' \
  	            ) \
                and \
                (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
	            ";

  cqmGuideController.cqmCheck(sql1, function(err, record){
    if(record && record.length > 0)
    {
      callback({criteriaName: "Numerator", isCriteriaQualify : true,  message : null});
    }
    else if(err) {

      callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : err});
    }
    else
    {
      callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Laboratory Test, Performed: HBsAg  within 280 day(s)  before start of Delivery Procedure"});
    }
  });

};
