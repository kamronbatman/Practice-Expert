var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select (pat.PatId) \
              from xrxEhr_CQM cqm, xrxPat pat \
              where \
              ( \
                pat.PatId = '"+patId+"' \
                and (pat.PatId = cqm.patId) \
                and (pat.Birthdate is not null) \
                and \
                ( \
                  (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                and \
                ( \
                  cqm.Code = 'G0101' or cqm.Code = 'G0108' or cqm.Code = 'G0270' or cqm.Code = 'G0271' or cqm.Code = 'G0402' or cqm.Code = 'G0438' or cqm.Code = 'G0439' or cqm.Code = 'G0447' or cqm.Code = '10197000' or cqm.Code = '108220007' or cqm.Code = '108221006' or cqm.Code = '108224003' or cqm.Code = '108311000' or cqm.Code = '13607009' or cqm.Code = '14736009' or cqm.Code = '165171009' or cqm.Code = '18512000' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '225967005' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '30346009' or cqm.Code = '308335008' or cqm.Code = '32537008' or cqm.Code = '35025007' or cqm.Code = '37894004' or cqm.Code = '386372009' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '410155007' or cqm.Code = '410157004' or cqm.Code = '410158009' or cqm.Code = '410160006' or cqm.Code = '410170008' or cqm.Code = '410172000' or cqm.Code = '46662001' or cqm.Code = '55162003' or cqm.Code = '68381003' or cqm.Code = '78318003' or cqm.Code = '83607001' or cqm.Code = '8411005' or cqm.Code = '86013001' or cqm.Code = '90526000' or cqm.Code = 'D7140' or cqm.Code = 'D7210' or cqm.Code = '90791' or cqm.Code = '90792' or cqm.Code = '90832' or cqm.Code = '90834' or cqm.Code = '90837' or cqm.Code = '90839' or cqm.Code = '96150' or cqm.Code = '96151' or cqm.Code = '96152' or cqm.Code = '97001' or cqm.Code = '97003' or cqm.Code = '97802' or cqm.Code = '97803' or cqm.Code = '98960' or cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
                ) \
                and \
                ( \
                  cqm.Category = 'Visit Type' \
                ) \
                and	((select dbo.xrxGetPatAge(pat.Birthdate,null, cqm.DateOfVisit)) >= 18) \
              )";
    var sql2 = "declare  @tempTableA table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                declare  @tempTableC table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                declare  @tempTableB table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                declare  @tempTableAB table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                declare  @tempTableAC table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                insert into @tempTableA \
                select (pat.PatId), cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from xrxEhr_CQM cqm, xrxPat pat \
                where \
                ( \
                	pat.PatId = '"+patId+"' \
                	and (pat.PatId = cqm.patId) \
                	and (pat.Birthdate is not null) \
                	and \
                	( \
                		(cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                	) \
                	and \
                	( \
                		cqm.Code = 'G0101' or cqm.Code = 'G0108' or cqm.Code = 'G0270' or cqm.Code = 'G0271' or cqm.Code = 'G0402' or cqm.Code = 'G0438' or cqm.Code = 'G0439' or cqm.Code = 'G0447' or cqm.Code = '10197000' or cqm.Code = '108220007' or cqm.Code = '108221006' or cqm.Code = '108224003' or cqm.Code = '108311000' or cqm.Code = '13607009' or cqm.Code = '14736009' or cqm.Code = '165171009' or cqm.Code = '18512000' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '225967005' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '30346009' or cqm.Code = '308335008' or cqm.Code = '32537008' or cqm.Code = '35025007' or cqm.Code = '37894004' or cqm.Code = '386372009' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '410155007' or cqm.Code = '410157004' or cqm.Code = '410158009' or cqm.Code = '410160006' or cqm.Code = '410170008' or cqm.Code = '410172000' or cqm.Code = '46662001' or cqm.Code = '55162003' or cqm.Code = '68381003' or cqm.Code = '78318003' or cqm.Code = '83607001' or cqm.Code = '8411005' or cqm.Code = '86013001' or cqm.Code = '90526000' or cqm.Code = 'D7140' or cqm.Code = 'D7210' or cqm.Code = '90791' or cqm.Code = '90792' or cqm.Code = '90832' or cqm.Code = '90834' or cqm.Code = '90837' or cqm.Code = '90839' or cqm.Code = '96150' or cqm.Code = '96151' or cqm.Code = '96152' or cqm.Code = '97001' or cqm.Code = '97003' or cqm.Code = '97802' or cqm.Code = '97803' or cqm.Code = '98960' or cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
                	) \
                	and \
                	( \
                		cqm.Category = 'Visit Type' \
                	) \
                  and	((select dbo.xrxGetPatAge(pat.Birthdate,null, cqm.DateOfVisit)) >= 18) \
                ) \
                insert into @tempTableB \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from  xrxEhr_CQM cqm  \
                where \
                ( \
                	(cqm.ReasonCode is null) \
                	and \
                	( \
                		cqm.Code = '305284002' or cqm.Code = '305381007' or cqm.Code = '305981001' or cqm.Code = '306237005' or cqm.Code = '306288008' or cqm.Code = 'V66.7' or cqm.Code = 'Z51.5' \
                	) \
                	and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                insert into @tempTableC \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from  xrxEhr_CQM cqm \
                where \
                ( \
                	( \
                		cqm.Code = '39156-5' \
                	) \
                	and \
                	( \
                		cqm.ReasonCode = '183932001' or cqm.ReasonCode = '397745006' or cqm.ReasonCode = '407563006' \
                		or cqm.ReasonCode = '105480006' or cqm.ReasonCode = '183944003' or cqm.ReasonCode = '183945002' or cqm.ReasonCode = '413310006' or cqm.ReasonCode = '413311005' or cqm.ReasonCode = '413312003'  \
                	) \
                	and \
                	(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                insert into @tempTableAB \
                select tmpb.PatId, tmpb.DateOfVisit, tmpb.StopDate, tmpb.StartDate \
                from @tempTableA tmpa, @tempTableB tmpb \
                where \
                ( \
                	(tmpa.PatId = tmpb.PatId) \
                	and \
                	( \
                		isNull (tmpb.StartDate, tmpb.DateofVisit) <= isNull (tmpa.StopDate, tmpa.DateofVisit) \
                		or \
                		( \
                			DATEDIFF(day,isNull(tmpb.StartDate, tmpb.DateofVisit),  tmpa.DateofVisit) = 0 \
                		) \
                	) \
                ) \
                insert into @tempTableAC \
                select tmpc.PatId, tmpc.DateOfVisit, tmpc.StopDate, tmpc.StartDate \
                from @tempTableA tmpa, @tempTableC tmpc \
                where \
                ( \
                	(tmpa.PatId = tmpc.PatId) \
                	and \
                	( \
                		DATEDIFF(day,isNull(tmpc.StartDate, tmpc.DateofVisit),  tmpa.DateofVisit) = 0 \
                	) \
                )	\
                select (cqm.PatId) \
                from xrxEhr_CQM cqm \
                where  \
                ( \
                	cqm.patId in (select PatId from @tempTableA) \
                	and not \
                	( \
                		(cqm.patId in (select PatId from @tempTableAB)) \
                		or \
                		(cqm.patId in (select PatId from @tempTableAC)) \
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
                            callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Message 2"});
                          }

                        });
                      }
                      else if(err)
                      {
                        callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                      }
                      else
                      {
                        callback({criteriaName: "Denominator", isCriteriaQualify : false, message : "Message 1"});
                      }

                    });


}
