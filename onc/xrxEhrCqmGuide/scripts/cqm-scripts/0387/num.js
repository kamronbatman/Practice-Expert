var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "declare  @tempTableC table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare  @tempTableF table \
              (	 \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime, \
              	Flag varchar(20) \
              ) \
              insert into @tempTableF \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate, cqm.Flag \
              from xrxEhr_Cqm cqm \
              where \
              ( \
              	(cqm.PatId = '"+patId+"') \
                and  \
              	( \
              		cqm.Code =	'1098617' or cqm.Code =	'198240' or cqm.Code =	'199224' or cqm.Code =	'200064' or cqm.Code =	'310261' or  cqm.Code =	'313195' or  cqm.Code =	'389230' or cqm.Code =	'795141' \
              	) \
              	and \
              	( \
              		  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              	) \
              ) \
              insert into @tempTableC \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from xrxEhr_Cqm cqm \
              where \
              ( \
              	  (cqm.PatId = '"+patId+"') \
                  and  \
                  ( \
              	    ( \
              		    cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
              	    ) \
              	    or \
              	    ( \
              		    cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
              	    ) \
                  ) \
                  and \
                  ( \
                      cqm.Category = 'Visit Type' \
                  ) \
              	and  \
              	( \
              		(cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              	) \
              ) \
              select(tmpf.PatId) from  @tempTableF tmpf, @tempTableC tmpc \
              where \
              ( \
              	(tmpf.PatId = tmpc.PatId) \
              	and \
              	( \
              		( \
              			(tmpf.StartDate is not null) \
              			and \
              			( \
              				tmpf.StartDate <= isNull (tmpc.StopDate, tmpc.DateofVisit) \
              				or \
              				DATEDIFF(day,isNull (tmpf.StartDate, tmpf.DateofVisit), tmpc.DateofVisit) = 0 \
              			) \
              			and \
              			( \
              				(tmpf.StopDate is null) \
              				or \
              				(tmpf.StopDate >=  tmpc.DateofVisit) \
              			) \
              		) \
              		or \
              		( \
              				(tmpf.StartDate is null) and (tmpf.Flag is null) \
              				and \
              				( \
              					 tmpf.DateofVisit =  tmpc.DateofVisit \
              					 or \
              					DATEDIFF(day,isNull (tmpf.StartDate, tmpf.DateofVisit), tmpc.DateofVisit) = 0 \
              				) \
              		) \
              	) \
              ) \
            ";

  cqmGuideController.cqmCheck(sql1, function(err, record){
      if(record && record.length > 0)
      {
        callback({criteriaName: "Numerator", isCriteriaQualify : true,  message : null});
      }
      else if(err) {
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : err});
      }
      else {
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Medication, Order or Active: Tamoxifen or Aromatase Inhibitor Therapy"});
      }
  });
}
