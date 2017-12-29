var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 =  "select distinct cqm.patid from xrxEhr_cqm cqm \
              where \
            	(cqm.PatId = '"+patId+"') \
              and \
              ( \
              	( \
              		cqm.PatId in \
              		( \
              		  SELECT cqm.PatId FROM xrxEhr_cqm cqm \
              			inner join  \
              			( \
              				select * from xrxEhr_CQM cqm \
              				where \
              				( \
              					(cqm.MasterRecno is not null) \
              					and \
              					(	\
              						cqm.Code = '161590003' or cqm.Code = '183932001' or cqm.Code = '183964008' or cqm.Code = '183966005' or cqm.Code = '216952002' or cqm.Code = '266721009' or cqm.Code = '269191009' or cqm.Code = '274512008' or cqm.Code = '31438003' or cqm.Code = '35688006' or cqm.Code = '371133007' or cqm.Code = '397745006' or cqm.Code = '407563006' or cqm.Code = '410534003' or cqm.Code = '410536001' or cqm.Code = '416098002' or cqm.Code = '416406003' or cqm.Code = '428119001' or cqm.Code = '445528004' or cqm.Code = '59037007' or cqm.Code = '62014003' or cqm.Code = '79899007' \
              					)	\
              				) \
              			)tmpCqm \
              			on cqm.EhrRecno = tmpCqm.MasterRecno \
              			WHERE \
              			( \
              				( \
              					cqm.Code = '11366-2' or cqm.Code = '68535-4' or cqm.Code = '68536-2' \
              				) \
              				and (isNull (cqm.StartDate, cqm.DateofVisit)>= '"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit)<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              			) \
              		) \
              ) \
            	or \
            	( \
            		cqm.PatId in \
            		( \
            			SELECT cqm.PatId FROM xrxEhr_cqm cqm WHERE \
            			( \
            				cqm.Code = '162607003' or cqm.Code = '162608008' or cqm.Code = '170969009' or cqm.Code = '27143004' or cqm.Code = '300936002' \
            			) \
            			and ( cqm.StopDate >= '"+fromDate+"' or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) 	\
            		) \
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
                callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : "Tobacco Use Screening Not done due to Medical Reason OR Diagnosis, Active: Limited Life Expectancy"});
              }
            });


};
