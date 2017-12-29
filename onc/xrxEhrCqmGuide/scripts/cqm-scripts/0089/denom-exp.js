var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

    var sql1 = "declare  @tempTableA table \
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
                )  \
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
                insert into @tempTableF \
                select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
                from  xrxEhr_CQM cqm  \
                inner join  \
                ( \
                	select * from xrxEhr_CQM cqm \
                	where \
                	( \
                    (cqm.PatId = '"+patId+"') \
                    and \
                		(cqm.MasterRecno is not null) \
                		and  \
                		(	 \
                      cqm.Code = '161590003' or cqm.Code = '183932001' or cqm.Code = '183964008' or cqm.Code = '183966005' or cqm.Code = '216952002' or cqm.Code = '266721009' or cqm.Code = '269191009' or cqm.Code = '274512008' or cqm.Code = '31438003' or cqm.Code = '35688006' or cqm.Code = '371133007' or cqm.Code = '397745006' or cqm.Code = '407563006' or cqm.Code = '410534003' or cqm.Code = '410536001' or cqm.Code = '416098002' or cqm.Code = '416406003' or cqm.Code = '428119001' or cqm.Code = '445528004' or cqm.Code = '59037007' or cqm.Code = '62014003' or cqm.Code = '79899007'  \
                      or cqm.Code = '105480006' or cqm.Code = '160932005' or cqm.Code = '160934006' or cqm.Code = '182890002' or cqm.Code = '182895007' or cqm.Code = '182897004' or cqm.Code = '182900006' or cqm.Code = '182902003' or cqm.Code = '183944003' or cqm.Code = '183945002' or cqm.Code = '184081006' or cqm.Code = '185479006' or cqm.Code = '185481008' or cqm.Code = '224187001' or cqm.Code = '225928004' or cqm.Code = '258147002' or cqm.Code = '266710000' or cqm.Code = '266966009' or cqm.Code = '275694009' or cqm.Code = '275936005' or cqm.Code = '281399006' or cqm.Code = '30164005' or cqm.Code = '310343007' or cqm.Code = '373787003' or cqm.Code = '385648002' or cqm.Code = '406149000' or cqm.Code = '408367005' or cqm.Code = '413310006' or cqm.Code = '413311005' or cqm.Code = '413312003' or cqm.Code = '416432009' or cqm.Code = '423656007' or cqm.Code = '424739004' or cqm.Code = '443390004' or cqm.Code = '5015009' \
                		)	\
                	) \
                )tmpCqm \
                on cqm.EhrRecno = tmpCqm.MasterRecno \
                where \
                ( \
                  (cqm.PatId = '"+patId+"') \
                  and \
                  cqm.Code = '312903003' or cqm.Code = '312904009' or cqm.Code = '312905005' or cqm.Code = '399876000' or cqm.Code = '59276001' \
                  or cqm.Code = '193350004' or cqm.Code = '193387007' or cqm.Code = '232020009' or cqm.Code = '312911008' or cqm.Code = '312912001' or cqm.Code = '312920004' or cqm.Code = '312921000' or cqm.Code = '312922007' or cqm.Code = '314010006' or cqm.Code = '314011005' or cqm.Code = '314014002' or cqm.Code = '314015001' or cqm.Code = '37231002' or cqm.Code = '399864000' or cqm.Code = '420486006' or cqm.Code = '421779007' or cqm.Code = '432789001' \
                  or cqm.Code = '428341000124108' \
                	and   \
                	(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                select tmpa.PatId \
                from @tempTableA tmpa, @tempTableF tmpf \
                where \
                ( \
                  (tmpa.PatId = '"+patId+"') \
                	and \
                	(tmpf.PatId = '"+patId+"') \
                	and \
                	( \
                		isNull (tmpf.StartDate, tmpf.DateofVisit) >= isNull (tmpa.StartDate, tmpa.DateofVisit) \
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
              else{
                callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : "Communication Not Performed (Medical/Patient Reason)"});
              }
            });
}
