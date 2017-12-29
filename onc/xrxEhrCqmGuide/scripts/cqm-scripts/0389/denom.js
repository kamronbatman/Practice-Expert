var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "declare  @tempTableA table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare  @tempTableB_0 table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime, \
              	Code varchar(25) \
              ) \
              declare  @tempTableB table \
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
              declare  @tempTableC_0 table \
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
              declare  @tempTableE_0 table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime, \
              	Code varchar(25) \
              ) \
              declare  @tempTableE table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare  @tempTableAE table \
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
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm \
              where \
              ( \
              	(cqm.PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = '10492003' or cqm.Code = '113120007' or cqm.Code = '116244007' or cqm.Code = '118161009' or cqm.Code = '118162002' or cqm.Code = '118163007' or cqm.Code = '14473006' or cqm.Code = '168922004' or cqm.Code = '169327006' or cqm.Code = '169328001' or cqm.Code = '169329009' or cqm.Code = '169340001' or cqm.Code = '169349000' or cqm.Code = '169359004' or cqm.Code = '169374002' or cqm.Code = '176106009' or cqm.Code = '176258007' or cqm.Code = '176260009' or cqm.Code = '176261008' or cqm.Code = '176262001' or cqm.Code = '176263006' or cqm.Code = '176267007' or cqm.Code = '176286004' or cqm.Code = '176288003' or cqm.Code = '176319004' or cqm.Code = '19149007' or cqm.Code = '21190008' or cqm.Code = '21372000' or cqm.Code = '228677009' or cqm.Code = '228684001' or cqm.Code = '228688003' or cqm.Code = '228690002' or cqm.Code = '228692005' or cqm.Code = '228693000' or cqm.Code = '228694006' or cqm.Code = '228695007' or cqm.Code = '228697004' or cqm.Code = '228698009' or cqm.Code = '228699001' or cqm.Code = '228701001' or cqm.Code = '228702008' or cqm.Code = '236209003' or cqm.Code = '236211007' or cqm.Code = '236252003' or cqm.Code = '24242005' or cqm.Code = '26294005' or cqm.Code = '265589001' or cqm.Code = '271291003' or cqm.Code = '27877006' or cqm.Code = '28579000' or cqm.Code = '29860002' or cqm.Code = '30426000' or cqm.Code = '312235007' or cqm.Code = '314202001' or cqm.Code = '359922007' or cqm.Code = '359926005' or cqm.Code = '36253005' or cqm.Code = '37851009' or cqm.Code = '384691004' or cqm.Code = '384692006' or cqm.Code = '38915000' or cqm.Code = '394902000' or cqm.Code = '394918006' or cqm.Code = '399124002' or cqm.Code = '399180008' or cqm.Code = '399315003' or cqm.Code = '41371003' or cqm.Code = '41416003' or cqm.Code = '420529003' or cqm.Code = '427357007' or cqm.Code = '427985002' or cqm.Code = '433224001' or cqm.Code = '433225000' or cqm.Code = '440093006' or cqm.Code = '440094000' or cqm.Code = '57525009' or cqm.Code = '62867004' or cqm.Code = '64978007' or cqm.Code = '65381004' or cqm.Code = '65551008' or cqm.Code = '67598001' or cqm.Code = '68986004' or cqm.Code = '72388004' or cqm.Code = '77613002' or cqm.Code = '81232004' or cqm.Code = '83154001' or cqm.Code = '84755001' or cqm.Code = '85768003' or cqm.Code = '87795007' or cqm.Code = '8782006' or cqm.Code = '90199006' or cqm.Code = '90470006' or cqm.Code = '91531008' or cqm.Code = '55810' or cqm.Code = '55812' or cqm.Code = '55815' or cqm.Code = '55840' or cqm.Code = '55842' or cqm.Code = '55845' or cqm.Code = '55866' or cqm.Code = '55873' or cqm.Code = '55875' or cqm.Code = '55876' or cqm.Code = '77427' or cqm.Code = '77776' or cqm.Code = '77777' or cqm.Code = '77778' or cqm.Code = '77787' \
              	) \
              	and \
              	( \
              		(cqm.ReasonCode is null) \
              	) \
              	and (cqm.DateOfVisit >= '"+fromDate+"') and (cqm.DateOfVisit <= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else'"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              insert into @tempTableB_0 \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate, (cqm.Code) \
              from xrxEhr_Cqm cqm \
              inner join \
              ( \
                  select cqm.PatId, max(DateOfVisit) as DateOfVisit \
                  from xrxEhr_Cqm cqm \
                  where \
                  ( \
              		(cqm.PatId = '"+patId+"') \
              		and \
              		(cqm.Flag is null) \
              		and \
              		( \
              			cqm.Code = '10508-0' or cqm.Code = '10886-0' or cqm.Code = '12841-3' or cqm.Code = '15323-9' or cqm.Code = '15324-7' or cqm.Code = '15325-4' or cqm.Code = '19195-7' or cqm.Code = '19201-3' or cqm.Code = '2857-1' or cqm.Code = '33667-7' or cqm.Code = '34611-4' or cqm.Code = '35741-8' \
              		) \
              		and \
              		(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else'"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                  group by PatId \
              ) cqm2 \
              on cqm.PatId = cqm2.PatId and cqm.DateOfVisit = cqm2.DateOfVisit \
              where \
              ( \
              	(cqm.PatId = '"+patId+"') \
              	and \
              	cqm.Code = '10508-0' or cqm.Code = '10886-0' or cqm.Code = '12841-3' or cqm.Code = '15323-9' or cqm.Code = '15324-7' or cqm.Code = '15325-4' or cqm.Code = '19195-7' or cqm.Code = '19201-3' or cqm.Code = '2857-1' or cqm.Code = '33667-7' or cqm.Code = '34611-4' or cqm.Code = '35741-8' \
              ) \
              insert into @tempTableB \
              select b0.PatId, b0.DateOfVisit, b0.StopDate, b0.StartDate \
              from  @tempTableB_0 b0, xrxQuestResultTransaction ort, xrxQuestResultObservationResult ror \
              where \
              ( \
              	(ort.TransactionId = ror.TransactionId) \
              	and \
              	(b0.PatId = ort.PatId) \
              	and \
              	(b0.Code =  ror.LabResultAnalyteNumber) \
              	and \
              	(ISNUMERIC(ror.LabResultValue) = 1) \
              	and \
              	(CAST((RTRIM(LTRIM(ror.LabResultValue))) as NUMERIC) <= 10) \
              ) \
              insert into @tempTableC \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_Cqm cqm \
              where \
              ( \
              	(cqm.PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = '116783008' \
              	) \
              	and \
              	( \
              		(cqm.ReasonCode is null) \
              	) \
              	and \
              	(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else'"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              insert into @tempTableBC \
              select tmpb.PatId, tmpb.DateOfVisit, tmpb.StopDate, tmpb.StartDate \
              from @tempTableB tmpb, @tempTableC tmpc \
              where \
              ( \
              	(tmpb.PatId = tmpc.PatId) \
              	and \
              	( \
              		isNull (tmpb.StartDate, tmpb.DateofVisit) <= isNull (tmpc.StartDate, tmpc.DateofVisit) \
              	) \
              ) \
              insert into @tempTableE_0 \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate, (cqm.Code) \
              from xrxEhr_Cqm cqm \
              inner join \
              ( \
                  select cqm.PatId, max(DateOfVisit) as DateOfVisit \
                  from xrxEhr_Cqm cqm \
                  where \
                  ( \
              		(cqm.PatId = '"+patId+"') \
              		and \
              		(cqm.Flag is null) \
              		and \
              		( \
              			cqm.Code = '35266-6' \
              		) \
              		and \
              		(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else'"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                  ) \
                  group by PatId \
              ) cqm2 \
              on cqm.PatId = cqm2.PatId and cqm.DateOfVisit = cqm2.DateOfVisit \
              where \
              ( \
              	(cqm.PatId = '"+patId+"') \
              	and \
              	cqm.Code = '35266-6' \
              ) \
              insert into @tempTableE \
              select e0.PatId, e0.DateOfVisit, e0.StopDate, e0.StartDate \
              from  @tempTableE_0 e0, xrxQuestResultTransaction ort, xrxQuestResultObservationResult ror \
              where \
              ( \
              	(ort.TransactionId = ror.TransactionId) \
              	and \
              	(e0.PatId = ort.PatId) \
              	and \
              	(e0.Code =  ror.LabResultAnalyteNumber) \
              	and \
              	(ISNUMERIC(ror.LabResultValue) = 1) \
              	and \
              	(CAST((RTRIM(LTRIM(ror.LabResultValue))) as NUMERIC) <= 6) \
              ) \
              insert into @tempTableAE \
              select tmpe.PatId, tmpe.DateOfVisit, tmpe.StopDate, tmpe.StartDate \
              from @tempTableE tmpe, @tempTableA tmpa \
              where \
              ( \
              	(tmpe.PatId = tmpa.PatId) \
              	and \
              	( \
              		isNull (tmpe.StartDate, tmpe.DateofVisit) <= isNull (tmpa.StartDate, tmpa.DateofVisit) \
              	) \
              ) \
              insert into @tempTableC_0 \
              select tmpc.PatId, tmpc.DateOfVisit, tmpc.StopDate, tmpc.StartDate \
              from @tempTableC tmpc \
              inner join \
              ( \
                  select PatId, max(DateOfVisit) as DateOfVisit \
                  from @tempTableC \
              	group by PatId \
              ) tmpc2 \
              on tmpc.PatId = tmpc2.PatId and tmpc.DateOfVisit = tmpc2.DateOfVisit \
              insert into @tempTableAC \
              select tmpc0.PatId, tmpc0.DateOfVisit, tmpc0.StopDate, tmpc0.StartDate \
              from @tempTableC_0 tmpc0, @tempTableA tmpa \
              where \
              ( \
              	(tmpc0.PatId = tmpa.PatId) \
              	and \
              	( \
              		isNull (tmpc0.StartDate, tmpc0.DateofVisit) <= isNull (tmpa.StartDate, tmpa.DateofVisit) \
              	) \
              ) \
              select distinct(cqm.PatId) \
              from xrxEhr_CQM cqm \
              where \
              ( \
              	cqm.patId in \
              	( \
              		select tmp1.PatId from \
              		( \
              			select  min(DateOfVisit) as DateOfVisit, PatId from @tempTableA tmpa  group by PatId \
              		)tmp1 \
              	) \
              	and \
              	( \
              		(cqm.patId in (select PatId from @tempTableBC)) \
              		and \
              		(cqm.patId in (select PatId from @tempTableAE)) \
              		and \
              		( \
              			(cqm.patId in (select PatId from @tempTableAC)) \
              			and \
              			( \
              				cqm.patId in \
              				( \
              					select cqm.PatId from xrxEhr_cqm cqm \
              					inner join \
              					( \
              						select * from xrxEhr_CQM cqm \
              						where \
              						( \
              							(cqm.MasterRecno is not null) \
              							and \
              							( \
              								cqm.Code = '433351000124101' or cqm.Code = '433361000124104' \
              							) \
              						) \
              					)tmpCqm \
              					on cqm.EhrRecno = tmpCqm.MasterRecno \
              					where \
              					(  \
              						(cqm.Code = '116783008') \
              						and \
              						( \
              							(cqm.ReasonCode is null) \
              						) \
              						and \
              						(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else'"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              					) \
              				) \
              			) \
              		) \
              	) \
              )";

  cqmGuideController.cqmCheck(sql1, function(err, record){
      if(record && record.length > 0)
      {
        callback({criteriaName: "Denominator", isCriteriaQualify : true,  message : null});
      }
      else if(err) {
        callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
      }
      else {
        callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "<p align='justify' class='text-danger'> Laboratory Test, Result: Prostate Specific Antigen Test</p> \
                                                                                      <p align='justify' class='text-danger'> AND Laboratory Test, Result: Gleason Score</p> \
                                                                                      <p align='justify' class='text-danger'> AND Procedure, Result: Clinical Staging Procedure and Result (Prostate Cancer Primary Tumor Size T1c or T2a)</p> \
                                                                                      <p align='justify' class='text-danger'> AND FIRST Procedure, Performed: Prostate Cancer Treatment during Measurement Period</p>"});
      }
  });



}
