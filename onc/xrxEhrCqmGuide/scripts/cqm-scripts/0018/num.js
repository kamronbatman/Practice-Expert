var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.PatId from xrxEhr_cqm cqm, xrxEhr_pn pn \
              where \
              (	 \
                (cqm.PatId = '"+patId+"')  \
                and \
                pn.PatId = cqm.PatId   \
                and \
                DATEDIFF(day,pn.DateOfVisit,cqm.DateOfVisit) = 0 \
                and  \
                ( \
                	pn.Diastolic is not null \
                	and pn.Systolic is not null \
                	and  pn.Diastolic <90 \
                	and  pn.Systolic < 140 \
                ) \
                and \
                ( \
                	( \
                		cqm.Code='99201' or cqm.Code='99202' or cqm.Code='99203' or cqm.Code='99204' or cqm.Code='99205' or cqm.Code='99212' or cqm.Code='99213' or cqm.Code='99214' or cqm.Code='99215' \
                		or cqm.Code= '99241' or cqm.Code= '99242' or cqm.Code= '99243' or cqm.Code= '99244' or cqm.Code= '99245' \
                		or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
                		or cqm.Code='99395' or cqm.Code='99396' or cqm.Code='99397'  \
                		or cqm.Code='99385' or cqm.Code='99386' or cqm.Code='99387'  \
                		or cqm.Code='99341' or cqm.Code='99342' or cqm.Code='99343' or cqm.Code='99344' or cqm.Code='99345' or cqm.Code='99347' or cqm.Code='99348' or cqm.Code='99349' or cqm.Code='99350' \
                		or cqm.Code='G0438' or cqm.Code='G0439' \
                	) \
                         and \
                       ( \
                       cqm.Category = 'Visit Type' \
                       ) \
                	and (cqm.DateOfVisit >= '"+fromDate+"') and (cqm.DateOfVisit<='"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
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
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "For Recent Visit: Diastolic < 90 and Systolic < 140."});
            }
        });
}
