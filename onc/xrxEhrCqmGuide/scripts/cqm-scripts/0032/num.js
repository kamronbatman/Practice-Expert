var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.patid from xrxEhr_cqm cqm \
              where \
              (cqm.flag is null) \
              and  \
              ( \
                 cqm.Code = '10524-7' or cqm.Code = '18500-9' or cqm.Code = '19762-4' or cqm.Code = '19764-0' or cqm.Code = '19765-7' or cqm.Code = '19766-5' or cqm.Code = '19774-9' or cqm.Code = '33717-0' or cqm.Code = '47527-7' or cqm.Code = '47528-5'	\
	               or cqm.Code = 'V72.31' or cqm.Code = 'V76.2' or cqm.Code = 'Z12.4'  \
              ) \
              and \
              ( \
              	cqm.StopDate is not null \
              	and \
              	cqm.StopDate  >= dateadd(month, -24 , '"+fromDate+"') \
              	and \
              	cqm.StopDate <= '"+toDate+"' \
              ) \
              and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
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
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Pap Test (result)."});
            }
        });

}
