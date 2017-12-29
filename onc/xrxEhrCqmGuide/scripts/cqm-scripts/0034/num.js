var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.patid from xrxEhr_cqm cqm \
              where \
              ( \
            		(cqm.ReasonCode is null) \
            		and \
            		( \
            			cqm.Code = 'G0105' or cqm.Code = 'G0121' or cqm.Code = '12350003' or cqm.Code = '174158000' or cqm.Code = '174184006' or cqm.Code = '235150006' or cqm.Code = '235151005' or cqm.Code = '25732003' or cqm.Code = '303587008' or cqm.Code = '310634005' or cqm.Code = '34264006' or cqm.Code = '367535003' or cqm.Code = '418714002' or cqm.Code = '427459009' or cqm.Code = '443998000' or cqm.Code = '444783004' or cqm.Code = '446521004' or cqm.Code = '446745002' or cqm.Code = '447021001' or cqm.Code = '73761001' or cqm.Code = '8180007' or cqm.Code = '44388' or cqm.Code = '44389' or cqm.Code = '44390' or cqm.Code = '44391' or cqm.Code = '44392' or cqm.Code = '44393' or cqm.Code = '44394' or cqm.Code = '44397' or cqm.Code = '45355' or cqm.Code = '45378' or cqm.Code = '45379' or cqm.Code = '45380' or cqm.Code = '45381' or cqm.Code = '45382' or cqm.Code = '45383' or cqm.Code = '45384' or cqm.Code = '45385' or cqm.Code = '45386' or cqm.Code = '45387' or cqm.Code = '45391' or cqm.Code = '45392' \
            		) \
            		and \
            		( \
            			( \
            				(cqm.StopDate < '"+fromDate+"') \
            				and \
            				( \
            					DATEDIFF(month, cqm.StopDate, '"+fromDate+"') <= 108 \
            				) \
            			) \
            			or \
            			( \
            				(cqm.StopDate >= '"+fromDate+"') and (cqm.StopDate <= '"+toDate+"') \
            			) \
            		) \
            		and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
            	) \
            	or \
            	( \
            		(cqm.Flag is null) \
            		and \
            		( \
            			cqm.Code = '12503-9' or cqm.Code = '12504-7' or cqm.Code = '14563-1' or cqm.Code = '14564-9' or cqm.Code = '14565-6' or cqm.Code = '2335-8' or cqm.Code = '27396-1' or cqm.Code = '27401-9' or cqm.Code = '27925-7' or cqm.Code = '27926-5' or cqm.Code = '29771-3' or cqm.Code = '56490-6' or cqm.Code = '56491-4' or cqm.Code = '57905-2' or cqm.Code = '58453-2' \
            		) \
            		and \
            		(isNull (cqm.StartDate, cqm.DateofVisit)>='"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit)<='"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
            	) \
            	or \
            	( \
            		(cqm.ReasonCode is null) \
            		and \
            		( \
            			cqm.Code = 'G0104' or cqm.Code = '112870002' or cqm.Code = '396226005' or cqm.Code = '425634007' or cqm.Code = '44441009' or cqm.Code = '45330' or cqm.Code = '45331' or cqm.Code = '45332' or cqm.Code = '45333' or cqm.Code = '45334' or cqm.Code = '45335' or cqm.Code = '45337' or cqm.Code = '45338' or cqm.Code = '45339' or cqm.Code = '45340' or cqm.Code = '45341' or cqm.Code = '45342' or cqm.Code = '45345' \
            		) \
            		and \
            		( \
            			( \
            				(cqm.StopDate < '"+fromDate+"') \
            				and \
            				( \
            					DATEDIFF(month, cqm.StopDate, '"+fromDate+"') <= 48 \
            				) \
            			) \
            			or \
            			( \
            				(cqm.StopDate >= '"+fromDate+"') and (cqm.StopDate <= '"+toDate+"') \
            			) \
            		) \
            		and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
            	) \
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
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Colonoscopy <= 9 year(s)"});
            }
        });

}
