var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

    var sql1 = "declare  @tempTable table \
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
                declare  @tempTableTF table \
                ( \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                declare @Nume table \
                ( \
                	PatId varchar(25) \
                ) \
                insert into @tempTableF \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from  xrxEhr_Cqm cqm \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	( \
                		cqm.Code = '25031-6' or cqm.Code = '25032-4' or cqm.Code = '39627-5' or cqm.Code = '39812-3' or cqm.Code = '39813-1' or cqm.Code = '39814-9' or cqm.Code = '39815-6' or cqm.Code = '39816-4' or cqm.Code = '39817-2' or cqm.Code = '39818-0' or cqm.Code = '39819-8' or cqm.Code = '39820-6' or cqm.Code = '39858-6' or cqm.Code = '39879-2' or cqm.Code = '39880-0' or cqm.Code = '39881-8' or cqm.Code = '39882-6' or cqm.Code = '39883-4' or cqm.Code = '39884-2' or cqm.Code = '39901-4' or cqm.Code = '39902-2' or cqm.Code = '39903-0' or cqm.Code = '39904-8' or cqm.Code = '39905-5' or cqm.Code = '41772-5' or cqm.Code = '41836-8' or cqm.Code = '42700-5' or cqm.Code = '44142-8' \
                	) \
                	and \
                	(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else'"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                insert into @tempTable \
                select (cqm.PatId), cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from xrxEhr_CQM cqm \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	( \
                		cqm.Code = '254900004' or cqm.Code = '278060005' or cqm.Code = '314969001' or cqm.Code = '369485004' or cqm.Code = '369486003' or cqm.Code = '396198006' or cqm.Code = '399068003' or cqm.Code = '399490008' or cqm.Code = '399590005' or cqm.Code = '427492003' or cqm.Code = '93974005' or cqm.Code = '94503003' or cqm.Code = '185' or cqm.Code = 'C61' \
                	) \
                	and (cqm.StopDate >='"+fromDate+"' or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                insert into @tempTableTF \
                select tmpf.PatId, tmpf.DateOfVisit, tmpf.StopDate, tmpf.StartDate \
                from  @tempTable tmp, @tempTableF tmpf \
                where \
                ( \
                	(tmpf.PatId = tmp.PatId) \
                	and not \
                	( \
                		(isNull (tmp.StartDate, tmp.DateofVisit) < isNull (tmpf.StartDate, tmpf.DateofVisit)) \
                	) \
                ) \
                insert into @Nume \
                select distinct tmptf.PatId from  @tempTableTF tmptf \
                insert into @Nume \
                select distinct tmp.PatId from  @tempTable tmp \
                except \
                select PatId from @tempTableF \
                select num.PatId from @Nume num \
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
            callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "AND NOT: Diagnostic Study, Performed: Bone Scan starts after start of  Diagnosis, Active: Prostate Cancer"});
          }
      });
}
