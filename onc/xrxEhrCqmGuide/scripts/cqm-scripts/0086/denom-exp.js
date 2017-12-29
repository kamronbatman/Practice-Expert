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
                	StopDate smalldatetime, \
                	StartDate smalldatetime \
                ) \
                insert into @tempTableA \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from  xrxEhr_CQM cqm \
                where \
                ( \
                	(PatId = '"+patId+"') \
                	and \
                	( \
                		cqm.Code = '92002' or cqm.Code = '92004' or cqm.Code = '92012' or cqm.Code = '92014' \
                		or cqm.Code = '99324' or cqm.Code = '99325' or cqm.Code = '99326' or cqm.Code = '99327' or cqm.Code = '99328' or cqm.Code = '99334' or cqm.Code = '99335' or cqm.Code = '99336' or cqm.Code = '99337' \
                		or cqm.Code = '99304' or cqm.Code = '99305' or cqm.Code = '99306' or cqm.Code = '99307' or cqm.Code = '99308' or cqm.Code = '99309' or cqm.Code = '99310' \
                		or cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' \
                		or cqm.Code = '99241' or cqm.Code = '99242' or cqm.Code = '99243' or cqm.Code = '99244' or cqm.Code = '99245' \
                		or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
                	) \
                  and \
                  ( \
                      cqm.Category = 'Visit Type' \
                  ) \
                	and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                insert into @tempTableD \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from  xrxEhr_CQM cqm \
                inner join \
                ( \
                	select * from xrxEhr_CQM cqm \
                	where \
                	( \
                		(cqm.MasterRecno is not null) \
                		and \
                		( \
                			cqm.Code = '161590003' or cqm.Code = '183932001' or cqm.Code = '183964008' or cqm.Code = '183966005' or cqm.Code = '216952002' or cqm.Code = '266721009' or cqm.Code = '269191009' or cqm.Code = '274512008' or cqm.Code = '31438003' or cqm.Code = '35688006' or cqm.Code = '371133007' or cqm.Code = '397745006' or cqm.Code = '407563006' or cqm.Code = '410534003' or cqm.Code = '410536001' or cqm.Code = '416098002' or cqm.Code = '416406003' or cqm.Code = '428119001' or cqm.Code = '445528004' or cqm.Code = '59037007' or cqm.Code = '62014003' or cqm.Code = '79899007' \
                		) \
                	) \
                )tmpCqm \
                on cqm.EhrRecno = tmpCqm.MasterRecno \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	(cqm.Flag is null) \
                	and \
                	( \
                		(cqm.Code = '71484-0' or  cqm.Code = '71485-7') \
                		or \
                		(cqm.Code = '71486-5' or cqm.Code = '71487-3') \
                	) \
                	and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                select tmpa.PatId \
                from @tempTableA tmpa, @tempTableD tmpd \
                where \
                ( \
                	(tmpa.PatId = tmpd.PatId) \
                	and \
                	( \
                		(isNull (tmpd.StartDate, tmpd.DateofVisit) >= isNull (tmpa.StartDate, tmpa.DateofVisit)) and (isNull (tmpd.StartDate, tmpd.DateofVisit)<=isNull (tmpa.StopDate, tmpa.DateofVisit)) \
                		or \
                		( \
                			DATEDIFF(day, isNull (tmpd.StartDate, tmpd.DateofVisit), tmpa.DateofVisit) = 0 \
                		) \
                	) \
                )";

            cqmGuideController.cqmCheck(sql1, function(err, record){
              if(record && record.length > 0)
              {
                callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : true,  message : null});
              }
              else if(err) {
                callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : err});
              }
              else
              {
                callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : "Diagnostic Study, Result not done: Medical Reason for Cup to Disc Ratio or Optic Disc Exam for Structural Abnormalities"});
              }
            });

}
