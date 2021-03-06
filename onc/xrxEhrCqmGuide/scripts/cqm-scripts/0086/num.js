var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

    var sql1 = "declare  @tempTableA table \
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
                insert into @tempTableC \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from  xrxEhr_CQM cqm \
                join xrxEhr_CQM cqm1 on cqm.PatId = cqm1.PatId and cqm1.Code in ( '71484-0', '71485-7') \
                join xrxEhr_CQM cqm2 on cqm.PatId = cqm2.PatId and cqm2.Code in ( '71486-5',  '71487-3') \
                WHERE cqm.Code in ( '71484-0', '71485-7', '71486-5',  '71487-3') \
                and (cqm.PatId = '"+patId+"') \
                and (cqm.Flag is null) \
                and (cqm.ReasonCode is null) \
                select tmpa.PatId \
                from @tempTableA tmpa, @tempTableC tmpc \
                where \
                ( \
                	(tmpa.PatId = tmpc.PatId) \
                	and \
                	( \
                		(isNull (tmpc.StartDate, tmpc.DateofVisit) >= isNull (tmpa.StartDate, tmpa.DateofVisit)) and (isNull (tmpc.StartDate, tmpc.DateofVisit)<=isNull (tmpa.StopDate, tmpa.DateofVisit)) \
                		or \
                		( \
                			DATEDIFF(day, isNull (tmpc.StartDate, tmpc.DateofVisit), tmpa.DateofVisit) = 0 \
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
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Diagnostic Study, Result: Cup to Disc Ratio (result) and Optic Disc Exam for Structural Abnormalities (result) during visit"});
            }
        });



}
