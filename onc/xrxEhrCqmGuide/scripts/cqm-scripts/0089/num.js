var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "declare  @tempTableA table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare @tempTableD table \
              ( \
              	PatId varchar(25), \
              	DateOfVisit smalldatetime, \
              	StopDate smalldatetime, \
              	StartDate smalldatetime \
              ) \
              declare @tempTableE table \
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
                  or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000'  \
                ) \
                and \
                ( \
                    cqm.Category = 'Visit Type' \
                ) \
                and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              insert into @tempTableD \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm  \
              where \
              ( \
                (cqm.PatId = '"+patId+"') \
                and \
              	(cqm.ReasonCode is null) \
              	and \
              	( \
              		cqm.Code = '312903003' or cqm.Code = '312904009' or cqm.Code = '312905005' or cqm.Code = '399876000' or cqm.Code = '59276001' \
              	) \
              	and   \
              	(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              insert into @tempTableE \
              select cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate \
              from  xrxEhr_CQM cqm  \
              where \
              ( \
                (cqm.PatId = '"+patId+"') \
                and \
              	(cqm.ReasonCode is null) \
              	and \
              	( \
              		cqm.Code = '193350004' or cqm.Code = '193387007' or cqm.Code = '232020009' or cqm.Code = '312911008' or cqm.Code = '312912001' or cqm.Code = '312920004' or cqm.Code = '312921000' or cqm.Code = '312922007' or cqm.Code = '314010006' or cqm.Code = '314011005' or cqm.Code = '314014002' or cqm.Code = '314015001' or cqm.Code = '37231002' or cqm.Code = '399864000' or cqm.Code = '420486006' or cqm.Code = '421779007' or cqm.Code = '432789001' \
              		or cqm.Code = '428341000124108' \
              	) \
              	and \
              	(isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ) \
              select tmpa.PatId from @tempTableE tmpe, @tempTableD tmpd, @tempTableA tmpa \
              where \
              (tmpa.PatId = '"+patId+"') \
              and \
              ( \
                isNull (tmpd.StartDate, tmpd.DateofVisit) >= isNull (tmpa.StartDate, tmpa.DateofVisit) \
              ) \
              and \
              ( \
                isNull (tmpe.StartDate, tmpe.DateofVisit) >= isNull (tmpa.StartDate, tmpa.DateofVisit) \
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
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Communication: From Provider to Provider: 1)Level of Severity of Retinopathy Findings and 2)Macular Edema Findings present/absent"});
            }
        });

}
