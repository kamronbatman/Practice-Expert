var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select (cqm.patId) from xrxEhr_cqm cqm \
              where \
              (cqm.PatId = '"+patId+"') \
              and \
              (cqm.ReasonCode is null) \
              and \
              ( \
                cqm.Code = '442333005' or cqm.Code = '86198006' or cqm.Code = '90653' or cqm.Code = '90655' or cqm.Code = '90656' or cqm.Code = '90657' or cqm.Code = '90658' or cqm.Code = '90660' or cqm.Code = '90661' or cqm.Code = '90662' or cqm.Code = '90664' or cqm.Code = '90666' or cqm.Code = '90667' or cqm.Code = '90668' or cqm.Code = '90672' or cqm.Code = '90685' or cqm.Code = '90686' or cqm.Code = '90687' or cqm.Code = '90688' \
                or cqm.Code = '90659' \
                or cqm.Code = '111' or cqm.Code = '135' or cqm.Code = '140' or cqm.Code = '141' or cqm.Code = '144' or cqm.Code = '149' or cqm.Code = '150' \
                or cqm.Code = '185900003' or cqm.Code = '185901004' or cqm.Code = '185902006' or cqm.Code = '416928007' \
              ) \
              and \
              ( \
                (isNull (cqm.StartDate, cqm.DateofVisit) >= dateadd(day, -153, '"+fromDate+"')) and (isNull (cqm.StartDate, cqm.DateofVisit) < dateadd(day, 92, '"+fromDate+"'))  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
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
        callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "<p align='justify' class='text-danger'>Procedure, Performed: Influenza Vaccination</p><p align='justify' class='text-danger'>or Medication, Administered: Influenza Vaccine</p><p align='justify' class='text-danger'>or Communication: From Patient to Provider: Previous Receipt of Influenza Vaccine</p><p align='justify' class='text-danger'>Within 153 days of before start of measurement or Within 89 days after start of measurement.</p>"});
      }
  });

}
