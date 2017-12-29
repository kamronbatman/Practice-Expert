var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {
    var sql1 = "declare  @tempTableC table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
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
                select distinct cqm.PatId from xrxEhr_CQM cqm \
                where \
                (cqm.PatId = '"+patId+"') \
                and \
                ( \
                	cqm.PatId in \
                	( \
                		select cqm.PatId \
                		from xrxEhr_CQM cqm \
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
                		and \
                		( \
                			(isNull (cqm.StartDate, cqm.DateofVisit) >= dateadd(day, -120 , '"+toDate+"')) \
                			and \
                			(isNull (cqm.StartDate, cqm.DateofVisit) <  '"+toDate+"') \
                		) \
                	) \
                	or \
                	cqm.PatId in \
                	( \
                		select cqm.PatId from xrxEhr_CQM cqm \
                		inner join @tempTableC tmpc \
                		on tmpc.PatId = cqm.PatId \
                		where \
                		( \
                			(cqm.PatId = '"+patId+"') \
                			and \
                			( \
                				( \
                					cqm.Code = '94179005' or cqm.Code = '94222008' or cqm.Code = '94260004' or cqm.Code = '94271003' or cqm.Code = '94328005' or cqm.Code = '94509004' or cqm.Code = '94538001' or cqm.Code = '94604000' or cqm.Code = '94643001' or cqm.Code = '197.5' or cqm.Code = '197.7' or cqm.Code = 'C78.5' or cqm.Code = 'C78.7' \
                				) \
                				or \
                				( \
                					cqm.Code = '293739003' or cqm.Code = '293776000' \
                				) \
                				or \
                				( \
                					cqm.Code = '292196008' or cqm.Code = '292234002' \
                				) \
                				or \
                				( \
                					cqm.Code = '422894000' or cqm.Code = '423053003' or cqm.Code = '423237006' \
                				) \
                				or \
                				( \
                					cqm.Code = '185923000' or cqm.Code = '399174000' or cqm.Code = '399223003' or cqm.Code = '428024001' or cqm.Code = '444061006' or cqm.Code = '444734003' \
                				) \
                				or \
                				( \
                					cqm.Code = '194000' or  cqm.Code = '220961' \
                				) \
                				or \
                				( \
                					cqm.Code = '202632' or cqm.Code = '202633' or cqm.Code = '224945' or cqm.Code = '285133' or cqm.Code = '4492' \
                				) \
                				or \
                				( \
                					cqm.Code = '225852' or cqm.Code = '6313' or cqm.Code = '804688' or cqm.Code = '877015' or cqm.Code = '979509' \
                				) \
                				or \
                				( \
                					cqm.Code = '32592' or cqm.Code = '337511' \
                				) \
                			) \
                			and \
                			( \
                				((cqm.StopDate >= isNull (tmpc.StartDate, tmpc.DateofVisit)) or (cqm.StopDate is null)) \
                				and \
                				( \
                					(isNull (cqm.StartDate, cqm.DateofVisit) <= isNull (tmpc.StopDate, tmpc.DateofVisit)) \
                					or \
                					( \
                						DATEDIFF(day,isNull (cqm.StartDate, cqm.DateofVisit),  tmpc.DateofVisit) = 0 \
                					) \
                				) \
                				and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                			) \
                		) \
                	) \
                )";



                cqmGuideController.cqmCheck(sql1, function(err, record){
                  if(record && record.length > 0)
                  {
                    callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : true,  message : null});
                  }
                  else if(err)
                  {
                    callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : err});
                  }
                  else
                  {
                    callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : "Diagnosis, Active: Colon Cancer  <= 120 day(s) starts before or during Measurement End Date OR (For other conditions please go through doucument if required)"});
                  }
                });





}
