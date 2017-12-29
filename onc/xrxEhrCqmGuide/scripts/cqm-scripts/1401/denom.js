var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                (PatId = '"+patId+"') \
                and (pat.Birthdate is not null) \
                and  \
                  ( \
                		(pat.Birthdate >=(dateadd(month, -6, '"+fromDate+"')))	 \
                		and \
                		(pat.Birthdate <=(dateadd(month, 6, '"+fromDate+"')))	 \
            	    ) \
               )";

 var sql2 = "select cqm.PatId \
             from xrxEhr_CQM cqm, xrxPat pat \
             where \
             ( \
                ( \
              		cqm.Code='99201' or cqm.Code='99202' or cqm.Code='99203' or cqm.Code='99204' or cqm.Code='99205' or cqm.Code='99212' or cqm.Code='99213' or cqm.Code='99214' or cqm.Code='99215' \
              		or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '4525004' or cqm.Code = '87790002' or cqm.Code = '90526000' \
              		or cqm.Code = '108311000' or cqm.Code = '17436001' or cqm.Code = '185387006' or cqm.Code = '89.06' or cqm.Code = '89.07' or cqm.Code = '89.08' or cqm.Code = '89.09' or cqm.Code = '99241' or cqm.Code = '99242' or cqm.Code = '99243' or cqm.Code = '99244' or cqm.Code = '99245' \
              	) \
                  and \
              	( \
              		cqm.Category = 'Visit Type' \
              	) \
              	and (cqm.StopDate is not null) \
              	and	 \
              	( \
              		(cqm.StopDate> pat.Birthdate) and  (cqm.StopDate <=(dateadd(month, 6, pat.Birthdate))) \
              	) \
               and (PatId = '"+patId+"') \
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
                     callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Encounter type is not one of the following office visit, face to face visit."});
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
