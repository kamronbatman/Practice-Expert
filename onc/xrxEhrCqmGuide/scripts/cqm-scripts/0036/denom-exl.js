var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.PatId from xrxEhr_cqm cqm \
              where \
              (cqm.PatId = '"+patId+"') \
              and \
              ( \
	               cqm.Code = 'J44.0' or cqm.Code = 'J44.9' or cqm.Code = '493.20' or cqm.Code = '493.21' or cqm.Code = '493.22' or cqm.Code = '496' or cqm.Code = '135836000' or cqm.Code = '13645005' or cqm.Code = '195951007' or cqm.Code = '196001008' or cqm.Code = '285381006' or cqm.Code = '313296004' or cqm.Code = '313297008' or cqm.Code = '313299006' \
	               or cqm.Code = 'J43.0' or cqm.Code = 'J43.1' or cqm.Code = 'J43.2' or cqm.Code = 'J43.8' or cqm.Code = 'J43.9' or cqm.Code = 'J98.2' or cqm.Code = 'J98.3' or cqm.Code = '492.0' or cqm.Code = '492.8' or cqm.Code = '518.1' or cqm.Code = '518.2' or cqm.Code = '16003001' or cqm.Code = '16846004' or cqm.Code = '195957006' or cqm.Code = '195958001' or cqm.Code = '195959009' or cqm.Code = '195963002' or cqm.Code = '196026004' or cqm.Code = '20606002' or cqm.Code = '21072009' or cqm.Code = '233674008' or cqm.Code = '233675009' or cqm.Code = '233677001' or cqm.Code = '23958009' or cqm.Code = '266355005' or cqm.Code = '266356006' or cqm.Code = '2912004' or cqm.Code = '31898008' or cqm.Code = '33325001' or cqm.Code = '47895001' or cqm.Code = '4981000' or cqm.Code = '57686001' or cqm.Code = '60805002' or cqm.Code = '66110007' or cqm.Code = '66987001' or cqm.Code = '68328006' or cqm.Code = '70756004' or cqm.Code = '77690003' or cqm.Code = '86680006' or cqm.Code = '87433001' \
	               or cqm.Code = 'E84.0' or cqm.Code = 'E84.11' or cqm.Code = 'E84.19' or cqm.Code = 'E84.8' or cqm.Code = 'E84.9' or cqm.Code = '277.00' or cqm.Code = '277.01' or cqm.Code = '277.02' or cqm.Code = '277.03' or cqm.Code = '277.09' or cqm.Code = '190905008' or cqm.Code = '190909002' or cqm.Code = '235978006' or cqm.Code = '81423003' or cqm.Code = '86092005' or cqm.Code = '86555001' \
	               or cqm.Code = 'J96.00' or cqm.Code = 'J96.01' or cqm.Code = 'J96.02' or cqm.Code = 'J96.20' or cqm.Code = 'J96.21' or cqm.Code = 'J96.22' or cqm.Code = '518.81' or cqm.Code = '397767007' or cqm.Code = '65710008' or cqm.Code = '67905004' \
               ) \
               and (cqm.StopDate >= '"+fromDate+"' or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
	            ";

              cqmGuideController.cqmCheck(sql1, function(err, record){
                    if(record && record.length > 0)
                    {
                        callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : true,  message : null});
                    }
                    else if(err) {

                        callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : false,  message : err});
                    }
                    else
                    {
                        callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : false,  message : "<p align='justify' class='text-danger'>Active: Chronic Obstructive Pulmonary Disease</p> \
                                                                                                      <p align='justify' class='text-danger'>or Active: Emphysema</p> \
                                                                                                      <p align='justify' class='text-danger'>or Active: Cystic Fibrosis</p>   \
                                                                                                      <p align='justify' class='text-danger'>or Active: Acute Respiratory Failure</p>  \
                                                                                                     "});
                    }
              });
};
