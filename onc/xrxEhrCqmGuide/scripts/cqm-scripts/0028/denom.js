var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                 (PatId = '"+patId+"') \
                 and (pat.Birthdate is not null) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 18) \
               )";
  var sql2 = "select (cqm.PatId) \
              from xrxEhr_CQM cqm \
              where \
              ( \
              	( \
              		cqm.PatId in \
              		( \
              			SELECT cqm.PatId FROM xrxEhr_cqm cqm WHERE \
              			(PatId = '"+patId+"') \
              			and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              			and \
              			( \
              				cqm.Code = '90791' or cqm.Code = '90792' \
              				or cqm.Code = '96150' \
              				or cqm.Code = '96152' \
              				or cqm.Code = '97003' or cqm.Code = '97004' \
              				or cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
              				or cqm.Code = '90832' or cqm.Code = '90834' or cqm.Code = '90837' \
              				or cqm.Code = '90845' \
              				or cqm.Code = '92002' or cqm.Code = '92004' or cqm.Code = '92012' or cqm.Code = '92014' \
              			) \
              			and \
                    ( \
                      cqm.Category = 'Visit Type' \
                    ) \
              			GROUP BY cqm.PatId HAVING COUNT(cqm.PatId) >=  2 \
              		) \
              		or \
              		cqm.PatId in \
              		( \
              			SELECT cqm.PatId FROM xrxEhr_cqm cqm WHERE \
              			(PatId = '"+patId+"') \
              			and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              			and \
              			( \
              					cqm.Code = '99411' or cqm.Code = '99412' \
              					or cqm.Code = '99420' or cqm.Code = '99429' \
              					or cqm.Code = '99385' or cqm.Code = '99386' or cqm.Code = '99387' \
              					or cqm.Code = '99395' or cqm.Code = '99396' or cqm.Code = '99397' \
              					or cqm.Code = '99401' or cqm.Code = '99402' or cqm.Code = '99403' or cqm.Code = '99404' \
              					or cqm.Code = 'G0438' or cqm.Code = 'G0439' \
              					or (cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000')	\
              			) \
                    and \
                    ( \
                      cqm.Category = 'Visit Type' \
                    ) \
              			GROUP BY cqm.PatId HAVING COUNT(cqm.PatId) >=  1 \
              		) \
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
                            callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Encounter type 2 of office visit OR 1 of face to face visit."});
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
