var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 =  "select cqm.PatId from xrxEhr_cqm cqm \
              where \
                (cqm.PatId = '"+patId+"') \
                and \
                ( \
                  cqm.Code = '1116000' or cqm.Code = '111891008' or cqm.Code = '13265006' or cqm.Code = '186623005' or cqm.Code = '186624004' or cqm.Code = '186626002' or cqm.Code = '186639003' or cqm.Code = '235864009' or cqm.Code = '235869004' or cqm.Code = '235871004' or cqm.Code = '26206000' or cqm.Code = '29062009' or cqm.Code = '38662009' or cqm.Code = '424099008' or cqm.Code = '424340000' or cqm.Code = '424460009' or cqm.Code = '442134007' or cqm.Code = '442374005' or cqm.Code = '446698005' or cqm.Code = '50167007' or cqm.Code = '53425008' or cqm.Code = '60498001' or cqm.Code = '61977001' or cqm.Code = '66071002' or cqm.Code = '76795007' or cqm.Code = '070.20' or cqm.Code = '070.21' or cqm.Code = '070.22' or cqm.Code = '070.23' or cqm.Code = '070.30' or cqm.Code = '070.31' or cqm.Code = '070.32' or cqm.Code = '070.33' or cqm.Code = 'V02.61' or cqm.Code = 'B16.0' or cqm.Code = 'B16.1' or cqm.Code = 'B16.2' or cqm.Code = 'B16.9' or cqm.Code = 'B18.0' or cqm.Code = 'B18.1' or cqm.Code = 'B19.10' or cqm.Code = 'B19.11' or cqm.Code = 'Z22.51' \
  	            ) \
                and \
                (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
	            ";
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
      callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : "Diagnosis Hepatitis B, Active or Inactive  within 365 day(s) before start of  Delivery Procedure"});
    }
  });


};
