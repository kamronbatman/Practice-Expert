var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "declare  @tempTableB table \
              ( \
              PatId varchar(25), \
              DateOfVisit smalldatetime, \
              StopDate smalldatetime, \
              StartDate smalldatetime \
              ) \
              declare @InitialPopOrDenom table \
              ( \
              PatId varchar(25), \
              DateOfVisit smalldatetime, \
              StopDate smalldatetime, \
              StartDate smalldatetime \
             ) \
              insert into @InitialPopOrDenom \
              select (cqm.PatId), cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from xrxEhr_CQM cqm \
              where \
              ( \
              (PatId = '"+patId+"') \
              and \
              (cqm.ReasonCode is null) \
               	and \
               	( \
              	cqm.Code = '10178000' or cqm.Code = '110473004' or cqm.Code = '112963003' or cqm.Code = '112964009' or cqm.Code = '12163000' or cqm.Code = '231744001' or cqm.Code = '308694002' or cqm.Code = '308695001' or cqm.Code = '313999004' or cqm.Code = '31705006' or cqm.Code = '335636001' or cqm.Code = '336651000' or cqm.Code = '35717002' or cqm.Code = '361191005' or cqm.Code = '385468004' or cqm.Code = '39243005' or cqm.Code = '397544007' or cqm.Code = '404628003' or cqm.Code = '415089008' or cqm.Code = '417493007' or cqm.Code = '418430006' or cqm.Code = '419767009' or cqm.Code = '420260004' or cqm.Code = '420526005' or cqm.Code = '424945000' or cqm.Code = '446548003' or cqm.Code = '46309001' or cqm.Code = '46426006' or cqm.Code = '46562009' or cqm.Code = '50538003' or cqm.Code = '5130002' or cqm.Code = '51839008' or cqm.Code = '54885007' or cqm.Code = '65812008' or cqm.Code = '67760003' or cqm.Code = '69360005' or cqm.Code = '74490003' or cqm.Code = '75814005' or cqm.Code = '79611007' or cqm.Code = '82155009' or cqm.Code = '84149000' or cqm.Code = '85622008' or cqm.Code = '88282000' or cqm.Code = '89153001' or cqm.Code = '9137006' or cqm.Code = '66840' or cqm.Code = '66850' or cqm.Code = '66852' or cqm.Code = '66920' or cqm.Code = '66930' or cqm.Code = '66940' or cqm.Code = '66982' or cqm.Code = '66983' or cqm.Code = '66984' \
              ) \
              and \
              ( \
              	(cqm.DateOfVisit >= '"+fromDate+"') and (cqm.DateOfVisit <= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              and \
              ( \
              	(isNull (cqm.StartDate, cqm.DateofVisit) < dateadd(day, -92,  '"+toDate+"')) \
              ) \
            ) \
              insert into @tempTableB \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm \
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
              		cqm.Code = '422497000' or cqm.Code = '423059004' or  cqm.Code = '423862000' or cqm.Code = '424703005' \
              	) \
              ) \
            )tmpCqm \
              on cqm.EhrRecno = tmpCqm.MasterRecno \
              where \
              ( \
              (cqm.Code = '419775003') \
              and \
              (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
            ) \
              and (cqm.PatId = '"+patId+"') \
              select (pop.PatId) \
              from @InitialPopOrDenom pop, @tempTableB tmpb \
              where \
              ( \
              (pop.PatId = tmpb.PatId) \
              and \
              (isNull (tmpb.StartDate, tmpb.DateofVisit) >   isNull (pop.StartDate, pop.DateofVisit)) \
              and \
              (isNull (tmpb.StartDate, tmpb.DateofVisit) <= dateadd(day, 90,  isNull (pop.StartDate, pop.DateofVisit))) \
            ) \
            ";
    cqmGuideController.cqmCheck(sql1, function(err, record){
      if(record && record.length > 0)
      {
        callback({criteriaName: "Numerator", isCriteriaQualify : true,  message : null});
      }
      else if(err) {
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : err});
      }
      else {
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "<p align='justify' class='text-danger'>Physical Exam, Finding: Best Corrected Visual Acuity (result: 'Visual Acuity 20/40 or Better')</p> <p align='justify' class='text-danger'>Within 90 day(s) after Cataract Surgery</p>"});
      }
  });
}
