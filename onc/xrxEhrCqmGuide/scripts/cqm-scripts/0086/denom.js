var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                 (PatId = '"+patId+"') \
                 and (pat.Birthdate is not null) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 18) \
              )";
  var sql2 = "select cqm.PatId \
              from  xrxEhr_CQM cqm \
              where \
              ( \
              	(PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = '92002' or cqm.Code = '92004' or cqm.Code = '92012' or cqm.Code = '92014' \
              		or cqm.Code = '99324' or cqm.Code = '99325' or cqm.Code = '99326' or cqm.Code = '99327' or cqm.Code = '99328' or cqm.Code = '99334' or cqm.Code = '99335' or cqm.Code = '99336' or cqm.Code = '99337' \
              		or cqm.Code = '99304' or cqm.Code = '99305' or cqm.Code = '99306' or cqm.Code = '99307' or cqm.Code = '99308' or cqm.Code = '99309' or cqm.Code = '99310' \
              		or cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
              		or cqm.Code = '99241' or cqm.Code = '99242' or cqm.Code = '99243' or cqm.Code = '99244' or cqm.Code = '99245' \
              		or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
              	) \
                and \
                ( \
                  cqm.Category = 'Visit Type' \
                ) \
              	and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
            )";
  var sql3 = "declare  @tempTableA table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              )  \
              declare  @tempTableB table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              insert into @tempTableA \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm \
              where \
              ( \
              	(PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = '92002' or cqm.Code = '92004' or cqm.Code = '92012' or cqm.Code = '92014' \
              		or cqm.Code = '99324' or cqm.Code = '99325' or cqm.Code = '99326' or cqm.Code = '99327' or cqm.Code = '99328' or cqm.Code = '99334' or cqm.Code = '99335' or cqm.Code = '99336' or cqm.Code = '99337' \
              		or cqm.Code = '99304' or cqm.Code = '99305' or cqm.Code = '99306' or cqm.Code = '99307' or cqm.Code = '99308' or cqm.Code = '99309' or cqm.Code = '99310' \
              		or cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
              		or cqm.Code = '99241' or cqm.Code = '99242' or cqm.Code = '99243' or cqm.Code = '99244' or cqm.Code = '99245' \
              		or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
              	) \
                and \
                ( \
                    cqm.Category = 'Visit Type' \
                ) \
              	and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              insert into @tempTableB \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm \
              where \
              ( \
              	(PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = '111513000' or cqm.Code = '48705003' or cqm.Code = '66990007' or cqm.Code = '77075001' or cqm.Code = '81416004' or cqm.Code = '84494001' or cqm.Code = '365.10' or cqm.Code = '365.11' or cqm.Code = '365.12' or cqm.Code = '365.15' or cqm.Code = 'H40.10X0' or cqm.Code = 'H40.10X1' or cqm.Code = 'H40.10X2' or cqm.Code = 'H40.10X3' or cqm.Code = 'H40.10X4' or cqm.Code = 'H40.11X0' or cqm.Code = 'H40.11X1' or cqm.Code = 'H40.11X2' or cqm.Code = 'H40.11X3' or cqm.Code = 'H40.11X4' or cqm.Code = 'H40.1210' or cqm.Code = 'H40.1211' or cqm.Code = 'H40.1212' or cqm.Code = 'H40.1213' or cqm.Code = 'H40.1214' or cqm.Code = 'H40.1220' or cqm.Code = 'H40.1221' or cqm.Code = 'H40.1222' or cqm.Code = 'H40.1223' or cqm.Code = 'H40.1224' or cqm.Code = 'H40.1230' or cqm.Code = 'H40.1231' or cqm.Code = 'H40.1232' or cqm.Code = 'H40.1233' or cqm.Code = 'H40.1234' or cqm.Code = 'H40.1290' or cqm.Code = 'H40.1291' or cqm.Code = 'H40.1292' or cqm.Code = 'H40.1293' or cqm.Code = 'H40.1294' or cqm.Code = 'H40.151' or cqm.Code = 'H40.152' or cqm.Code = 'H40.153' or cqm.Code = 'H40.159' \
              	) \
              	and  \
              	(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              select tmpa.PatId \
              from @tempTableA tmpa, @tempTableB tmpb \
              where \
              ( \
              	(tmpa.PatId = tmpb.PatId) \
              	and \
              	(tmpb.StopDate >= isNull (tmpa.StartDate, tmpa.DateofVisit) or tmpb.StopDate is null) \
              	and \
              	( \
              		(isNull (tmpb.StartDate, tmpb.DateofVisit) <= isNull (tmpa.StopDate, tmpa.DateofVisit)) \
              		or \
              		( \
              			DATEDIFF(day, isNull (tmpb.StartDate, tmpb.DateofVisit), tmpa.DateofVisit) = 0 \
              		) \
              	) \
              ) \
          ";


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
                                      callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Diagnosis, Active: Diabetic Retinopathy before or during visit"});
                                    }

                                  });
                                }
                                else if(err)
                                {
                                  callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                                }
                                else
                                {
                                  callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Encounter type is not office visit"});
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



}
