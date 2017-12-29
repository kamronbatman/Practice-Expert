var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxEhr_cqm cqm \
              where \
              ( \
                ( \
            			cqm.Code = '109838007' or cqm.Code = '1701000119104' or cqm.Code = '187757001' or cqm.Code = '269533000' or cqm.Code = '269544008' or cqm.Code = '285312008' or cqm.Code = '285611007' or cqm.Code = '301756000' or cqm.Code = '312111009' or cqm.Code = '312112002' or cqm.Code = '312113007' or cqm.Code = '312114001' or cqm.Code = '312115000' or cqm.Code = '314965007' or cqm.Code = '315058005' or cqm.Code = '363406005' or cqm.Code = '363407001' or cqm.Code = '363408006' or cqm.Code = '363409003' or cqm.Code = '363410008' or cqm.Code = '363412000' or cqm.Code = '363413005' or cqm.Code = '363414004' or cqm.Code = '363510005' or cqm.Code = '425178004' or cqm.Code = '449218003' or cqm.Code = '93683002' or cqm.Code = '93761005' or cqm.Code = '93771007' or cqm.Code = '93826009' or cqm.Code = '93980002' or cqm.Code = '94006002' or cqm.Code = '94072004' or cqm.Code = '94105000' or cqm.Code = '94179005' or cqm.Code = '94260004' or cqm.Code = '94271003' or cqm.Code = '94328005' or cqm.Code = '94509004' or cqm.Code = '94538001' or cqm.Code = '94604000' or cqm.Code = '94643001' or cqm.Code = '187758006' or cqm.Code = '153.0' or cqm.Code = '153.1' or cqm.Code = '153.2' or cqm.Code = '153.3' or cqm.Code = '153.4' or cqm.Code = '153.5' or cqm.Code = '153.6' or cqm.Code = '153.7' or cqm.Code = '153.8' or cqm.Code = '153.9' or cqm.Code = '154.0' or cqm.Code = '154.1' or cqm.Code = '197.5' or cqm.Code = 'C18.0' or cqm.Code = 'C18.1' or cqm.Code = 'C18.2' or cqm.Code = 'C18.3' or cqm.Code = 'C18.4' or cqm.Code = 'C18.5' or cqm.Code = 'C18.6' or cqm.Code = 'C18.7' or cqm.Code = 'C18.8' or cqm.Code = 'C18.9' or cqm.Code = 'C19' or cqm.Code = 'C20' or cqm.Code = 'C78.5' \
            		) \
            		or \
            		( \
            			(cqm.ReasonCode is null) \
            			and \
            			( \
            				cqm.Code = '235331003' or cqm.Code = '26390003' or cqm.Code = '303401008' or cqm.Code = '307666008' or cqm.Code = '307667004' or cqm.Code = '307669001' or cqm.Code = '31130001' or cqm.Code = '36192008' or cqm.Code = '427816007' or cqm.Code = '44751009' or cqm.Code = '456004' or cqm.Code = '80294005' or cqm.Code = '44152' or cqm.Code = '44153' or cqm.Code = '44150' or cqm.Code = '44151' or cqm.Code = '44155' or cqm.Code = '44156' or cqm.Code = '44157' or cqm.Code = '44158' or cqm.Code = '44210' or cqm.Code = '44211' or cqm.Code = '44212' \
            			)	 \
            		) \
              ) \
              and (isNull (cqm.StartDate, cqm.DateofVisit)<='"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              and (PatId = '"+patId+"') \
              ";

  cqmGuideController.cqmCheck(sql1, function(err, record){
        if(record && record.length > 0){
            callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : true,  message : null});
        }
        else if(err) {
            callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : false,  message : err});
        }
        else{
            callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : false,  message : "Malignant Neoplasm of Colon or Total Colectomy"});
        }
  });
};
