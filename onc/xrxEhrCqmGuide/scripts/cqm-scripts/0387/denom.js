var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "declare  @tempTableB table \
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
              declare  @tempTableD table \
              ( \
              	EhrRecno uniqueidentifier, \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare  @tempTableE table \
              (	 \
              	EhrRecno uniqueidentifier, \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare  @tempTableBCD table \
              ( \
              	EhrRecno uniqueidentifier, \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare  @tempTableBCE table \
              ( \
              	EhrRecno uniqueidentifier, \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              insert into @tempTableB \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate, (cqm.Code) \
              from xrxEhr_Cqm cqm \
              inner join  \
              ( \
              	select cqm.PatId, min(isNull (cqm.StartDate, cqm.DateofVisit)) as StartDate \
                from xrxEhr_Cqm cqm \
                where \
              	(cqm.PatId = '"+patId+"') \
              	and \
                ( \
              		cqm.Code = '109886000' or cqm.Code = '188147009' or cqm.Code = '188151006' or cqm.Code = '188152004' or cqm.Code = '188153009' or cqm.Code = '188154003' or cqm.Code = '188155002' or cqm.Code = '188156001' or cqm.Code = '188157005' or cqm.Code = '188159008' or cqm.Code = '254837009' or cqm.Code = '254838004' or cqm.Code = '254839007' or cqm.Code = '254840009' or cqm.Code = '278054005' or cqm.Code = '286892007' or cqm.Code = '286893002' or cqm.Code = '286894008' or cqm.Code = '286895009' or cqm.Code = '286896005' or cqm.Code = '286897001' or cqm.Code = '372064008' or cqm.Code = '372092003' or cqm.Code = '372093008' or cqm.Code = '372094002' or cqm.Code = '372137005' or cqm.Code = '373080008' or cqm.Code = '373081007' or cqm.Code = '373082000' or cqm.Code = '373083005' or cqm.Code = '373088001' or cqm.Code = '373089009' or cqm.Code = '373090000' or cqm.Code = '373091001' or cqm.Code = '403458008' or cqm.Code = '403946000' or cqm.Code = '408643008' or cqm.Code = '417181009' or cqm.Code = '427685000' or cqm.Code = '431396003' or cqm.Code = '93680004' or cqm.Code = '93745008' or cqm.Code = '93776002' or cqm.Code = '93796005' or cqm.Code = '93874009' or cqm.Code = '93876006' or cqm.Code = '93924008' or cqm.Code = '94115006' or cqm.Code = '174.0' or cqm.Code = '174.1' or cqm.Code = '174.2' or cqm.Code = '174.3' or cqm.Code = '174.4' or cqm.Code = '174.5' or cqm.Code = '174.6' or cqm.Code = '174.8' or cqm.Code = '174.9' or cqm.Code = 'C50.011' or cqm.Code = 'C50.012' or cqm.Code = 'C50.019' or cqm.Code = 'C50.111' or cqm.Code = 'C50.112' or cqm.Code = 'C50.119' or cqm.Code = 'C50.211' or cqm.Code = 'C50.212' or cqm.Code = 'C50.219' or cqm.Code = 'C50.311' or cqm.Code = 'C50.312' or cqm.Code = 'C50.319' or cqm.Code = 'C50.411' or cqm.Code = 'C50.412' or cqm.Code = 'C50.419' or cqm.Code = 'C50.511' or cqm.Code = 'C50.512' or cqm.Code = 'C50.519' or cqm.Code = 'C50.611' or cqm.Code = 'C50.612' or cqm.Code = 'C50.619' or cqm.Code = 'C50.811' or cqm.Code = 'C50.812' or cqm.Code = 'C50.819' or cqm.Code = 'C50.911' or cqm.Code = 'C50.912' or cqm.Code = 'C50.919' \
              	) \
              	and \
              	(	 \
              		(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              	) \
              	group by PatId \
              )cqm2 \
              on cqm.PatId = cqm2.PatId and isNull (cqm.StartDate, cqm.DateofVisit) = cqm2.StartDate \
              where \
              ( \
              	(cqm.PatId = '"+patId+"') \
              	and \
              	(	 \
              		cqm.Code = '109886000' or cqm.Code = '188147009' or cqm.Code = '188151006' or cqm.Code = '188152004' or cqm.Code = '188153009' or cqm.Code = '188154003' or cqm.Code = '188155002' or cqm.Code = '188156001' or cqm.Code = '188157005' or cqm.Code = '188159008' or cqm.Code = '254837009' or cqm.Code = '254838004' or cqm.Code = '254839007' or cqm.Code = '254840009' or cqm.Code = '278054005' or cqm.Code = '286892007' or cqm.Code = '286893002' or cqm.Code = '286894008' or cqm.Code = '286895009' or cqm.Code = '286896005' or cqm.Code = '286897001' or cqm.Code = '372064008' or cqm.Code = '372092003' or cqm.Code = '372093008' or cqm.Code = '372094002' or cqm.Code = '372137005' or cqm.Code = '373080008' or cqm.Code = '373081007' or cqm.Code = '373082000' or cqm.Code = '373083005' or cqm.Code = '373088001' or cqm.Code = '373089009' or cqm.Code = '373090000' or cqm.Code = '373091001' or cqm.Code = '403458008' or cqm.Code = '403946000' or cqm.Code = '408643008' or cqm.Code = '417181009' or cqm.Code = '427685000' or cqm.Code = '431396003' or cqm.Code = '93680004' or cqm.Code = '93745008' or cqm.Code = '93776002' or cqm.Code = '93796005' or cqm.Code = '93874009' or cqm.Code = '93876006' or cqm.Code = '93924008' or cqm.Code = '94115006' or cqm.Code = '174.0' or cqm.Code = '174.1' or cqm.Code = '174.2' or cqm.Code = '174.3' or cqm.Code = '174.4' or cqm.Code = '174.5' or cqm.Code = '174.6' or cqm.Code = '174.8' or cqm.Code = '174.9' or cqm.Code = 'C50.011' or cqm.Code = 'C50.012' or cqm.Code = 'C50.019' or cqm.Code = 'C50.111' or cqm.Code = 'C50.112' or cqm.Code = 'C50.119' or cqm.Code = 'C50.211' or cqm.Code = 'C50.212' or cqm.Code = 'C50.219' or cqm.Code = 'C50.311' or cqm.Code = 'C50.312' or cqm.Code = 'C50.319' or cqm.Code = 'C50.411' or cqm.Code = 'C50.412' or cqm.Code = 'C50.419' or cqm.Code = 'C50.511' or cqm.Code = 'C50.512' or cqm.Code = 'C50.519' or cqm.Code = 'C50.611' or cqm.Code = 'C50.612' or cqm.Code = 'C50.619' or cqm.Code = 'C50.811' or cqm.Code = 'C50.812' or cqm.Code = 'C50.819' or cqm.Code = 'C50.911' or cqm.Code = 'C50.912' or cqm.Code = 'C50.919'	\
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
              	and   \
              	( \
              		(cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              	) \
              ) \
              insert into @tempTableD \
              select cqm.EhrRecno, cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from xrxEhr_Cqm cqm \
              where \
              ( \
              	(cqm.PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = '416053008' or cqm.Code = '416561008' or cqm.Code = '417181009' or cqm.Code = '417742002' \
              	) \
              	and   \
              	(	 \
              		(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              	) \
              ) \
              insert into @tempTableE \
              select cqm.EhrRecno, cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from xrxEhr_Cqm cqm \
              where \
              ( \
              	(cqm.PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = '116783008' \
              	) \
              	and \
              	(	 \
              		(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              	) \
              ) \
              insert into @tempTableBCD \
              select tmpd.EhrRecno, tmpd.PatId, tmpd.DateOfVisit, tmpd.StopDate, tmpd.StartDate \
              from @tempTableD tmpd, @tempTableC tmpc, @tempTableB tmpb \
              where \
              ( \
              	(tmpd.PatId = tmpc.PatId) \
               	and \
              	(tmpd.PatId = tmpb.PatId) \
              	and \
              	( \
              		(isNull (tmpd.StartDate, tmpd.DateofVisit) <= isNull (tmpc.StopDate, tmpc.DateofVisit)) \
              		or \
              		DATEDIFF(day,isNull (tmpd.StartDate, tmpd.DateofVisit), tmpc.DateofVisit) = 0 \
              	) \
              	and \
              	( \
              		isNull (tmpd.StartDate, tmpd.DateofVisit) >= isNull (tmpb.StartDate, tmpb.DateofVisit) \
              		or \
              		DATEDIFF(day,isNull (tmpd.StartDate, tmpd.DateofVisit), isNull (tmpb.StartDate, tmpb.DateofVisit)) = 0 \
              	) \
              ) \
              insert into @tempTableBCE \
              select tmpe.EhrRecno, tmpe.PatId, tmpe.DateOfVisit, tmpe.StopDate, tmpe.StartDate \
              from @tempTableE tmpe, @tempTableC tmpc, @tempTableB tmpb \
              where \
              ( \
              	(tmpe.PatId = tmpc.PatId) \
              	and \
              	(tmpe.PatId = tmpb.PatId) \
              	and \
              	( \
              		isNull (tmpe.StartDate, tmpe.DateofVisit) <= isNull (tmpc.StopDate, tmpc.DateofVisit) \
              		or \
              		DATEDIFF(day,isNull (tmpe.StartDate, tmpe.DateofVisit), tmpc.DateofVisit) = 0 \
              	) \
              	and \
              	( \
              		isNull (tmpe.StartDate, tmpe.DateofVisit) >= isNull (tmpb.StartDate, tmpb.DateofVisit) \
              		or \
              		( \
              			DATEDIFF(day,isNull (tmpe.StartDate, tmpe.DateofVisit),  isNull (tmpb.StartDate, tmpb.DateofVisit)) = 0 \
              		) \
              	) \
              ) \
              select distinct (bcd.PatId) \
              from  @tempTableBCD bcd \
              where  \
              ( \
              	( \
              		bcd.PatId in \
              		( \
              			select tmpbcd.PatId \
              			from @tempTableBCD tmpbcd \
              		) \
              	) \
              	and \
              	( \
              		bcd.PatId in \
              		( \
              			select tmpbce.PatId \
              			from @tempTableBCE tmpbce \
              			inner join  \
              			( \
              				select * from xrxEhr_CQM cqm \
              				where \
              				( \
              					(cqm.PatId = '"+patId+"') \
              					and \
              					(cqm.MasterRecno is not null) \
              					and  \
              					(cqm.Code =	'433411000124107') \
              				) \
              			)tmpCqm \
              			on tmpbce.EhrRecno = tmpCqm.MasterRecno \
              		) \
              	) \
              	and \
              	( \
              		( \
              			bcd.PatId in \
              			( \
              				select tmpbce.PatId \
              				from @tempTableBCE tmpbce \
              				inner join \
              				( \
              					select * from xrxEhr_CQM cqm \
              					where \
              					( \
              						(cqm.PatId = '"+patId+"') \
              						and \
              						(cqm.MasterRecno is not null) \
              						and \
              						(cqm.Code =	'433431000124101') \
              					) \
                      )tmpCqm \
              				on tmpbce.EhrRecno = tmpCqm.MasterRecno \
              			) \
              		) \
              		or \
              		( \
              			( \
              				bcd.PatId in \
              				( \
              					select tmpbce.PatId \
              					from @tempTableBCE tmpbce \
              					inner join \
              					( \
              						select * from xrxEhr_CQM cqm \
              						where \
              						( \
              							(cqm.PatId = '"+patId+"') \
              							and \
              							(cqm.MasterRecno is not null) \
              							and \
              							( \
              								cqm.Code =	'433371000124106' or cqm.Code =	'369895002' or cqm.Code = '369897005' or cqm.Code = '369898000' or cqm.Code = '433391000124107' or cqm.Code = '433381000124109' \
              							) \
              						) \
              					)tmpCqm \
              					on tmpbce.EhrRecno = tmpCqm.MasterRecno \
              				) \
              			) \
              			and \
              			( \
              				bcd.PatId in \
              				( \
              					select tmpbce.PatId \
              					from @tempTableBCE tmpbce \
              					inner join \
              					( \
              						select * from xrxEhr_CQM cqm \
              						where \
              						( \
              							(cqm.PatId = '"+patId+"') \
              							and \
              							(cqm.MasterRecno is not null) \
              							and \
              							( \
              								cqm.Code =	'433451000124108' or cqm.Code =	'373159004' or cqm.Code =	'373160009' or cqm.Code =	'373161008' or cqm.Code =	'373157002' or cqm.Code =	'433421000124104' \
              							) \
              						) \
              					)tmpCqm \
              					on tmpbce.EhrRecno = tmpCqm.MasterRecno \
              				) \
              			) \
              		) \
              		or \
              		( \
              			( \
              				bcd.PatId in \
              				( \
              					select tmpbce.PatId \
              					from @tempTableBCE tmpbce \
              					inner join \
              					( \
              						select * from xrxEhr_CQM cqm \
              						where \
              						( \
              							(cqm.PatId = '"+patId+"') \
              							and \
              							(cqm.MasterRecno is not null) \
              							and \
              							( \
              								cqm.Code =	'369900003' or cqm.Code =	'369901004' or cqm.Code =	'433401000124109' \
              							) \
              						) \
                        )tmpCqm \
              					on tmpbce.EhrRecno = tmpCqm.MasterRecno \
              				) \
              			) \
              			and \
              			( \
              				bcd.PatId in \
              				( \
              					select tmpbce.PatId \
              					from @tempTableBCE tmpbce \
              					inner join \
              					( \
              						select * from xrxEhr_CQM cqm \
              						where \
              						( \
              							(cqm.PatId = '"+patId+"') \
              							and \
              							(cqm.MasterRecno is not null) \
              							and \
              							( \
              								cqm.Code =	'433441000124106' or cqm.Code =	'433451000124108' or cqm.Code =	'433421000124104' \
              							) \
              						) \
              					)tmpCqm \
              					on tmpbce.EhrRecno = tmpCqm.MasterRecno \
              				) \
              			) \
              		) \
              		or \
              		( \
              			( \
              				bcd.PatId in \
              				( \
              					select tmpbce.PatId \
              					from @tempTableBCE tmpbce \
              					inner join \
              					( \
              						select * from xrxEhr_CQM cqm \
              						where \
              						( \
              							(cqm.PatId = '"+patId+"') \
              							and \
              							(cqm.MasterRecno is not null) \
              							and \
              							( \
              								cqm.Code =	'433391000124107' \
              							) \
              						) \
              					)tmpCqm \
              					on tmpbce.EhrRecno = tmpCqm.MasterRecno \
              				) \
              			) \
              			and \
              			( \
              				bcd.PatId in \
              				( \
              					select tmpbce.PatId \
              					from @tempTableBCE tmpbce \
              					inner join \
              					( \
              						select * from xrxEhr_CQM cqm \
              						where \
              						( \
              							(cqm.PatId = '"+patId+"') \
              							and \
              							(cqm.MasterRecno is not null) \
              							and \
              							( \
              								cqm.Code =	'433441000124106' \
              							) \
              						) \
              					)tmpCqm \
              					on tmpbce.EhrRecno = tmpCqm.MasterRecno \
              				) \
              			) \
              		) \
              	) \
              )";


      cqmGuideController.cqmCheck(sql1, function(err, record){

          if(record && record.length > 0)
          {
            console.log("A");
            callback({criteriaName: "Denominator", isCriteriaQualify : true,  message : null});

          }
          else if(err)
          {
              callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
          }
          else
          {
              callback({criteriaName: "Denominator", isCriteriaQualify : false, message : "<p align='justify' class='text-danger'>Active: Breast Cancer ER or PR Positive</p> \
                                                                                            <p align='justify' class='text-danger'></p> \
                                                                                            <p align='justify' class='text-danger'>AND Procedure, Result: Clinical Staging Procedure (result: 'Breast Distant Metastasis Status M0') start afer start of  Diagnosis, Active: Breast Cancer</p> \
                                                                                            <p align='justify' class='text-danger'>AND Procedure, Result: Clinical Staging Procedure (result: 'Breast Cancer Regional Lymph Node Status N3')</p> \
                                                                                            <p align='justify' class='text-danger' style='padding-left: 5px'>OR (for other conditions please go through  documentation if required)</p> \
                                                                                          "});
          }

      });


}
