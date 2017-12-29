var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

    var sql1 = "select (pat.PatId) \
                from  xrxPat pat \
                where \
                ( \
                	(pat.PatId = '"+patId+"') \
                  and (pat.Sex is not null) \
                	and (pat.Sex = 'F') \
                  and (pat.Birthdate is not null) \
                  and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 18) \
                )";


    var sql2 = "declare  @tempTableA table \
                ( \
                	PatId varchar(25) \
                ) \
                declare  @tempTableB table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime, \
                	Code varchar(25) \
                ) \
                declare  @tempTableC table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                declare  @tempTableBC table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                insert into @tempTableA \
                select cqm.PatId \
                from  xrxEhr_CQM cqm \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	( \
                		( \
                			cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
                		) \
                		or \
                		( \
                			cqm.Code = '11797002' or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185316007' or cqm.Code = '185317003' or cqm.Code = '185318008' or cqm.Code = '185320006' or cqm.Code = '185321005' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270424005' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '308720009' or cqm.Code = '386473003' or cqm.Code = '390906007' or cqm.Code = '401267002' or cqm.Code = '401271004' or cqm.Code = '406547006' or cqm.Code = '438515009' or cqm.Code = '438516005' or cqm.Code = '439708006' or cqm.Code = '445450000' or cqm.Code = '448337001' or cqm.Code = '4525004' or cqm.Code = '87790002' or cqm.Code = '90526000' \
                		) \
                	) \
                    and \
                    ( \
                        cqm.Category = 'Visit Type' \
                    ) \
                	and \
                	( \
                		(cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                	) \
                ) \
                GROUP BY cqm.PatId HAVING COUNT(cqm.PatId) >=  2 \
                insert into @tempTableB \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate, (cqm.Code) \
                from xrxEhr_Cqm cqm \
                inner join \
                ( \
                	select cqm.PatId, min(isNull (cqm.StartDate, cqm.DateofVisit)) as StartDate \
                    from xrxEhr_Cqm cqm \
                    where \
                    ( \
                		(cqm.PatId = '"+patId+"') \
                		and \
                		( \
                			cqm.Code = '109886000' or cqm.Code = '188147009' or cqm.Code = '188151006' or cqm.Code = '188152004' or cqm.Code = '188153009' or cqm.Code = '188154003' or cqm.Code = '188155002' or cqm.Code = '188156001' or cqm.Code = '188157005' or cqm.Code = '188159008' or cqm.Code = '254837009' or cqm.Code = '254838004' or cqm.Code = '254839007' or cqm.Code = '254840009' or cqm.Code = '278054005' or cqm.Code = '286892007' or cqm.Code = '286893002' or cqm.Code = '286894008' or cqm.Code = '286895009' or cqm.Code = '286896005' or cqm.Code = '286897001' or cqm.Code = '372064008' or cqm.Code = '372092003' or cqm.Code = '372093008' or cqm.Code = '372094002' or cqm.Code = '372137005' or cqm.Code = '373080008' or cqm.Code = '373081007' or cqm.Code = '373082000' or cqm.Code = '373083005' or cqm.Code = '373088001' or cqm.Code = '373089009' or cqm.Code = '373090000' or cqm.Code = '373091001' or cqm.Code = '403458008' or cqm.Code = '403946000' or cqm.Code = '408643008' or cqm.Code = '417181009' or cqm.Code = '427685000' or cqm.Code = '431396003' or cqm.Code = '93680004' or cqm.Code = '93745008' or cqm.Code = '93776002' or cqm.Code = '93796005' or cqm.Code = '93874009' or cqm.Code = '93876006' or cqm.Code = '93924008' or cqm.Code = '94115006' or cqm.Code = '174.0' or cqm.Code = '174.1' or cqm.Code = '174.2' or cqm.Code = '174.3' or cqm.Code = '174.4' or cqm.Code = '174.5' or cqm.Code = '174.6' or cqm.Code = '174.8' or cqm.Code = '174.9' or cqm.Code = 'C50.011' or cqm.Code = 'C50.012' or cqm.Code = 'C50.019' or cqm.Code = 'C50.111' or cqm.Code = 'C50.112' or cqm.Code = 'C50.119' or cqm.Code = 'C50.211' or cqm.Code = 'C50.212' or cqm.Code = 'C50.219' or cqm.Code = 'C50.311' or cqm.Code = 'C50.312' or cqm.Code = 'C50.319' or cqm.Code = 'C50.411' or cqm.Code = 'C50.412' or cqm.Code = 'C50.419' or cqm.Code = 'C50.511' or cqm.Code = 'C50.512' or cqm.Code = 'C50.519' or cqm.Code = 'C50.611' or cqm.Code = 'C50.612' or cqm.Code = 'C50.619' or cqm.Code = 'C50.811' or cqm.Code = 'C50.812' or cqm.Code = 'C50.819' or cqm.Code = 'C50.911' or cqm.Code = 'C50.912' or cqm.Code = 'C50.919' \
                		) \
                	) \
                	and \
                	( \
                		(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                	) \
                	group by PatId \
                )cqm2 \
                on cqm.PatId = cqm2.PatId and isNull (cqm.StartDate, cqm.DateofVisit) = cqm2.StartDate \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	( \
                		cqm.Code = '109886000' or cqm.Code = '188147009' or cqm.Code = '188151006' or cqm.Code = '188152004' or cqm.Code = '188153009' or cqm.Code = '188154003' or cqm.Code = '188155002' or cqm.Code = '188156001' or cqm.Code = '188157005' or cqm.Code = '188159008' or cqm.Code = '254837009' or cqm.Code = '254838004' or cqm.Code = '254839007' or cqm.Code = '254840009' or cqm.Code = '278054005' or cqm.Code = '286892007' or cqm.Code = '286893002' or cqm.Code = '286894008' or cqm.Code = '286895009' or cqm.Code = '286896005' or cqm.Code = '286897001' or cqm.Code = '372064008' or cqm.Code = '372092003' or cqm.Code = '372093008' or cqm.Code = '372094002' or cqm.Code = '372137005' or cqm.Code = '373080008' or cqm.Code = '373081007' or cqm.Code = '373082000' or cqm.Code = '373083005' or cqm.Code = '373088001' or cqm.Code = '373089009' or cqm.Code = '373090000' or cqm.Code = '373091001' or cqm.Code = '403458008' or cqm.Code = '403946000' or cqm.Code = '408643008' or cqm.Code = '417181009' or cqm.Code = '427685000' or cqm.Code = '431396003' or cqm.Code = '93680004' or cqm.Code = '93745008' or cqm.Code = '93776002' or cqm.Code = '93796005' or cqm.Code = '93874009' or cqm.Code = '93876006' or cqm.Code = '93924008' or cqm.Code = '94115006' or cqm.Code = '174.0' or cqm.Code = '174.1' or cqm.Code = '174.2' or cqm.Code = '174.3' or cqm.Code = '174.4' or cqm.Code = '174.5' or cqm.Code = '174.6' or cqm.Code = '174.8' or cqm.Code = '174.9' or cqm.Code = 'C50.011' or cqm.Code = 'C50.012' or cqm.Code = 'C50.019' or cqm.Code = 'C50.111' or cqm.Code = 'C50.112' or cqm.Code = 'C50.119' or cqm.Code = 'C50.211' or cqm.Code = 'C50.212' or cqm.Code = 'C50.219' or cqm.Code = 'C50.311' or cqm.Code = 'C50.312' or cqm.Code = 'C50.319' or cqm.Code = 'C50.411' or cqm.Code = 'C50.412' or cqm.Code = 'C50.419' or cqm.Code = 'C50.511' or cqm.Code = 'C50.512' or cqm.Code = 'C50.519' or cqm.Code = 'C50.611' or cqm.Code = 'C50.612' or cqm.Code = 'C50.619' or cqm.Code = 'C50.811' or cqm.Code = 'C50.812' or cqm.Code = 'C50.819' or cqm.Code = 'C50.911' or cqm.Code = 'C50.912' or cqm.Code = 'C50.919' \
                	) \
                	and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                insert into @tempTableC \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from xrxEhr_Cqm cqm \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	( \
                		(cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                	) \
                	and \
                    ( \
                        cqm.Category = 'Visit Type' \
                    ) \
                	and \
                    ( \
                	    ( \
                		    cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
                	    ) \
                	    or \
                	    ( \
                		    cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
                	    ) \
                    ) \
                ) \
                insert into @tempTableBC \
                select tmpb.PatId, tmpb.DateOfVisit, tmpb.StopDate, tmpb.StartDate \
                from @tempTableB tmpb, @tempTableC tmpc \
                where \
                ( \
                	(tmpb.PatId = tmpc.PatId) \
                	and \
                	( \
                		(isNull (tmpb.StartDate, tmpb.DateofVisit) >=  dateadd(day, -1826 , tmpc.DateofVisit)) \
                		and \
                		( \
                			(isNull (tmpb.StartDate, tmpb.DateofVisit) <=  isNull (tmpc.StopDate, tmpc.DateofVisit)) \
                			or \
                			DATEDIFF(day,isNull(tmpb.StartDate, tmpb.DateofVisit), isNull (tmpc.StopDate, tmpc.DateofVisit)) = 0 \
                		) \
                		and \
                		( \
                			(tmpb.StopDate is null) \
                			or \
                			(tmpb.StopDate >= tmpc.DateofVisit) \
                		) \
                	) \
                ) \
                select distinct(pat.PatId) \
                from xrxPat pat \
                where \
                ( \
                    ( \
                		pat.PatId in \
                		( \
                			(SELECT PatId FROM @tempTableA) \
                		) \
                	) \
                	and \
                	( \
                		pat.PatId in \
                		( \
                			(SELECT PatId FROM @tempTableBC) \
                		) \
                	) \
          )";

  cqmGuideController.cqmCheck(sql1, function(err, record){

      if(record && record.length > 0)
      {
          cqmGuideController.cqmCheck(sql2, function(err, record){

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
              callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : "Count of Visit >= 2 and  Diagnosis, Active: Breast Cancer  <= 5 year(s) starts before or during visit"});
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
