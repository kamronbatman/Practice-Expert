var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

      var sql1 = "SELECT cqm.PatId FROM xrxEhr_cqm cqm \
                  inner join \
                  ( \
                  	select * from xrxEhr_CQM cqm \
                  	where \
                  	( \
                  		(PatId = '"+patId+"') \
                  		and \
                  		(cqm.MasterRecno is not null) \
                  		and \
                  		( \
                  			( \
                  				cqm.Code = '105480006' or cqm.Code = '183944003' or cqm.Code = '183945002' or cqm.Code = '413310006' or cqm.Code = '413311005' or cqm.Code = '413312003' \
                  			) \
                  			or \
                  			( \
                  				cqm.Code = '183932001' or cqm.Code = '397745006' or cqm.Code = '407563006' \
                  			) \
                  		) \
                  	) \
                  )tmpCqm \
                  on cqm.EhrRecno = tmpCqm.MasterRecno \
                  WHERE \
                  ( \
                  	(cqm.PatId = '"+patId+"') \
                  	and \
                  	( \
                  		cqm.Code = '73831-0' or cqm.Code = '73832-8' \
                  	) \
                  	and (isNull (cqm.StartDate, cqm.DateofVisit)>= '"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                  )";


                  cqmGuideController.cqmCheck(sql1, function(err, record){
                    if(record && record.length > 0)
                    {
                      callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : true,  message : null});
                    }
                    else if(err)
                    {
                      callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : err});
                    }
                    else
                    {
                      callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : "Risk Category Assessment not done Medical reason contraindicated/Patient Reason refused"});
                    }
                  });


};
