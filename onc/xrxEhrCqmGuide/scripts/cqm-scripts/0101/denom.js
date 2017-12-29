var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                 (pat.Birthdate is not null) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 65) \
                 and (PatId = '"+patId+"') \
               )";

 var sql2 = "select cqm.PatId \
             from xrxEhr_CQM cqm \
             where \
             ( \
               ( \
                  cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
              		or cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
              		or cqm.Code = '99401' or cqm.Code = '99402' or cqm.Code = '99403' or cqm.Code = '99404' \
              		or cqm.Code = '99304' or cqm.Code = '99305' or cqm.Code = '99306' or cqm.Code = '99307' or cqm.Code = '99308' or cqm.Code = '99309' or cqm.Code = '99310' \
              		or cqm.Code = '99324' or cqm.Code = '99325' or cqm.Code = '99326' or cqm.Code = '99327' or cqm.Code = '99328' or cqm.Code = '99334' or cqm.Code = '99335' or cqm.Code = '99336' or cqm.Code = '99337' \
              		or cqm.Code = '99341' or cqm.Code = '99342' or cqm.Code = '99343' or cqm.Code = '99344' or cqm.Code = '99345' or cqm.Code = '99347' or cqm.Code = '99348' or cqm.Code = '99349' or cqm.Code = '99350' \
              		or cqm.Code = '99395' or cqm.Code = '99396' or cqm.Code = '99397' \
              		or cqm.Code = '99385' or cqm.Code = '99386' or cqm.Code = '99387' \
              		or cqm.Code = 'G0438' or cqm.Code = 'G0439' \
               ) \
               and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
               and \
               ( \
                 cqm.Category = 'Visit Type' \
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
