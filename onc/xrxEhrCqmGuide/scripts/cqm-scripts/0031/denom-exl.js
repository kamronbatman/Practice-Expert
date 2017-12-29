var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

    var sql1 = "select PatId from xrxEhr_cqm cqm \
                where \
                ( \
                	( \
                		cqm.patId in \
                		( \
                			select PatId from xrxEhr_CQM cqm where \
                			( \
                				(cqm.ReasonCode is null) \
                				and \
                				( \
                					cqm.Code = '14693006' or cqm.Code = '14714006' or cqm.Code = '17086001' or cqm.Code = '22418005' or cqm.Code = '27865001' or cqm.Code = '52314009' or cqm.Code = '60633004' or cqm.Code = '76468001' \
                				) \
                			) \
                		) \
                	) \
                	or \
                	( \
                		cqm.PatId in \
                		( \
                			SELECT cqm.PatId FROM xrxEhr_cqm cqm WHERE \
                			( \
                				(cqm.ReasonCode is null) \
                				and \
                				( \
                					cqm.Code = '19303' or cqm.Code = '19304' or cqm.Code = '19305' or cqm.Code = '19306' or cqm.Code = '19307' or cqm.Code = '172043006' or cqm.Code = '172044000' or cqm.Code = '22964006' or cqm.Code = '237367009' or cqm.Code = '237368004' or cqm.Code = '274957008' or cqm.Code = '287653007' or cqm.Code = '287654001' or cqm.Code = '317230007' or cqm.Code = '318190001' or cqm.Code = '359728003' or cqm.Code = '359731002' or cqm.Code = '359734005' or cqm.Code = '359740003' or cqm.Code = '384723003' or cqm.Code = '395702000' or cqm.Code = '406505007' or cqm.Code = '428564008' or cqm.Code = '428571003' or cqm.Code = '429400009' or cqm.Code = '446109005' or cqm.Code = '446420001' or cqm.Code = '447135002' or cqm.Code = '447421006' or cqm.Code = '59620004' or cqm.Code = '66398006' or cqm.Code = '70183006' or cqm.Code = '72269009' or cqm.Code = '73359007' or cqm.Code = '8115005' or cqm.Code = '88764002' or cqm.Code = '19180' or cqm.Code = '19200' or cqm.Code = '19220' or cqm.Code = '19240' \
                				) \
                			) \
                			GROUP BY cqm.PatId HAVING COUNT(cqm.PatId) =  2 \
                		) \
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
                  callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : false,  message : "Bilateral Mastectomy or 2 of Unilateral Mastectomy."});
              }
        });

};
