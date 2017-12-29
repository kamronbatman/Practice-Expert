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
              declare  @tempTableBCD table \
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
              insert into @tempTableD \
              select cqm.EhrRecno, cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from xrxEhr_Cqm cqm \
              where \
              ( \
                (cqm.PatId = '"+patId+"') \
                and \
              	( \
              		cqm.Code =	'116783008' \
              	) \
              	and \
              	( \
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
              		isNull (tmpd.StartDate, tmpd.DateofVisit) <= isNull (tmpc.StopDate, tmpc.DateofVisit) \
              		or \
              		( \
              			DATEDIFF(day,isNull (tmpd.StartDate, tmpd.DateofVisit),  tmpc.DateofVisit) = 0 \
              		) \
              	) \
              	and \
              	( \
              		isNull (tmpd.StartDate, tmpd.DateofVisit) >= isNull (tmpb.StartDate, tmpb.DateofVisit) \
              		or \
              		( \
              			DATEDIFF(day,isNull (tmpd.StartDate, tmpd.DateofVisit),  isNull (tmpb.StartDate, tmpb.DateofVisit)) = 0 \
              		) \
              	) \
              ) \
              select distinct (bcd.PatId) \
              from @tempTableBCD bcd \
              where \
              ( \
              	( \
              		bcd.PatId in \
              		( \
              			select tmpbcd.PatId \
              			from @tempTableBCD tmpbcd \
              			inner join \
              			( \
              				select * from xrxEhr_CQM cqm \
              				where \
              				( \
                        (cqm.PatId = '"+patId+"') \
                      	and \
              					(cqm.MasterRecno is not null) \
                        and \
                        (cqm.Code =	'433581000124101') \
              				) \
                    )tmpCqm \
              			on tmpbcd.EhrRecno = tmpCqm.MasterRecno \
              		) \
              	) \
              	and \
              	( \
              		( \
              			bcd.PatId in \
              			( \
              				select tmpbcd.PatId \
              				from @tempTableBCD tmpbcd \
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
              							cqm.Code =	'433461000124105' or cqm.Code =	'433471000124103' or cqm.Code =	'433481000124100' or cqm.Code =	'433491000124102' or cqm.Code =	'433501000124105' \
              						) \
              					) \
              				)tmpCqm \
              				on tmpbcd.EhrRecno = tmpCqm.MasterRecno \
              			) \
              			and \
              			( \
              				bcd.PatId in \
              				( \
              					select tmpbcd.PatId \
              					from @tempTableBCD tmpbcd \
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
              								cqm.Code =	'433511000124108' or cqm.Code =	'433521000124100' or cqm.Code =	'433531000124102' or cqm.Code =	'433541000124107' or cqm.Code =	'433561000124106' or cqm.Code =	'433571000124104' \
              							) \
              						) \
                        )tmpCqm \
              					on tmpbcd.EhrRecno = tmpCqm.MasterRecno \
              				) \
              			) \
              		) \
              		or \
              		( \
              			bcd.PatId in \
              			( \
              				select tmpbcd.PatId \
              				from @tempTableBCD tmpbcd \
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
              							cqm.Code =	'433501000124105' \
              						) \
              					) \
              				)tmpCqm \
              				on tmpbcd.EhrRecno = tmpCqm.MasterRecno \
              			) \
              			and \
              			bcd.PatId in \
              			( \
                      select tmpbcd.PatId \
              				from @tempTableBCD tmpbcd \
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
              							cqm.Code =	'433551000124109' \
              						) \
              					) \
              				)tmpCqm \
              				on tmpbcd.EhrRecno = tmpCqm.MasterRecno \
              			) \
              		) \
              	) \
              )";


          cqmGuideController.cqmCheck(sql1, function(err, record){

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
                  callback({criteriaName: "Denominator", isCriteriaQualify : false, message : "<p align='justify' class='text-danger'>Clinical Staging Procedure starts after start of Diagnosis, Active: Colon Cancer</p> \
                                                                                              <p align='justify' class='text-danger'>AND Procedure, Result: Clinical Staging Procedure (result: 'Colon Distant Metastasis Status M0')</p> \
                                                                                              <p align='justify' class='text-danger'>AND</p> \
                                                                                              <p align='justify' class='text-danger' style='padding-left: 5px'>Procedure, Result: Clinical Staging Procedure (result: 'Colon Cancer Primary Tumor Size T1 or T2 or T3 or T4a or T4b')</p> \
                                                                                              <p align='justify' class='text-danger' style='padding-left: 5px'>OR Procedure, Result: Clinical Staging Procedure (result: 'Colon Cancer Regional Lymph Node Status N1 or N1a or N1b or N1c or N2a or N2b')</p> \
                                                                                              <p align='justify' class='text-danger' style='padding-left: 5px'>OR Procedure, Result: Clinical Staging Procedure (result: ' 'Colon Cancer Primary Tumor Size T4b') AND Clinical Staging Procedure (result: 'Colon Cancer Regional Lymph Node Status N2')</p> \
                                                                                               "});
              }

          });


}
