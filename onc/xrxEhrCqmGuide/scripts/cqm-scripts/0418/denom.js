var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                  (PatId = '"+patId+"') \
                 and (pat.Birthdate is not null) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 12) \
                )";

  var sql2 = "select cqm.PatId \
              from xrxEhr_CQM cqm \
              where \
              ( \
                (PatId = '"+patId+"') \
                and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                and \
                ( \
                  cqm.Category = 'Visit Type' \
                ) \
                and \
                ( \
                  cqm.Code = 'G0101' or cqm.Code = 'G0402' or cqm.Code = 'G0438' or cqm.Code = 'G0439' or cqm.Code = 'G0444' or cqm.Code = '10197000' or cqm.Code = '108220007' or cqm.Code = '108221006' or cqm.Code = '108224003' or cqm.Code = '108250004' or cqm.Code = '108311000' or cqm.Code = '13607009' or cqm.Code = '14736009' or cqm.Code = '165171009' or cqm.Code = '171207006' or cqm.Code = '18512000' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '252592009' or cqm.Code = '252603000' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '274803000' or cqm.Code = '277404009' or cqm.Code = '302440009' or cqm.Code = '30346009' or cqm.Code = '308335008' or cqm.Code = '32537008' or cqm.Code = '35025007' or cqm.Code = '370803007' or cqm.Code = '37894004' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '410155007' or cqm.Code = '410157004' or cqm.Code = '43362002' or cqm.Code = '46662001' or cqm.Code = '48423005' or cqm.Code = '53555003' or cqm.Code = '67533008' or cqm.Code = '78318003' or cqm.Code = '83607001' or cqm.Code = '8411005' or cqm.Code = '86013001' or cqm.Code = '90526000' or cqm.Code = '91573000' or cqm.Code = '90791' or cqm.Code = '90792' or cqm.Code = '90832' or cqm.Code = '90834' or cqm.Code = '90837' or cqm.Code = '90839' or cqm.Code = '92625' or cqm.Code = '96116' or cqm.Code = '96118' or cqm.Code = '96150' or cqm.Code = '96151' or cqm.Code = '97003' or cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
                ) \
              )";

    cqmGuideController.cqmCheck(sql1, function(err, record){

          if(record && record.length > 0)
          {

                cqmGuideController.cqmCheck(sql2, function(err, record){

                  if(record && record.length > 0)
                  {
                    callback({criteriaName: "Denominator", isCriteriaQualify : true,  message : null});
                  }
                  else if(err)
                  {
                    callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                  }
                  else
                  {
                    callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Encounter type is not  office visit"});
                  }

                });
          }
          else if(err)
          {
              callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
          }
          else
          {
              callback({criteriaName: "Denominator", isCriteriaQualify : false, message : null});
          }

      });




};
