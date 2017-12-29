var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

    var sql1 = "declare  @tempTable table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                declare  @tempTableG table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                insert into @tempTable \
                select (cqm.PatId), cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from xrxEhr_CQM cqm  \
                where \
                (   \
                	(cqm.PatId = '"+patId+"')  \
                	and  \
                	(  \
                		cqm.Code = '254900004' or cqm.Code = '278060005' or cqm.Code = '314969001' or cqm.Code = '369485004' or cqm.Code = '369486003' or cqm.Code = '396198006' or cqm.Code = '399068003' or cqm.Code = '399490008' or cqm.Code = '399590005' or cqm.Code = '427492003' or cqm.Code = '93974005' or cqm.Code = '94503003' or cqm.Code = '185' or cqm.Code = 'C61' \
                	) \
                	and (cqm.StopDate >='"+fromDate+"' or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                insert into @tempTableG \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from  xrxEhr_CQM cqm  \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	( \
                		cqm.Code = '12584003' or cqm.Code = '161977000' or cqm.Code = '203508001' or cqm.Code = '203509009' or cqm.Code = '20793008' or cqm.Code = '267981009' or cqm.Code = '282743009' or cqm.Code = '297217002' or cqm.Code = '298731003' or cqm.Code = '298740004' or cqm.Code = '301773003' or cqm.Code = '3200003' or cqm.Code = '34789001' or cqm.Code = '36729000' or cqm.Code = '426135001' or cqm.Code = '48926009' or cqm.Code = '89638008' or cqm.Code = '338.3' or cqm.Code = '724.1' or cqm.Code = '724.5' or cqm.Code = '724.6' or cqm.Code = '724.79' or cqm.Code = '733.90' or cqm.Code = '786.50' or cqm.Code = '786.59' or cqm.Code = '789.00' or cqm.Code = 'V76.44' or cqm.Code = 'V84.03' or cqm.Code = 'G89.3' or cqm.Code = 'M43.27' or cqm.Code = 'M43.28' or cqm.Code = 'M53.2X7' or cqm.Code = 'M53.2X8' or cqm.Code = 'M53.3' or cqm.Code = 'M53.86' or cqm.Code = 'M53.87' or cqm.Code = 'M53.88' or cqm.Code = 'M54.6' or cqm.Code = 'M54.89' or cqm.Code = 'M54.9' or cqm.Code = 'M85.9' or cqm.Code = 'M89.9' or cqm.Code = 'M94.9' or cqm.Code = 'R07.82' or cqm.Code = 'R07.89' or cqm.Code = 'R07.9' or cqm.Code = 'R10.0' or cqm.Code = 'R10.9' or cqm.Code = 'Z12.5' or cqm.Code = 'Z15.03' \
                		or ((cqm.Code = '236209003' or cqm.Code = '236211007' or cqm.Code = '51597' or cqm.Code = '55860' or cqm.Code = '55862' or cqm.Code = '55865' or cqm.Code = '55875' or cqm.Code = '55876') and (cqm.ReasonCode is null)) \
                		or ((cqm.Code = '25031-6' or cqm.Code = '25032-4' or cqm.Code = '39627-5' or cqm.Code = '39812-3' or cqm.Code = '39813-1' or cqm.Code = '39814-9' or cqm.Code = '39815-6' or cqm.Code = '39816-4' or cqm.Code = '39817-2' or cqm.Code = '39818-0' or cqm.Code = '39819-8' or cqm.Code = '39820-6' or cqm.Code = '39858-6' or cqm.Code = '39879-2' or cqm.Code = '39880-0' or cqm.Code = '39881-8' or cqm.Code = '39882-6' or cqm.Code = '39883-4' or cqm.Code = '39884-2' or cqm.Code = '39901-4' or cqm.Code = '39902-2' or cqm.Code = '39903-0' or cqm.Code = '39904-8' or cqm.Code = '39905-5' or cqm.Code = '41772-5' or cqm.Code = '41836-8' or cqm.Code = '42700-5' or cqm.Code = '44142-8') and (cqm.ReasonCode is not null)) \
                	) \
                	and \
                	(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else'"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                select tmpg.PatId from @tempTableG tmpg, @tempTable tmp \
                where \
                ( \
                	(tmp.PatId = tmpg.PatId) \
                	and \
                	( \
                		(isNull (tmp.StartDate, tmp.DateofVisit) < isNull (tmpg.StartDate, tmpg.DateofVisit)) \
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
        callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : "<p align='justify' class='text-danger'>Diagnosis, Active: Pain Related to Prostate Cancer</p> \
                                                                                                 <p align='justify' class='text-danger'>OR Procedure, Performed: Salvage Therapy</p> \
                                                                                                 <p align='justify' class='text-danger'>OR Diagnostic Study, Performed: Bone Scan (reason: 'Reason Documented')</p> \
                                                                                                 <p align='justify' class='text-danger'>starts after start of Diagnosis, Active: Prostate Cancer</p> \
                                                                                                "});
      }
    });


}
