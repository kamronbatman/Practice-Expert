var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select distinct patid from  xrxEhr_cqm cqm \
              where \
              (cqm.PatId = '"+patId+"') \
              and \
              ( \
              	cqm.PatId in \
              	( \
              		SELECT cqm.PatId FROM xrxEhr_cqm cqm WHERE \
              		( \
              			( \
              				cqm.PatId in \
              				( \
              					SELECT cqm.PatId FROM xrxEhr_cqm cqm WHERE \
              					( \
              						(cqm.Code = '315640000') \
              						and \
              						(isNull (cqm.StartDate, cqm.DateofVisit) >= dateadd(day, -153, '"+fromDate+"')) and (isNull (cqm.StartDate, cqm.DateofVisit) <= dateadd(day, 91, '"+fromDate+"')) and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              					) \
              				) \
              				or \
              				cqm.PatId in \
              				( \
              					SELECT cqm.PatId FROM xrxEhr_cqm cqm \
              					inner join  \
              					( \
              						select * from xrxEhr_CQM cqm \
              						where \
              						( \
              							(cqm.MasterRecno is not null) \
              							and \
              							( \
              								cqm.Code = '161590003' or cqm.Code = '183932001' or cqm.Code = '183964008' or cqm.Code = '183966005' or cqm.Code = '216952002' or cqm.Code = '266721009' or cqm.Code = '269191009' or cqm.Code = '274512008' or cqm.Code = '31438003' or cqm.Code = '35688006' or cqm.Code = '371133007' or cqm.Code = '397745006' or cqm.Code = '407563006' or cqm.Code = '410534003' or cqm.Code = '410536001' or cqm.Code = '416098002' or cqm.Code = '416406003' or cqm.Code = '428119001' or cqm.Code = '445528004' or cqm.Code = '59037007' or cqm.Code = '62014003' or cqm.Code = '79899007' \
              								or cqm.Code = '105480006' or cqm.Code = '160932005' or cqm.Code = '160934006' or cqm.Code = '182890002' or cqm.Code = '182895007' or cqm.Code = '182897004' or cqm.Code = '182900006' or cqm.Code = '182902003' or cqm.Code = '183944003' or cqm.Code = '183945002' or cqm.Code = '184081006' or cqm.Code = '185479006' or cqm.Code = '185481008' or cqm.Code = '224187001' or cqm.Code = '225928004' or cqm.Code = '258147002' or cqm.Code = '266710000' or cqm.Code = '266966009' or cqm.Code = '275694009' or cqm.Code = '275936005' or cqm.Code = '281399006' or cqm.Code = '30164005' or cqm.Code = '310343007' or cqm.Code = '373787003' or cqm.Code = '385648002' or cqm.Code = '406149000' or cqm.Code = '408367005' or cqm.Code = '413310006' or cqm.Code = '413311005' or cqm.Code = '413312003' or cqm.Code = '416432009' or cqm.Code = '423656007' or cqm.Code = '424739004' or cqm.Code = '443390004' or cqm.Code = '5015009' \
              								or cqm.Code = '107724000' or cqm.Code = '182856006' or cqm.Code = '182857002' or cqm.Code = '185335007' or cqm.Code = '224194003' or cqm.Code = '224198000' or cqm.Code = '224199008' or cqm.Code = '242990004' or cqm.Code = '266756008' or cqm.Code = '270459005' or cqm.Code = '309017000' or cqm.Code = '309846006' or cqm.Code = '419808006' or cqm.Code = '424553001' \
              							) \
              						) \
              					)tmpCqm \
              					on cqm.EhrRecno = tmpCqm.MasterRecno \
              					WHERE \
              					( \
              					  ( \
              							cqm.Code = '442333005' or cqm.Code = '86198006' or cqm.Code = '90653' or cqm.Code = '90655' or cqm.Code = '90656' or cqm.Code = '90657' or cqm.Code = '90658' or cqm.Code = '90660' or cqm.Code = '90661' or cqm.Code = '90662' or cqm.Code = '90664' or cqm.Code = '90666' or cqm.Code = '90667' or cqm.Code = '90668' or cqm.Code = '90672' or cqm.Code = '90685' or cqm.Code = '90686' or cqm.Code = '90687' or cqm.Code = '90688' \
              							or cqm.Code = '111' or cqm.Code = '135' or cqm.Code = '140' or cqm.Code = '141' or cqm.Code = '144' or cqm.Code = '149' or cqm.Code = '150' \
              						) \
              						and \
              						( \
              							(isNull (cqm.StartDate, cqm.DateofVisit) >= dateadd(day, -153, '"+fromDate+"')) and (isNull (cqm.StartDate, cqm.DateofVisit) <= dateadd(day, 91, '"+fromDate+"')) and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              						) \
              					) \
              				) \
              			) \
              		) \
              	) \
              	or \
              	cqm.PatId in \
              	( \
              		SELECT cqm.PatId FROM xrxEhr_cqm cqm WHERE \
              		( \
              			cqm.Code = '213020009' or cqm.Code = '91930004' \
              			or cqm.Code = '294647003' or cqm.Code = '294648008' or cqm.Code = '294649000' or cqm.Code = '315631004' \
              			or cqm.Code = '293112000' or cqm.Code = '293113005' or cqm.Code = '390796006' or cqm.Code = '420113004' \
              		) \
              		and \
              		( \
              			(cqm.StopDate >= dateadd(day, 91, '"+fromDate+"') or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')   and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) 	\
              		) \
              	) \
              )";

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
      callback({criteriaName: "Denominator Exceptions", isCriteriaQualify : false,  message : "<p align='justify' class='text-danger'>Influenza Vaccination not done within 153 days of before start of measurement or within 89 days after start of measurement.</p> \
                                                                                               <p align='justify' class='text-danger'>or (Allergy to Eggs or Allergy to Influenza Vaccine or Intolerance to Influenza Vaccine)  start before or during measurement and doesn't end within 89 days after start of measument.</p> \
                                                                                              "});
    }
  });

}
