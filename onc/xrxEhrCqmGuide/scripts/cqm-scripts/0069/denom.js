var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                 (PatId = '"+patId+"') \
                 and \
                 (pat.Birthdate is not null) \
                 and ((DATEDIFF(month, pat.Birthdate, '"+fromDate+"'))>=3) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) < 18) \
               )";

 var sql2 = "select cqm.PatId \
             from xrxEhr_CQM cqm \
             where (PatId = '"+patId+"') and \
             ( \
                ( \
               		cqm.Code = 'J00' or cqm.Code = 'J06.0' or cqm.Code = 'J06.9' or cqm.Code = '460' or cqm.Code = '465.0' or cqm.Code = '465.8' or cqm.Code = '465.9' or cqm.Code = '195708003' or cqm.Code = '281794004' or cqm.Code = '54150009' or cqm.Code = '54398005' or cqm.Code = '55355000' or cqm.Code = '78337007' or cqm.Code = '82272006'	 \
               	) \
               	and (isNull (cqm.StartDate, cqm.DateofVisit)>='"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit)<='"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
             )";

       cqmGuideController.cqmCheck(sql1, function(err, record){

           if(record && record.length > 0){

                 cqmGuideController.cqmCheck(sql2, function(err, record){
                   if(record && record.length > 0){
                     callback({criteriaName: "Denominator", isCriteriaQualify : true,  message : null});
                   }
                   else if(err){
                     callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                   }
                   else{
                     callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Diagnosis, Active: Upper Respiratory Infection."});
                   }
                 });
           }
           else if(err){
               callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
           }
           else{
               callback({criteriaName: "Denominator", isCriteriaQualify : false, message : null});
           }
       });
};
