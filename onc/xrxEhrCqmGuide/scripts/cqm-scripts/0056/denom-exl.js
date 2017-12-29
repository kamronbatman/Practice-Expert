var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxEhr_cqm cqm \
              where \
              (cqm.PatId = '"+patId+"') \
              and \
              ( \
              	cqm.patId in \
              	( \
              		select PatId from xrxEhr_CQM cqm where \
              		( \
              			( \
              				cqm.Code = 'Q72.03' or cqm.Code = 'Q72.23' or cqm.Code = 'Q72.33' or cqm.Code = 'Z97.16' or cqm.Code = '896.2' or cqm.Code = '896.3' or cqm.Code = '897.6' or cqm.Code = '897.7' or cqm.Code = '13093003' or cqm.Code = '210752002' or cqm.Code = '210767003' or cqm.Code = '213378007' or cqm.Code = '36211009' or cqm.Code = '371191006' or cqm.Code = '445498009' or cqm.Code = '73600009' or cqm.Code = '89824004' \
              			) \
              			and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              		) \
              	) \
              	or \
              	( \
              		cqm.patId in \
              		( \
              			select PatId from xrxEhr_CQM cqm where \
              			( \
              				( \
              					cqm.Code = 'S98.012A' or cqm.Code = 'S98.012D' or cqm.Code = 'S98.012S' or cqm.Code = 'S98.022A' or cqm.Code = 'S98.022D' or cqm.Code = 'S98.022S' or cqm.Code = 'S98.912A' or cqm.Code = 'S98.912D' or cqm.Code = 'S98.912S' or cqm.Code = 'S98.922A' or cqm.Code = 'S98.922D' or cqm.Code = 'S98.922S' \
              				) \
              				and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              			) \
              		) \
              		and \
              		cqm.patId in \
              		( \
              			select PatId from xrxEhr_CQM cqm where \
              			( \
              				( \
              					cqm.Code = 'S98.011A' or cqm.Code = 'S98.011D' or cqm.Code = 'S98.011S' or cqm.Code = 'S98.021A' or cqm.Code = 'S98.021D' or cqm.Code = 'S98.021S' or cqm.Code = 'S98.911A' or cqm.Code = 'S98.911D' or cqm.Code = 'S98.911S' or cqm.Code = 'S98.921A' or cqm.Code = 'S98.921D' or cqm.Code = 'S98.921S' \
              				) \
              				and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              			) \
              		) \
              	) \
              	or \
              	cqm.patId in \
              	( \
              		select PatId from xrxEhr_CQM cqm where \
              		( \
              			( \
              				cqm.Code = 'O24.410' or cqm.Code = 'O24.414' or cqm.Code = 'O24.419' or cqm.Code = 'O24.420' or cqm.Code = 'O24.424' or cqm.Code = 'O24.429' or cqm.Code = 'O24.430' or cqm.Code = 'O24.434' or cqm.Code = 'O24.439' or cqm.Code = '11687002' or cqm.Code = '420491007' or cqm.Code = '420738003' or cqm.Code = '420989005' or cqm.Code = '421223006' or cqm.Code = '421389009' or cqm.Code = '421443003' or cqm.Code = '422155003' or cqm.Code = '46894009' or cqm.Code = '71546005' or cqm.Code = '75022004' \
              			) \
              			and (cqm.StopDate >= '"+fromDate+"' or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              		) \
              	) \
              ) \
              ";

  cqmGuideController.cqmCheck(sql1, function(err, record){
        if(record && record.length > 0){
            callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : true,  message : null});
        }
        else if(err) {
            callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : false,  message : err});
        }
        else{
            callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : false,  message : "Bilateral Amputee."});
        }
  });
};
