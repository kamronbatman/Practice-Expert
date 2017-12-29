var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "declare  @tempTableA table \
              ( \
                PatId varchar(25), \
                DateOfVisit smalldatetime, \
                StopDate smalldatetime, \
                StartDate smalldatetime \
              ) \
              declare  @tempTableD table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	BMI real \
              ) \
              declare  @tempTableE table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare  @tempTableF table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare  @tempTableDE table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare  @tempTableDF table \
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
                and	((select dbo.xrxGetPatAge(pat.Birthdate,null, cqm.DateOfVisit)) >= 65) \
              ) \
              insert into @tempTableD \
              select (pn.PatId), pn.DateOfVisit, pn.BMI \
              from xrxEhr_pn pn \
              inner join  \
              ( \
                  select PatId, max(DateOfVisit) as DateOfVisit \
                  from xrxEhr_pn \
                  where \
                  ( \
              		(PatId = '"+patId+"') \
              		and \
              		BMI is not null \
              		and \
              		(DateOfVisit>= '"+fromDate+"') and (DateOfVisit<= '"+toDate+"') and  (isNull(FclId, '') = case when ('"+fclId+"' = '')  then isNull(FclId, '') else '"+fclId+"' end) and  (isNull(DctId, '') = case when ('"+dctId+"' = '')  then isNull(DctId, '') else '"+dctId+"' end) \
                ) \
                  group by PatId \
              ) pn1  \
              on pn.PatId = pn1.PatId and pn.DateOfVisit = pn1.DateOfVisit \
              insert into @tempTableE \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm \
              where \
              ( \
              	(cqm.PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = 'G8417' or cqm.Code = 'S9449' or cqm.Code = 'S9451' or cqm.Code = 'S9452' or cqm.Code = 'S9470' or cqm.Code = '304549008' or cqm.Code = '307818003' or cqm.Code = '361231003' or cqm.Code = '370847001' or cqm.Code = '386291006' or cqm.Code = '386292004' or cqm.Code = '386373004' or cqm.Code = '386463000' or cqm.Code = '386464006' or cqm.Code = '410177006' or cqm.Code = '413315001' or cqm.Code = '418995006' or cqm.Code = '424753004' or cqm.Code = '443288003' or cqm.Code = 'V65.3' or cqm.Code = 'V65.41' or cqm.Code = '43644' or cqm.Code = '43645' or cqm.Code = '43770' or cqm.Code = '43771' or cqm.Code = '43772' or cqm.Code = '43773' or cqm.Code = '43774' or cqm.Code = '43842' or cqm.Code = '43843' or cqm.Code = '43845' or cqm.Code = '43846' or cqm.Code = '43847' or cqm.Code = '43848' or cqm.Code = '97804' or cqm.Code = '98960' or cqm.Code = '99078' or cqm.Code = 'Z71.3' \
              		or cqm.Code = '103698003' or cqm.Code = '103699006' or cqm.Code = '183515008' or cqm.Code = '183524004' or cqm.Code = '183583007' or cqm.Code = '185359002' or cqm.Code = '305922005' or cqm.Code = '306136006' or cqm.Code = '306163007' or cqm.Code = '306164001' or cqm.Code = '306165000' or cqm.Code = '306166004' or cqm.Code = '306167008' or cqm.Code = '306168003' or cqm.Code = '306226009' or cqm.Code = '306227000' or cqm.Code = '306252003' or cqm.Code = '306344004' or cqm.Code = '306353006' or cqm.Code = '306354000' or cqm.Code = '308459004' or cqm.Code = '308470006' or cqm.Code = '308477009' or cqm.Code = '390864007' or cqm.Code = '390866009' or cqm.Code = '390893007' or cqm.Code = '408289007' or cqm.Code = '410160006' or cqm.Code = '416790000' or cqm.Code = '424203006' or cqm.Code = '91251008' \
              		or ((cqm.Code = '314153' or cqm.Code = '692876')) \
              	) \
              	and \
              	(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              insert into @tempTableF \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm  \
              where \
              ( \
              	(cqm.PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = 'G8418' or cqm.Code = 'S9449' or cqm.Code = 'S9452' or cqm.Code = 'S9470' or cqm.Code = '386464006' or cqm.Code = '410177006' or cqm.Code = '413315001' or cqm.Code = '418995006' or cqm.Code = '424753004' or cqm.Code = '429095004' or cqm.Code = '443288003' or cqm.Code = 'V65.3' or cqm.Code = 'Z71.3' \
              		or cqm.Code = '103698003' or cqm.Code = '103699006' or cqm.Code = '183515008' or cqm.Code = '183524004' or cqm.Code = '183583007' or cqm.Code = '185359002' or cqm.Code = '305922005' or cqm.Code = '306136006' or cqm.Code = '306163007' or cqm.Code = '306164001' or cqm.Code = '306165000' or cqm.Code = '306166004' or cqm.Code = '306167008' or cqm.Code = '306168003' or cqm.Code = '306226009' or cqm.Code = '306227000' or cqm.Code = '306252003' or cqm.Code = '306344004' or cqm.Code = '306353006' or cqm.Code = '306354000' or cqm.Code = '308459004' or cqm.Code = '308470006' or cqm.Code = '308477009' or cqm.Code = '390864007' or cqm.Code = '390866009' or cqm.Code = '390893007' or cqm.Code = '408289007' or cqm.Code = '410160006' or cqm.Code = '416790000' or cqm.Code = '424203006' or cqm.Code = '91251008' \
              		or ((cqm.Code = '577154' or cqm.Code = '860215'  or cqm.Code = '860221' or cqm.Code = '860225' or cqm.Code = '860231')) \
              	) \
              	and \
              	(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              insert into @tempTableDE \
              select tmpe.PatId, tmpe.DateOfVisit, tmpe.StopDate, tmpe.StartDate \
              from @tempTableE tmpe, @tempTableD tmpd \
              where \
              ( \
              	(tmpe.PatId = tmpd.PatId) \
              	and \
              	(tmpe.DateofVisit >= dateadd(month, -6 ,   tmpd.DateofVisit)) \
              	and \
              	( \
              		(tmpe.DateofVisit <=  tmpd.DateofVisit) \
              		or \
              		DATEDIFF(day, tmpe.DateofVisit,  tmpd.DateofVisit) = 0	\
              	) \
              ) \
              insert into @tempTableDF \
              select tmpf.PatId, tmpf.DateOfVisit, tmpf.StopDate, tmpf.StartDate \
              from @tempTableF tmpf, @tempTableD tmpd \
              where \
              ( \
              	(tmpf.PatId = tmpd.PatId) \
              	and \
              	(tmpf.DateofVisit >= dateadd(month, -6 ,   tmpd.DateofVisit)) \
              	and \
              	( \
              		(tmpf.DateofVisit <= tmpd.DateofVisit) \
              		or \
              		DATEDIFF(day, tmpf.DateofVisit,  tmpd.DateofVisit) = 0	 \
              	) \
              ) \
              select (cqm.patid) from  @tempTableD cqm, @tempTableA tmpa \
              where \
              ( \
                tmpa.PatId = cqm.PatId \
                and \
              	( \
              		(cqm.patId in (select PatId from @tempTableD where ((BMI >= 23) and (BMI < 30)) )) \
              		or \
              		( \
              			(cqm.patId in (select PatId from @tempTableD where ((BMI >= 30)) )) \
              			and \
              			(cqm.patId in (select PatId from @tempTableDE )) 	\
              		) \
              		or \
              		( \
              			(cqm.patId in (select PatId from @tempTableD where ((BMI < 23)) )) \
              			and \
              			(cqm.patId in (select PatId from @tempTableDF )) 	\
              		) \
              	) \
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
                    callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "during encounter patien age is >= 65 and, \
                                                                                                <p align='justify' class='text-danger'>BMI is in between 23 and 30</p> \
                                                                                                <p align='justify' class='text-danger'>Or BMI >= 30 and  a follow-up plan is documented within 6 moths of current encounter.  </p> \
                                                                                                <p align='justify' class='text-danger'>Or BMI < 23 and  a follow-up plan is documented within 6 moths of current encounter.  </p>"});
                  }
              });


}
