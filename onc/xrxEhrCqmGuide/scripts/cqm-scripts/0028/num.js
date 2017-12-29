var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {


var sql1 ="declare  @tempTableA table \
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
          declare  @tempTableC table \
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
          	StopDate smalldatetime, \
          	StartDate smalldatetime \
          ) \
          declare  @tempTableCD table \
          ( \
          	PatId varchar(25), \
          	DateOfVisit smalldatetime, \
          	StopDate smalldatetime, \
          	StartDate smalldatetime \
          ) \
          insert into @tempTableA \
          select (cqm.PatId), cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
          from  xrxEhr_CQM cqm \
          where \
          (cqm.PatId = '"+patId+"') \
          and \
          ( \
          	( \
           		cqm.Code = '105539002' or cqm.Code = '105540000' or cqm.Code = '105541001' or cqm.Code = '160618006' or cqm.Code = '160620009' or cqm.Code = '160621008' or cqm.Code = '228501004' or cqm.Code = '228502006' or cqm.Code = '228503001' or cqm.Code = '228512004' or cqm.Code = '266919005' or cqm.Code = '266921000' or cqm.Code = '266922007' or cqm.Code = '266923002' or cqm.Code = '266924008' or cqm.Code = '266925009' or cqm.Code = '266928006' or cqm.Code = '281018007' or cqm.Code = '360890004' or cqm.Code = '360900008' or cqm.Code = '360918006' or cqm.Code = '360929005' or cqm.Code = '405746006' or cqm.Code = '53896009' or cqm.Code = '8392000' or cqm.Code = '8517006' or cqm.Code = '87739003' \
          	) \
          	and \
          	( \
          		(cqm.DateofVisit is not null) \
          	) \
          	and \
          	( \
          		(isNull (cqm.StartDate, cqm.DateofVisit) >= dateadd(month, -24, '"+fromDate+"')) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
          	) \
          ) \
          insert into @tempTableB \
          select (cqm.PatId), cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
          from  xrxEhr_CQM cqm \
          where \
          (cqm.PatId = '"+patId+"') \
          and \
          ( \
          	( \
          		cqm.Code = '428041000124106' or cqm.Code = '428061000124105' or cqm.Code = '428071000124103' or cqm.Code = '160603005' or cqm.Code = '160604004' or cqm.Code = '160605003' or cqm.Code = '160606002' or cqm.Code = '160619003' or cqm.Code = '228494002' or cqm.Code = '228504007' or cqm.Code = '228514003' or cqm.Code = '228515002' or cqm.Code = '228516001' or cqm.Code = '228517005' or cqm.Code = '228518000' or cqm.Code = '230059006' or cqm.Code = '230060001' or cqm.Code = '230062009' or cqm.Code = '230063004' or cqm.Code = '230064005' or cqm.Code = '230065006' or cqm.Code = '266920004' or cqm.Code = '449868002' or cqm.Code = '65568007' or cqm.Code = '77176002' or cqm.Code = '81703003' or cqm.Code = '82302008' \
          	) \
          	and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
          ) \
          insert into @tempTableAB \
          select (tmpa.PatId), tmpa.DateOfVisit, tmpa.StopDate, tmpa.StartDate \
          from @tempTableA tmpa, @tempTableB tmpb \
          where \
          (tmpa.PatId = tmpb.PatId) \
          and \
          ( \
          	(tmpa.StopDate is not null) \
          	 and \
          	(tmpa.StopDate < isNull (tmpb.StartDate, tmpb.DateofVisit)) \
          ) \
          DELETE FROM @tempTableA WHERE PatId In (SELECT PatId FROM @tempTableAB) \
          insert into @tempTableC \
          select (cqm.PatId), cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
          from xrxEhr_CQM cqm \
          where \
          (cqm.PatId = '"+patId+"') \
          and \
          ( \
          	( \
          		cqm.Code = '428041000124106' or cqm.Code = '428061000124105' or cqm.Code = '428071000124103' or cqm.Code = '160603005' or cqm.Code = '160604004' or cqm.Code = '160605003' or cqm.Code = '160606002' or cqm.Code = '160619003' or cqm.Code = '228494002' or cqm.Code = '228504007' or cqm.Code = '228514003' or cqm.Code = '228515002' or cqm.Code = '228516001' or cqm.Code = '228517005' or cqm.Code = '228518000' or cqm.Code = '230059006' or cqm.Code = '230060001' or cqm.Code = '230062009' or cqm.Code = '230063004' or cqm.Code = '230064005' or cqm.Code = '230065006' or cqm.Code = '266920004' or cqm.Code = '449868002' or cqm.Code = '65568007' or cqm.Code = '77176002' or cqm.Code = '81703003' or cqm.Code = '82302008' \
          	) \
          	and \
          	( \
          		(cqm.DateofVisit is not null) \
          	) \
          	and \
          	( \
          		(isNull (cqm.StartDate, cqm.DateofVisit) >= dateadd(month, -24, '"+fromDate+"')) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
          	) \
          ) \
          insert into @tempTableD \
          select (cqm.PatId), cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
          from xrxEhr_CQM cqm \
          where \
          (cqm.PatId = '"+patId+"') \
          and \
          ( \
          	( \
          		cqm.Code = '105539002' or cqm.Code = '105540000' or cqm.Code = '105541001' or cqm.Code = '160618006' or cqm.Code = '160620009' or cqm.Code = '160621008' or cqm.Code = '228501004' or cqm.Code = '228502006' or cqm.Code = '228503001' or cqm.Code = '228512004' or cqm.Code = '266919005' or cqm.Code = '266921000' or cqm.Code = '266922007' or cqm.Code = '266923002' or cqm.Code = '266924008' or cqm.Code = '266925009' or cqm.Code = '266928006' or cqm.Code = '281018007' or cqm.Code = '360890004' or cqm.Code = '360900008' or cqm.Code = '360918006' or cqm.Code = '360929005' or cqm.Code = '405746006' or cqm.Code = '53896009' or cqm.Code = '8392000' or cqm.Code = '8517006' or cqm.Code = '87739003' \
          	) \
          	and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
          ) \
          insert into @tempTableCD \
          select (tmpc.PatId), tmpc.DateOfVisit, tmpc.StopDate, tmpc.StartDate \
          from @tempTableC tmpc, @tempTableD tmpd \
          where \
          (tmpc.PatId = tmpd.PatId) \
          and \
          ( \
          	(tmpc.StopDate is not null) \
          	 and \
          	(tmpc.StopDate < isNull (tmpd.StartDate, tmpd.DateofVisit)) \
          ) \
          DELETE FROM @tempTableC WHERE PatId In (SELECT PatId FROM @tempTableCD) \
          select distinct cqm.PatId  from   xrxEhr_cqm cqm \
          where \
          cqm.PatId = '"+patId+"' \
          and \
          ( \
          	( \
          		cqm.PatId in \
          		( \
          			SELECT tmpa.PatId FROM @tempTableA tmpa \
          		) \
          	) \
          	or \
          	( \
          		cqm.PatId in \
          		( \
          			SELECT tmpc.PatId FROM @tempTableC tmpc \
          		) \
          		and \
          		cqm.PatId in \
          		( \
                SELECT cqm.PatId FROM xrxEhr_cqm cqm WHERE \
          			( \
          				( \
          					( \
          						cqm.Code = '99406' or cqm.Code = '99407' or cqm.Code = '171055003' or cqm.Code = '185792005' or cqm.Code = '185793000' or cqm.Code = '185794006' or cqm.Code = '185795007' or cqm.Code = '185796008' or cqm.Code = '225323000' or cqm.Code = '225324006' or cqm.Code = '310429001' or cqm.Code = '315232003' or cqm.Code = '384742004' \
          						or cqm.Code = 'V65.42' or cqm.Code = 'Z71.6' \
                    ) \
          					or \
          					( \
          						(cqm.StartDate is not null) \
          						and \
          						( \
          							cqm.Code = '1046847' or cqm.Code = '1046858' or cqm.Code = '151226' or cqm.Code = '198029' or cqm.Code = '198030' or cqm.Code = '198031' or cqm.Code = '198045' or cqm.Code = '198046' or cqm.Code = '198047' or cqm.Code = '199888' or cqm.Code = '199889' or cqm.Code = '199890' or cqm.Code = '205315' or cqm.Code = '205316' or cqm.Code = '250983' or cqm.Code = '311972' or cqm.Code = '311973' or cqm.Code = '311975' or cqm.Code = '312036' or cqm.Code = '314119' or cqm.Code = '317136' or cqm.Code = '359817' or cqm.Code = '359818' or cqm.Code = '419168' or cqm.Code = '636671' or cqm.Code = '636676' or cqm.Code = '749289' or cqm.Code = '749788' or cqm.Code = '892244' or cqm.Code = '896100' or cqm.Code = '993503' or cqm.Code = '993518' or cqm.Code = '993536' or cqm.Code = '993541' or cqm.Code = '993550' or cqm.Code = '993557' or cqm.Code = '993567' or cqm.Code = '993681' or cqm.Code = '998671' or cqm.Code = '998675' or cqm.Code = '998679' \
          						) \
          					) \
                    or \
          					( \
          						( \
          							cqm.Code = '1046847' or cqm.Code = '1046858' or cqm.Code = '151226' or cqm.Code = '198029' or cqm.Code = '198030' or cqm.Code = '198031' or cqm.Code = '198045' or cqm.Code = '198046' or cqm.Code = '198047' or cqm.Code = '199888' or cqm.Code = '199889' or cqm.Code = '199890' or cqm.Code = '205315' or cqm.Code = '205316' or cqm.Code = '250983' or cqm.Code = '311972' or cqm.Code = '311973' or cqm.Code = '311975' or cqm.Code = '312036' or cqm.Code = '314119' or cqm.Code = '317136' or cqm.Code = '359817' or cqm.Code = '359818' or cqm.Code = '419168' or cqm.Code = '636671' or cqm.Code = '636676' or cqm.Code = '749289' or cqm.Code = '749788' or cqm.Code = '892244' or cqm.Code = '896100' or cqm.Code = '993503' or cqm.Code = '993518' or cqm.Code = '993536' or cqm.Code = '993541' or cqm.Code = '993550' or cqm.Code = '993557' or cqm.Code = '993567' or cqm.Code = '993681' or cqm.Code = '998671' or cqm.Code = '998675' or cqm.Code = '998679' \
          						) \
          					) \
          				) \
          				and \
          				(isNull (cqm.StartDate, cqm.DateofVisit) >= dateadd(month, -24, '"+fromDate+"')) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
          			) \
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
                callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Tobacco Use: Screening and Cessation Intervention"});
              }
    });






};
