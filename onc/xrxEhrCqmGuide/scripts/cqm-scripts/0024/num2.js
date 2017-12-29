var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.patid from xrxEhr_cqm cqm \
              where \
              ( \
                cqm.Code = '97802' or cqm.Code = '97803' or cqm.Code = '97804' or cqm.Code = '103699006' or cqm.Code = '11816003' or cqm.Code = '183059007' or cqm.Code = '183062005' or cqm.Code = '183065007' or cqm.Code = '183067004' or cqm.Code = '183070000' or cqm.Code = '183071001' or cqm.Code = '183101003' or cqm.Code = '229807004' or cqm.Code = '229808009' or cqm.Code = '230089004' or cqm.Code = '266724001' or cqm.Code = '284352003' or cqm.Code = '285390004' or cqm.Code = '285392007' or cqm.Code = '306163007' or cqm.Code = '306164001' or cqm.Code = '306165000' or cqm.Code = '306353006' or cqm.Code = '306354000' or cqm.Code = '313076000' or cqm.Code = '361232005' or cqm.Code = '370847001' or cqm.Code = '386264009' or cqm.Code = '386469001' or cqm.Code = '400973003' or cqm.Code = '408430003' or cqm.Code = '410200000' or cqm.Code = '410270001' or cqm.Code = '410293007' or cqm.Code = '410402005' or cqm.Code = '419155003' or cqm.Code = '424753004' or cqm.Code = '429095004' or cqm.Code = '443288003' or cqm.Code = '61310001' \
	              or cqm.Code = 'V65.3' or cqm.Code = 'Z71.3' \
              ) \
              and (isNull (cqm.StartDate, cqm.DateofVisit) >= '"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"') \
              and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              and (PatId = '"+patId+"') \
              ";

        cqmGuideController.cqmCheck(sql1, function(err, record){
            if(record && record.length > 0)
            {
              callback({criteriaName: "Numerator 2", isCriteriaQualify : true,  message : null});
            }
            else if(err) {
              callback({criteriaName: "Numerator 2", isCriteriaQualify : false,  message : err});
            }
            else {
              callback({criteriaName: "Numerator 2", isCriteriaQualify : false,  message : "Counseling for Nutrition."});
            }
        });

}
