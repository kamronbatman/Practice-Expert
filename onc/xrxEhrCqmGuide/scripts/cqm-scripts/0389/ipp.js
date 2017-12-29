var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

    var sql1 = "select (pat.PatId) \
                from  xrxPat pat \
                where \
                ( \
                	(pat.PatId = '"+patId+"') \
                	and (pat.Sex = 'M') \
                )";


    var sql2 = "select (cqm.PatId) \
                from xrxEhr_CQM cqm \
                where  \
                (  \
                	(cqm.PatId = '"+patId+"') \
                  and \
                	( \
                		cqm.Code = '254900004' or cqm.Code = '278060005' or cqm.Code = '314969001' or cqm.Code = '369485004' or cqm.Code = '369486003' or cqm.Code = '396198006' or cqm.Code = '399068003' or cqm.Code = '399490008' or cqm.Code = '399590005' or cqm.Code = '427492003' or cqm.Code = '93974005' or cqm.Code = '94503003' or cqm.Code = '185' or cqm.Code = 'C61' \
                	) \
                	and (cqm.StopDate >='"+fromDate+"' or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                )";

  cqmGuideController.cqmCheck(sql1, function(err, record){

      if(record && record.length > 0)
      {
          cqmGuideController.cqmCheck(sql2, function(err, record){

            if(record && record.length > 0)
            {
              callback({criteriaName: "Inital Patient Population", isCriteriaQualify : true,  message : null});
            }
            else if(err)
            {
              callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : err});
            }
            else
            {
              callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : "Diagnosis, Active: Prostate Cancer"});
            }

          });
      }
      else if(err)
      {
          callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false,  message : err});
      }
      else
      {
          callback({criteriaName: "Inital Patient Population", isCriteriaQualify : false, message : null});
      }

  });

}
