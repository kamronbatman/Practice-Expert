var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.patid from xrxEhr_cqm cqm \
              where \
              ( \
                cqm.Code = '103736005' or cqm.Code = '183073003' or cqm.Code = '183075005' or cqm.Code = '223440005' or cqm.Code = '281090004' or cqm.Code = '304507003' or cqm.Code = '304549008' or cqm.Code = '304558001' or cqm.Code = '310882002' or cqm.Code = '386291006' or cqm.Code = '386292004' or cqm.Code = '386463000' or cqm.Code = '390864007' or cqm.Code = '390893007' or cqm.Code = '398636004' or cqm.Code = '398752005' or cqm.Code = '410289001' or cqm.Code = '410335001' or cqm.Code = '426866005' or cqm.Code = '429778002' or cqm.Code = '439140001' \
                or cqm.Code = 'V65.41' or cqm.Code = 'Z71.89' \
              ) \
              and (isNull (cqm.StartDate, cqm.DateofVisit) >= '"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"') \
              and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              and (PatId = '"+patId+"') \
              ";

        cqmGuideController.cqmCheck(sql1, function(err, record){
            if(record && record.length > 0)
            {
              callback({criteriaName: "Numerator 3", isCriteriaQualify : true,  message : null});
            }
            else if(err) {
              callback({criteriaName: "Numerator 3", isCriteriaQualify : false,  message : err});
            }
            else {
              callback({criteriaName: "Numerator 3", isCriteriaQualify : false,  message : "Counseling for Physical Activity."});
            }
        });

}
