var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                 (PatId = '"+patId+"') \
                 and (pat.Birthdate is not null) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 18) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) < 85) \
                 and (pat.Sex is not null) and (pat.Sex = 'F') \
               )";

  var sql2 = "select cqm.PatId \
              from xrxEhr_CQM cqm \
              where \
              (PatId = '"+patId+"') \
              and \
              ( \
                ( \
        					cqm.Code='99201' or cqm.Code='99202' or cqm.Code='99203' or cqm.Code='99204' or cqm.Code='99205' or cqm.Code='99212' or cqm.Code='99213' or cqm.Code='99214' or cqm.Code='99215' \
        					or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
        					or cqm.Code='99395' or cqm.Code='99396' or cqm.Code='99397'  \
        					or cqm.Code='99385' or cqm.Code='99386' or cqm.Code='99387'  \
        					or cqm.Code='99341' or cqm.Code='99342' or cqm.Code='99343' or cqm.Code='99344' or cqm.Code='99345' or cqm.Code='99347' or cqm.Code='99348' or cqm.Code='99349' or cqm.Code='99350' \
        					or cqm.Code='G0438' or cqm.Code='G0439' \
        				) \
                and \
                ( \
                  cqm.Category = 'Visit Type' \
                ) \
        				and (cqm.DateOfVisit>='"+fromDate+"') and (cqm.DateOfVisit<='"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              )";

  var sql3 = "select cqm.PatId \
              from xrxEhr_CQM cqm \
              where \
              (PatId = '"+patId+"') \
              and \
              ( \
                ( \
                  (	 \
          					cqm.Code = 'I10' or cqm.Code = '401.0' or cqm.Code = '401.1' or cqm.Code = '401.9' or cqm.Code = '10725009' or cqm.Code = '1201005' or cqm.Code = '276789009' or cqm.Code = '371125006' or cqm.Code = '429198000' or cqm.Code = '429457004' or cqm.Code = '46481004' or cqm.Code = '48146000' or cqm.Code = '52698002' or cqm.Code = '56218007' or cqm.Code = '59621000' or cqm.Code = '59720008' or cqm.Code = '62275004' or cqm.Code = '65518004' or cqm.Code = '78975002' \
          				) \
          				and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                and \
                ( \
                  ( \
          					(isNull (cqm.StartDate, cqm.DateofVisit)>='"+fromDate+"')  \
          					and  \
          					(DATEDIFF(month, '"+fromDate+"', isNull (cqm.StartDate, cqm.DateofVisit))) <= 6 \
          				)	 \
          				or  \
          				((cqm.StopDate >= '"+fromDate+"' or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+fromDate+"')) \
          				and   \
          				(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) \
                ) \
              )";

  cqmGuideController.cqmCheck(sql1, function(err, record){
      if(record && record.length > 0){

            cqmGuideController.cqmCheck(sql2, function(err, record){
              if(record && record.length > 0){

                cqmGuideController.cqmCheck(sql3, function(err, record){
                  if(record && record.length > 0){
                    callback({criteriaName: "Denominator", isCriteriaQualify : true,  message : null});
                  }
                  else if(err){
                    callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                  }
                  else{
                    callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Diagnosis: Essential Hypertension"});
                  }
                });
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
