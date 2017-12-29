var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 =  "select cqm.PatId \
               from  xrxEhr_CQM cqm \
               inner join \
               ( \
                	select * from xrxEhr_CQM cqm \
                	where \
                	( \
                		(cqm.MasterRecno is not null) \
                		and \
                		( \
                			cqm.Code = '183932001' or cqm.Code = '397745006' or cqm.Code = '407563006' \
                		) \
                	) \
                )tmpCqm \
                on cqm.EhrRecno = tmpCqm.MasterRecno \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	( \
                		cqm.Code = '428191000124101' \
                	) \
                  and \
                  ( \
                    (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                  ) \
              )";



              cqmGuideController.cqmCheck(sql1, function(err, record){
                if(record && record.length > 0)
                {
                  callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : true,  message : null});
                }
                else if(err) {

                  callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : err});
                }
                else
                {
                  callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : "Set medication documented with exception from med-history (Not done Current Medications Documented SNMD due to Medical or Other reason)"});
                }
              });


};
