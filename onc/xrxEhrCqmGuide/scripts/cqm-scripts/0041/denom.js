var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select (cqm.patid) from xrxEhr_cqm cqm \
              where \
              (cqm.PatId = '"+patId+"') \
              and \
              ( \
              	(cqm.ReasonCode is null) \
              ) \
              and \
              ( \
                ( \
                  ( \
                    cqm.Category = 'Visit Type' \
                  ) \
                  and \
                  ( \
                    cqm.Code = 'G0438' or cqm.Code = 'G0439' or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' or cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' or cqm.Code = '99241' or cqm.Code = '99242' or cqm.Code = '99243' or cqm.Code = '99244' or cqm.Code = '99245' or cqm.Code = '99304' or cqm.Code = '99305' or cqm.Code = '99306' or cqm.Code = '99307' or cqm.Code = '99308' or cqm.Code = '99309' or cqm.Code = '99310' or cqm.Code = '99315' or cqm.Code = '99316' or cqm.Code = '99324' or cqm.Code = '99325' or cqm.Code = '99326' or cqm.Code = '99327' or cqm.Code = '99328' or cqm.Code = '99334' or cqm.Code = '99335' or cqm.Code = '99336' or cqm.Code = '99337' or cqm.Code = '99341' or cqm.Code = '99342' or cqm.Code = '99343' or cqm.Code = '99344' or cqm.Code = '99345' or cqm.Code = '99347' or cqm.Code = '99348' or cqm.Code = '99349' or cqm.Code = '99350' or cqm.Code = '99381' or cqm.Code = '99382' or cqm.Code = '99383' or cqm.Code = '99384' or cqm.Code = '99385' or cqm.Code = '99386' or cqm.Code = '99387' or cqm.Code = '99391' or cqm.Code = '99392' or cqm.Code = '99393' or cqm.Code = '99394' or cqm.Code = '99395' or cqm.Code = '99396' or cqm.Code = '99397' or cqm.Code = '99401' or cqm.Code = '99402' or cqm.Code = '99403' or cqm.Code = '99404' or cqm.Code = '99411' or cqm.Code = '99412' or cqm.Code = '99420' or cqm.Code = '99429' \
                  ) \
                ) \
                or \
                ( \
                  cqm.Code = '302497006' or cqm.Code = '90951' or cqm.Code = '90952' or cqm.Code = '90953' or cqm.Code = '90954' or cqm.Code = '90955' or cqm.Code = '90956' or cqm.Code = '90957' or cqm.Code = '90958' or cqm.Code = '90959' or cqm.Code = '90960' or cqm.Code = '90961' or cqm.Code = '90962' or cqm.Code = '90963' or cqm.Code = '90964' or cqm.Code = '90965' or cqm.Code = '90966' or cqm.Code = '90967' or cqm.Code = '90968' or cqm.Code = '90969' or cqm.Code = '90970' or cqm.Code = '99512' \
                  or cqm.Code = '14684005' or cqm.Code = '225230008' or cqm.Code = '238318009' or cqm.Code = '238319001' or cqm.Code = '238321006' or cqm.Code = '238322004' or cqm.Code = '238323009' or cqm.Code = '428648006' or cqm.Code = '676002' or cqm.Code = '71192002' or cqm.Code = '90945' or cqm.Code = '90947' or cqm.Code = '90951' or cqm.Code = '90952' or cqm.Code = '90953' or cqm.Code = '90954' or cqm.Code = '90955' or cqm.Code = '90956' or cqm.Code = '90957' or cqm.Code = '90958' or cqm.Code = '90959' or cqm.Code = '90960' or cqm.Code = '90961' or cqm.Code = '90962' or cqm.Code = '90963' or cqm.Code = '90964' or cqm.Code = '90965' or cqm.Code = '90966' or cqm.Code = '90967' or cqm.Code = '90968' or cqm.Code = '90969' or cqm.Code = '90970' \
                ) \
            ) \
            and \
            ( \
              (isNull (cqm.StartDate, cqm.DateofVisit) >= dateadd(day, -92, '"+fromDate+"')) and (isNull (cqm.StartDate, cqm.DateofVisit) < dateadd(day, 92, '"+fromDate+"')) and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
            ) \
          ";


          cqmGuideController.cqmCheck(sql1, function(err, record){
              if(record && record.length > 0)
              {
                callback({criteriaName: "Denominator", isCriteriaQualify : true,  message : null});
              }
              else if(err) {
                callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
              }
              else {
                callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "<p align='justify' class='text-danger'>Encounter-Influenza</p><p align='justify' class='text-danger'>or Procedure Hemodialysis</p><p align='justify' class='text-danger'>or Peritoneal Dialysis</p><p align='justify' class='text-danger'>Within 92 days of before start of measurement or Within 89 days after start of measurement.</p>"});
              }
          });


}
