var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

    var sql1 = "select (pat.PatId) \
                from  xrxPat pat \
                where \
                ( \
                	(pat.PatId = '"+patId+"') \
                  and (pat.Birthdate is not null) \
                  and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 18) \
                  and	((select dbo.xrxGetPatAge(pat.Birthdate,null,'"+fromDate+"')) < 80) \
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
                	(cqm.PatId = '"+patId+"') \
                	and \
                    ( \
                		cqm.Code = '109838007' or cqm.Code = '187757001' or cqm.Code = '269533000' or cqm.Code = '285312008' or cqm.Code = '301756000' or cqm.Code = '312111009' or cqm.Code = '312112002' or cqm.Code = '312113007' or cqm.Code = '312114001' or cqm.Code = '312115000' or cqm.Code = '315058005' or cqm.Code = '363406005' or cqm.Code = '363407001' or cqm.Code = '363408006' or cqm.Code = '363409003' or cqm.Code = '363410008' or cqm.Code = '363412000' or cqm.Code = '363413005' or cqm.Code = '363510005' or cqm.Code = '93683002' or cqm.Code = '93761005' or cqm.Code = '93771007' or cqm.Code = '93826009' or cqm.Code = '94006002' or cqm.Code = '94072004' or cqm.Code = '94105000' or cqm.Code = '153.0' or cqm.Code = '153.1' or cqm.Code = '153.2' or cqm.Code = '153.3' or cqm.Code = '153.4' or cqm.Code = '153.6' or cqm.Code = '153.7' or cqm.Code = '153.8' or cqm.Code = '153.9' or cqm.Code = 'C18.0' or cqm.Code = 'C18.2' or cqm.Code = 'C18.3' or cqm.Code = 'C18.4' or cqm.Code = 'C18.5' or cqm.Code = 'C18.6' or cqm.Code = 'C18.7' or cqm.Code = 'C18.8' or cqm.Code = 'C18.9' \
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
                		cqm.Code = '109838007' or cqm.Code = '187757001' or cqm.Code = '269533000' or cqm.Code = '285312008' or cqm.Code = '301756000' or cqm.Code = '312111009' or cqm.Code = '312112002' or cqm.Code = '312113007' or cqm.Code = '312114001' or cqm.Code = '312115000' or cqm.Code = '315058005' or cqm.Code = '363406005' or cqm.Code = '363407001' or cqm.Code = '363408006' or cqm.Code = '363409003' or cqm.Code = '363410008' or cqm.Code = '363412000' or cqm.Code = '363413005' or cqm.Code = '363510005' or cqm.Code = '93683002' or cqm.Code = '93761005' or cqm.Code = '93771007' or cqm.Code = '93826009' or cqm.Code = '94006002' or cqm.Code = '94072004' or cqm.Code = '94105000' or cqm.Code = '153.0' or cqm.Code = '153.1' or cqm.Code = '153.2' or cqm.Code = '153.3' or cqm.Code = '153.4' or cqm.Code = '153.6' or cqm.Code = '153.7' or cqm.Code = '153.8' or cqm.Code = '153.9' or cqm.Code = 'C18.0' or cqm.Code = 'C18.2' or cqm.Code = 'C18.3' or cqm.Code = 'C18.4' or cqm.Code = 'C18.5' or cqm.Code = 'C18.6' or cqm.Code = 'C18.7' or cqm.Code = 'C18.8' or cqm.Code = 'C18.9' \
                	) \
                	and \
                	(cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                insert into @tempTableC \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from xrxEhr_Cqm cqm \
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
                		    cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
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
                insert into @tempTableBC \
                select tmpb.PatId, tmpb.DateOfVisit, tmpb.StopDate, tmpb.StartDate \
                from @tempTableB tmpb, @tempTableC tmpc \
                where \
                ( \
                	(tmpb.PatId = tmpc.PatId) \
                	and \
                	( \
                		( \
                			(isNull (tmpb.StartDate, tmpb.DateofVisit) <=  isNull (tmpc.StopDate, tmpc.DateofVisit)) \
                			or \
                			( \
                				DATEDIFF(day,isNull(tmpb.StartDate, tmpb.DateofVisit),  tmpc.DateofVisit) = 0 \
                			) \
                		) \
                		and \
                		( \
                			(tmpb.StopDate is null) \
                			or \
                			(tmpb.StopDate >=  tmpc.DateofVisit) \
                		) \
                	) \
                ) \
                select distinct(tmpa.PatId) \
                from @tempTableA tmpa \
                where \
                ( \
                	( \
                		tmpa.PatId in \
                		( \
                			(SELECT PatId FROM @tempTableBC) \
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
                  callback({criteriaName: "Inital Patient Population", isCriteriaQualify : true,  message : null});
                }
                else if(err)
                {
                  callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : err});
                }
                else
                {
                  callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : "Count of Visit >= 2 AND Diagnosis, Active: Colon Cancer starts during Measurement Period"});
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
