var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "declare @tempTableF table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare  @tempTableABC table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              insert into @tempTableF \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm \
              where \
              ( \
              	(PatId = '"+patId+"') \
                  and \
              	(cqm.Flag is null) \
              	and \
              	( \
              		cqm.Code = '38208-5' or cqm.Code = '38214-3' or cqm.Code = '38221-8' or cqm.Code = '72514-3' \
              	) \
              	and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              insert into @tempTableABC \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm \
              where \
              ( \
              	(PatId = '"+patId+"') \
                  and \
              	(cqm.ReasonCode is null) \
              	and \
              	( \
                      ( \
              		        cqm.Code = '84755001' or cqm.Code = '77427' or cqm.Code = '77431' or cqm.Code = '77432' or cqm.Code = '77435' or cqm.Code = '77470' \
              		    ) \
                      or \
                      ( \
                          ( \
                              cqm.Code='99201' or cqm.Code='99202' or cqm.Code='99203' or cqm.Code='99204' or cqm.Code='99205' or cqm.Code='99212' or cqm.Code='99213' or cqm.Code='99214' or cqm.Code='99215' \
              		            or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '4525004' or cqm.Code = '87790002' or cqm.Code = '90526000' \
              	          ) \
                          and \
                          ( \
                              cqm.Category = 'Visit Type' \
                          ) \
                      ) \
                  ) \
              	and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              select tmpf.PatId from  @tempTableF tmpf, @tempTableABC tmpabc \
              where \
              ( \
              	(tmpf.PatId = tmpabc.PatId) \
              	and \
              	DATEDIFF(day,isNull (tmpf.StartDate, tmpf.DateofVisit), isNull (tmpabc.DateofVisit, tmpabc.DateofVisit)) = 0 \
              )";

  cqmGuideController.cqmCheck(sql1, function(err, record){
      if(record && record.length > 0)
      {
        callback({criteriaName: "Numerator", isCriteriaQualify : true,  message : null});
      }
      else if(err) {
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : err});
      }
      else {
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Risk Category Assessment: Standardized Pain Assessment Tool (result)"});
      }
  });
}
