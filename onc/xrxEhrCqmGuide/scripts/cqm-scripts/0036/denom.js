var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                 (PatId = '"+patId+"') \
                 and (pat.Birthdate is not null) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 5) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) < 64) \
               )";

var sql2 =  "select cqm.PatId \
                         from xrxEhr_CQM cqm \
                         where \
                         ( \
                           (PatId = '"+patId+"') \
                           and \
                           ( \
                             cqm.Code='99201' or cqm.Code='99202' or cqm.Code='99203' or cqm.Code='99204' or cqm.Code='99205' or cqm.Code='99212' or cqm.Code='99213' or cqm.Code='99214' or cqm.Code='99215' \
           					        or 	cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
           					        or  cqm.Code = '99391' or  cqm.Code =  '99392' or  cqm.Code = '99393' or  cqm.Code = '99394' \
           					        or  cqm.Code = '99395' or  cqm.Code = '99396' or  cqm.Code = '99397' \
           					        or  cqm.Code ='99385' or cqm.Code = '99386' or cqm.Code = '99387' \
           					        or  cqm.Code ='99381' or  cqm.Code = '99382' or  cqm.Code = '99383' or  cqm.Code = '99384' \
           					        or cqm.Code='99341' or cqm.Code='99342' or cqm.Code='99343' or cqm.Code='99344' or cqm.Code='99345' or cqm.Code='99347' or cqm.Code='99348' or cqm.Code='99349' or cqm.Code='99350' \
                           ) \
                           and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                           and \
                           ( \
                             cqm.Category = 'Visit Type' \
                           ) \
                       )";

  var sql3 = "select PatId from xrxEhr_CQM cqm where \
              ( \
                 (PatId = '"+patId+"') \
                 and \
	               ( \
		                 cqm.Code = 'J45.30' or cqm.Code = 'J45.31' or cqm.Code = 'J45.32' or cqm.Code = 'J45.40' or cqm.Code = 'J45.41' or cqm.Code = 'J45.42' or cqm.Code = 'J45.50' or cqm.Code = 'J45.51' or cqm.Code = 'J45.52' or cqm.Code = '426656000' or cqm.Code = '426979002' or cqm.Code = '427295004' \
		                or cqm.Code = '493.00' or cqm.Code = '493.01' or cqm.Code = '493.02' or cqm.Code = '493.10' or cqm.Code = '493.11' or cqm.Code = '493.12' or cqm.Code = '493.20' or cqm.Code = '493.21' or cqm.Code = '493.22' or cqm.Code = '493.82' or cqm.Code = '493.90' or cqm.Code = '493.91' or cqm.Code = '493.92' \
	                ) \
	                and (cqm.StopDate >= '"+fromDate+"' or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              )";




            cqmGuideController.cqmCheck(sql1, function(err, record){

                if(record && record.length > 0)
                {

                      cqmGuideController.cqmCheck(sql2, function(err, record){

                        if(record && record.length > 0)
                        {

                          cqmGuideController.cqmCheck(sql3, function(err, record){

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
                                callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Diagnosis, Active: Persistent Asthma"});
                              }

                            });
                        }
                        else if(err)
                        {
                          callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                        }
                        else
                        {
                          callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Encounter type is not one of the following office visit, face to face visit."});
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
