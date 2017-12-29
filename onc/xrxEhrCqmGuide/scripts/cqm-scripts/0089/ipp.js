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
              		or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000'  \
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
              		cqm.Code = '193349004' or cqm.Code = '193350004' or cqm.Code = '232020009' or cqm.Code = '232021008' or cqm.Code = '232022001' or cqm.Code = '232023006' or cqm.Code = '25412000' or cqm.Code = '311782002' or cqm.Code = '312903003' or cqm.Code = '312904009' or cqm.Code = '312905005' or cqm.Code = '312906006' or cqm.Code = '312907002' or cqm.Code = '312908007' or cqm.Code = '312909004' or cqm.Code = '312912001' or cqm.Code = '314010006' or cqm.Code = '314011005' or cqm.Code = '314014002' or cqm.Code = '314015001' or cqm.Code = '390834004' or cqm.Code = '399862001' or cqm.Code = '399863006' or cqm.Code = '399864000' or cqm.Code = '399865004' or cqm.Code = '399866003' or cqm.Code = '399868002' or cqm.Code = '399869005' or cqm.Code = '399870006' or cqm.Code = '399871005' or cqm.Code = '399872003' or cqm.Code = '399873008' or cqm.Code = '399874002' or cqm.Code = '399875001' or cqm.Code = '399876000' or cqm.Code = '399877009' or cqm.Code = '420486006' or cqm.Code = '420789003' or cqm.Code = '421779007' or cqm.Code = '422034002' or cqm.Code = '4855003' or cqm.Code = '59276001' or cqm.Code = '362.01' or cqm.Code = '362.02' or cqm.Code = '362.03' or cqm.Code = '362.04' or cqm.Code = '362.05' or cqm.Code = '362.06' or cqm.Code = 'E08.311' or cqm.Code = 'E08.319' or cqm.Code = 'E08.321' or cqm.Code = 'E08.329' or cqm.Code = 'E08.331' or cqm.Code = 'E08.339' or cqm.Code = 'E08.341' or cqm.Code = 'E08.349' or cqm.Code = 'E08.351' or cqm.Code = 'E08.359' or cqm.Code = 'E09.311' or cqm.Code = 'E09.319' or cqm.Code = 'E09.321' or cqm.Code = 'E09.329' or cqm.Code = 'E09.331' or cqm.Code = 'E09.339' or cqm.Code = 'E09.341' or cqm.Code = 'E09.349' or cqm.Code = 'E09.351' or cqm.Code = 'E09.359' or cqm.Code = 'E10.311' or cqm.Code = 'E10.319' or cqm.Code = 'E10.321' or cqm.Code = 'E10.329' or cqm.Code = 'E10.331' or cqm.Code = 'E10.339' or cqm.Code = 'E10.341' or cqm.Code = 'E10.349' or cqm.Code = 'E10.351' or cqm.Code = 'E10.359' or cqm.Code = 'E11.311' or cqm.Code = 'E11.319' or cqm.Code = 'E11.321' or cqm.Code = 'E11.329' or cqm.Code = 'E11.331' or cqm.Code = 'E11.339' or cqm.Code = 'E11.341' or cqm.Code = 'E11.349' or cqm.Code = 'E11.351' or cqm.Code = 'E11.359' or cqm.Code = 'E13.311' or cqm.Code = 'E13.319' or cqm.Code = 'E13.321' or cqm.Code = 'E13.329' or cqm.Code = 'E13.331' or cqm.Code = 'E13.339' or cqm.Code = 'E13.341' or cqm.Code = 'E13.349' or cqm.Code = 'E13.351' or cqm.Code = 'E13.359' \
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
                                      callback({criteriaName: "Inital Patient Population", isCriteriaQualify : true,  message : null});
                                    }
                                    else if(err)
                                    {
                                      callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : err});
                                    }
                                    else
                                    {
                                      callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : "Diagnosis, Active: Diabetic Retinopathy should be active before or during visit."});
                                    }

                                  });
                                }
                                else if(err)
                                {
                                  callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : err});
                                }
                                else
                                {
                                  callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : "Encounter type is not office visit"});
                                }

                              });
                        }
                        else if(err)
                        {
                            callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : err});
                        }
                        else
                        {
                            callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false, message : null});
                        }

          });



}
