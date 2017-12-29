var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.patid from xrxEhr_cqm cqm \
              where \
              (PatId = '"+patId+"') \
              and   \
              ( \
              		cqm.patId in  \
              		( \
              			select PatId from xrxEhr_CQM cqm where \
              			( \
              				(cqm.Code = '401191002') \
              				and (isNull (cqm.StartDate, cqm.DateofVisit)>='"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit)<='"+toDate+"')  \
                              and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              			) \
              		)	 \
              ) \
              and \
              ( \
              		cqm.patId in  \
              		( \
              			select PatId from xrxEhr_CQM cqm where \
              			( \
              				(cqm.Code = '134388005') \
              				and (isNull (cqm.StartDate, cqm.DateofVisit)>='"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit)<='"+toDate+"')  \
                              and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              			) \
              		)	 \
              ) \
              and \
              ( \
              		cqm.patId in  \
              		( \
              			select PatId from xrxEhr_CQM cqm where \
              			( \
              				(cqm.Code = '91161007') \
              				and (isNull (cqm.StartDate, cqm.DateofVisit)>='"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit)<='"+toDate+"')  \
                              and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              			) \
              		)	 \
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
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Visual/Sensory/Pulse Exam of Foot."});
            }
        });

}
