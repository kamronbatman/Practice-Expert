var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.patid from xrxEhr_cqm cqm \
              where \
              (PatId = '"+patId+"') \
              and \
              ( \
                ( \
            			( \
            				cqm.ReasonCode = '161590003' or cqm.ReasonCode = '183932001' or cqm.ReasonCode = '183964008' or cqm.ReasonCode = '183966005' or cqm.ReasonCode = '216952002' or cqm.ReasonCode = '266721009' or cqm.ReasonCode = '269191009' or cqm.ReasonCode = '274512008' or cqm.ReasonCode = '31438003' or cqm.ReasonCode = '35688006' or cqm.ReasonCode = '371133007' or cqm.ReasonCode = '397745006' or cqm.ReasonCode = '407563006' or cqm.ReasonCode = '410534003' or cqm.ReasonCode = '410536001' or cqm.ReasonCode = '416098002' or cqm.ReasonCode = '416406003' or cqm.ReasonCode = '428119001' or cqm.ReasonCode = '445528004' or cqm.ReasonCode = '59037007' or cqm.ReasonCode = '62014003' or cqm.ReasonCode = '79899007' \
            			) \
            			and \
            			( \
            				cqm.Code = '57254-5' or cqm.Code = '73830-2' \
            			) \
            			and \
            			(isNull (cqm.StartDate, cqm.DateofVisit)>='"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit)<='"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
            		) \
                or \
                ( \
            			( \
            				cqm.Code = '160685001' or cqm.Code = '165243005' or cqm.Code = '165244004' or cqm.Code = '225612007' or cqm.Code = '282145008' or cqm.Code = '282147000' or cqm.Code = '282204009' or cqm.Code = '282206006' or cqm.Code = '413121008' \
            			) \
            			and \
            			( \
            				(cqm.StopDate >= '"+fromDate+"' or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) 				 \
            			) \
            		)  \
              ) \
              ";

        cqmGuideController.cqmCheck(sql1, function(err, record){
            if(record && record.length > 0)
            {
              callback({criteriaName: "Exception", isCriteriaQualify : true,  message : null});
            }
            else if(err) {
              callback({criteriaName: "Exception", isCriteriaQualify : false,  message : err});
            }
            else {
              callback({criteriaName: "Exception", isCriteriaQualify : false,  message : "Not done for Medical Reason/Patient not ambulatory."});
            }
        });
}
