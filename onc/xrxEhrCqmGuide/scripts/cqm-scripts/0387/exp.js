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
              ( \
              	cqm.PatId in \
              	( \
              		select cqm.PatId \
              		from xrxEhr_CQM cqm \
              		where \
              		(cqm.PatId = '"+patId+"') \
              		and \
              		( \
              			cqm.Code = '109886000' or cqm.Code = '188147009' or cqm.Code = '188151006' or cqm.Code = '188152004' or cqm.Code = '188153009' or cqm.Code = '188154003' or cqm.Code = '188155002' or cqm.Code = '188156001' or cqm.Code = '188157005' or cqm.Code = '188159008' or cqm.Code = '254837009' or cqm.Code = '254838004' or cqm.Code = '254839007' or cqm.Code = '254840009' or cqm.Code = '278054005' or cqm.Code = '286892007' or cqm.Code = '286893002' or cqm.Code = '286894008' or cqm.Code = '286895009' or cqm.Code = '286896005' or cqm.Code = '286897001' or cqm.Code = '372064008' or cqm.Code = '372092003' or cqm.Code = '372093008' or cqm.Code = '372094002' or cqm.Code = '372137005' or cqm.Code = '373080008' or cqm.Code = '373081007' or cqm.Code = '373082000' or cqm.Code = '373083005' or cqm.Code = '373088001' or cqm.Code = '373089009' or cqm.Code = '373090000' or cqm.Code = '373091001' or cqm.Code = '403458008' or cqm.Code = '403946000' or cqm.Code = '408643008' or cqm.Code = '417181009' or cqm.Code = '427685000' or cqm.Code = '431396003' or cqm.Code = '93680004' or cqm.Code = '93745008' or cqm.Code = '93776002' or cqm.Code = '93796005' or cqm.Code = '93874009' or cqm.Code = '93876006' or cqm.Code = '93924008' or cqm.Code = '94115006' or cqm.Code = '174.0' or cqm.Code = '174.1' or cqm.Code = '174.2' or cqm.Code = '174.3' or cqm.Code = '174.4' or cqm.Code = '174.5' or cqm.Code = '174.6' or cqm.Code = '174.8' or cqm.Code = '174.9' or cqm.Code = 'C50.011' or cqm.Code = 'C50.012' or cqm.Code = 'C50.019' or cqm.Code = 'C50.111' or cqm.Code = 'C50.112' or cqm.Code = 'C50.119' or cqm.Code = 'C50.211' or cqm.Code = 'C50.212' or cqm.Code = 'C50.219' or cqm.Code = 'C50.311' or cqm.Code = 'C50.312' or cqm.Code = 'C50.319' or cqm.Code = 'C50.411' or cqm.Code = 'C50.412' or cqm.Code = 'C50.419' or cqm.Code = 'C50.511' or cqm.Code = 'C50.512' or cqm.Code = 'C50.519' or cqm.Code = 'C50.611' or cqm.Code = 'C50.612' or cqm.Code = 'C50.619' or cqm.Code = 'C50.811' or cqm.Code = 'C50.812' or cqm.Code = 'C50.819' or cqm.Code = 'C50.911' or cqm.Code = 'C50.912' or cqm.Code = 'C50.919' \
              		) \
              		and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              		and \
              		( \
              			(isNull (cqm.StartDate, cqm.DateofVisit) >= dateadd(day, -120 , '"+toDate+"')) \
              			and \
              			(isNull (cqm.StartDate, cqm.DateofVisit) < '"+toDate+"') \
              		) \
              	) \
              	or \
              	cqm.PatId in \
              	( \
              		select cqm.PatId \
              		from xrxEhr_CQM cqm \
              		where \
              		(cqm.PatId = '"+patId+"') \
              		and \
              		( \
              			cqm.Code = '10226009' or cqm.Code = '108290001' or cqm.Code = '113115007' or cqm.Code = '118641002' or cqm.Code = '15543008' or cqm.Code = '1699009' or cqm.Code = '17876001' or cqm.Code = '228703003' or cqm.Code = '228704009' or cqm.Code = '228705005' or cqm.Code = '228708007' or cqm.Code = '228712001' or cqm.Code = '228713006' or cqm.Code = '228716003' or cqm.Code = '228721000' or cqm.Code = '228722007' or cqm.Code = '228723002' or cqm.Code = '228724008' or cqm.Code = '228725009' or cqm.Code = '228726005' or cqm.Code = '228727001' or cqm.Code = '228728006' or cqm.Code = '228729003' or cqm.Code = '228730008' or cqm.Code = '24689001' or cqm.Code = '26802008' or cqm.Code = '31344000' or cqm.Code = '32947004' or cqm.Code = '35437002' or cqm.Code = '38183002' or cqm.Code = '385798007' or cqm.Code = '394935005' or cqm.Code = '49097004' or cqm.Code = '4914002' or cqm.Code = '49963009' or cqm.Code = '50917001' or cqm.Code = '52338008' or cqm.Code = '53438000' or cqm.Code = '56636003' or cqm.Code = '57966002' or cqm.Code = '59690005' or cqm.Code = '61109003' or cqm.Code = '65263004' or cqm.Code = '69497001' or cqm.Code = '80893007' or cqm.Code = '84336003' or cqm.Code = '84755001' or cqm.Code = '84778007' or cqm.Code = '87390000' or cqm.Code = '9728002' or cqm.Code = '9990009' or cqm.Code = '77427' or cqm.Code = '77431' or cqm.Code = '77432' or cqm.Code = '77435' or cqm.Code = '77470' \
              		) \
              		and \
              		( \
              			(cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              		) \
              	) \
              	or \
              	cqm.PatId in \
              	( \
              		select cqm.PatId \
              		from xrxEhr_CQM cqm \
              		where \
              		(cqm.PatId = '"+patId+"') \
              		and \
              		( \
              			cqm.Code = '265760000' or cqm.Code = '265761001' or cqm.Code = '265762008' or cqm.Code = '266719004' or cqm.Code = '315601005' or cqm.Code = '367336001' or cqm.Code = '38216008' or cqm.Code = '394894008' or cqm.Code = '394895009' or cqm.Code = '394935005' or cqm.Code = '399042005' or cqm.Code = '4114003' or cqm.Code = '51534007' or cqm.Code = '6872008' or cqm.Code = '69960004' or cqm.Code = '77738002' or cqm.Code = '96401' or cqm.Code = '96402' or cqm.Code = '96405' or cqm.Code = '96406' or cqm.Code = '96409' or cqm.Code = '96411' or cqm.Code = '96413' or cqm.Code = '96415' or cqm.Code = '96416' or cqm.Code = '96417' or cqm.Code = '96420' or cqm.Code = '96422' or cqm.Code = '96423' or cqm.Code = '96425' or cqm.Code = '96440' or cqm.Code = '96450' or cqm.Code = '96521' or cqm.Code = '96522' or cqm.Code = '96523' or cqm.Code = '96542' or cqm.Code = '96549' \
              		) \
              		and \
              		( \
              			(cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              		) \
              	) \
              	or \
              	cqm.PatId in \
              	( \
              		select cqm.PatId from xrxEhr_CQM cqm \
              		inner join @tempTableC tmpc \
              		on tmpc.PatId = cqm.PatId \
              		where \
              		(cqm.PatId = '"+patId+"') \
              		and \
              		( \
              			cqm.Code = '29529008' or cqm.Code = '29827000' or cqm.Code = '441820006' or cqm.Code = '76876009' or cqm.Code = '86477000' or cqm.Code = '58720' or cqm.Code = '58940' or cqm.Code = '58943' or cqm.Code = '58950' or cqm.Code = '58951' or cqm.Code = '58952' or cqm.Code = '58953' or cqm.Code = '58954' or cqm.Code = '58956' \
              		) \
              		and \
              		( \
              			( \
              				(isNull (cqm.StartDate, cqm.DateofVisit) <= isNull (tmpc.StopDate, tmpc.DateofVisit)) \
              				or DATEDIFF(day, isNull (cqm.StartDate, cqm.DateofVisit), tmpc.DateofVisit) = 0 \
              			) \
              			and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
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
              					cqm.Code = '10324' or cqm.Code = '203769' or cqm.Code = '258494' or cqm.Code = '262105' or cqm.Code = '262485' or cqm.Code = '281964' or cqm.Code = '40137' or cqm.Code = '498464' or cqm.Code = '72965' or cqm.Code = '84857' \
              				) \
              				or \
              				( \
              					cqm.Code = '293790002' \
              				) \
              				or \
              				( \
              					cqm.Code = '292248002' or cqm.Code = '312961004' \
              				) \
              				or \
              				( \
              					(cqm.StartDate is not null) \
              					and \
              					( \
              						cqm.Code = '1115257' or cqm.Code = '1115447' or cqm.Code = '1115454' or cqm.Code = '1115457' or cqm.Code = '1115462' or cqm.Code = '1115467' or cqm.Code = '1115469' or cqm.Code = '1115472' or cqm.Code = '1116124' or cqm.Code = '1294624' or cqm.Code = '199821' or cqm.Code = '284986' or cqm.Code = '310592' or cqm.Code = '314008' or cqm.Code = '348161' or cqm.Code = '348163' or cqm.Code = '545835' or cqm.Code = '545844' or cqm.Code = '545848' or cqm.Code = '583425' or cqm.Code = '752884' or cqm.Code = '752889' or cqm.Code = '752894' or cqm.Code = '752899' or cqm.Code = '853483' or cqm.Code = '905053' or cqm.Code = '905062' \
              					) \
              				) \
              				or \
              				( \
              					cqm.Code = '188462001' or cqm.Code = '233940007' or cqm.Code = '255119002' or cqm.Code = '94157000' or cqm.Code = '94176003' or cqm.Code = '94182000' or cqm.Code = '94218003' or cqm.Code = '94219006' or cqm.Code = '94220000' or cqm.Code = '94221001' or cqm.Code = '94222008' or cqm.Code = '94224009' or cqm.Code = '94225005' or cqm.Code = '94228007' or cqm.Code = '94229004' or cqm.Code = '94230009' or cqm.Code = '94231008' or cqm.Code = '94232001' or cqm.Code = '94236003' or cqm.Code = '94240007' or cqm.Code = '94243009' or cqm.Code = '94244003' or cqm.Code = '94245002' or cqm.Code = '94246001' or cqm.Code = '94247005' or cqm.Code = '94248000' or cqm.Code = '94250008' or cqm.Code = '94256002' or cqm.Code = '94259009' or cqm.Code = '94267001' or cqm.Code = '94269003' or cqm.Code = '94274006' or cqm.Code = '94276008' or cqm.Code = '94287000' or cqm.Code = '94297009' or cqm.Code = '94300004' or cqm.Code = '94301000' or cqm.Code = '94302007' or cqm.Code = '94308006' or cqm.Code = '94309003' or cqm.Code = '94322006' or cqm.Code = '94326009' or cqm.Code = '94329002' or cqm.Code = '94337005' or cqm.Code = '94348003' or cqm.Code = '94349006' or cqm.Code = '94352003' or cqm.Code = '94353008' or cqm.Code = '94375005' or cqm.Code = '94376006' or cqm.Code = '94381002' or cqm.Code = '94382009' or cqm.Code = '94383004' or cqm.Code = '94385006' or cqm.Code = '94387003' or cqm.Code = '94389000' or cqm.Code = '94390009' or cqm.Code = '94391008' or cqm.Code = '94403001' or cqm.Code = '94404007' or cqm.Code = '94405008' or cqm.Code = '94411006' or cqm.Code = '94412004' or cqm.Code = '94435001' or cqm.Code = '94439007' or cqm.Code = '94440009' or cqm.Code = '94443006' or cqm.Code = '94447007' or cqm.Code = '94448002' or cqm.Code = '94451009' or cqm.Code = '94457008' or cqm.Code = '94470004' or cqm.Code = '94471000' or cqm.Code = '94476005' or cqm.Code = '94478006' or cqm.Code = '94486006' or cqm.Code = '94487002' or cqm.Code = '94489004' or cqm.Code = '94490008' or cqm.Code = '94491007' or cqm.Code = '94504009' or cqm.Code = '94508007' or cqm.Code = '94515004' or cqm.Code = '94521000' or cqm.Code = '94522007' or cqm.Code = '94523002' or cqm.Code = '94524008' or cqm.Code = '94527001' or cqm.Code = '94529003' or cqm.Code = '94533005' or cqm.Code = '94535003' or cqm.Code = '94536002' or cqm.Code = '94544002' or cqm.Code = '94598003' or cqm.Code = '94602001' or cqm.Code = '94605004' or cqm.Code = '94619004' or cqm.Code = '94620005' or cqm.Code = '94621009' or cqm.Code = '94622002' or cqm.Code = '94630001' or cqm.Code = '94635006' or cqm.Code = '94644007' or cqm.Code = '94645008' or cqm.Code = '94650002' or cqm.Code = '94653000' or cqm.Code = '94655007' or cqm.Code = '94680007' or cqm.Code = '94683009' or cqm.Code = '197.0' or cqm.Code = '197.7' or cqm.Code = '198.3' or cqm.Code = '198.5' or cqm.Code = 'C78.00' or cqm.Code = 'C78.01' or cqm.Code = 'C78.02' or cqm.Code = 'C78.1' or cqm.Code = 'C78.2' or cqm.Code = 'C78.7' or cqm.Code = 'C79.31' or cqm.Code = 'C79.32' or cqm.Code = 'C79.51' or cqm.Code = 'C79.52' \
              				) \
              				or \
              				( \
              					cqm.Code = '185923000' or cqm.Code = '399174000' or cqm.Code = '399223003' or cqm.Code = '428024001' or cqm.Code = '444061006' or cqm.Code = '444734003' \
              				) \
              			) \
              			and \
              			( \
              				( \
               					((cqm.StopDate >= isNull (tmpc.StartDate, tmpc.DateofVisit)) or (cqm.StopDate is null)) and  (isNull (cqm.StartDate, cqm.DateofVisit) <= isNull (tmpc.StopDate, tmpc.DateofVisit)) \
              					or \
              					( \
              						DATEDIFF(day, isNull (cqm.StartDate, cqm.DateofVisit), tmpc.DateofVisit) = 0 \
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
      callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : "<p align='justify' class='text-danger'>Diagnosis, Active: Breast Cancer  <= 120 day(s) starts before or during Measurement End Date</p> \
                                                                                              <p align='justify' class='text-danger'>OR Procedure, Performed: Chemotherapy</p> \
                                                                                              <p align='justify' class='text-danger'>OR Procedure, Performed: Bilateral Oophorectomy</p> \
                                                                                              <p align='justify' class='text-danger'>etc. Please go through doucmentation for other conditions if required</p> \
                                                                                              "});
    }
  });

}
