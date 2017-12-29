var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

    var sql1 = "declare  @tempTableA table \
                ( \
                	RecNo uniqueidentifier, \
                	EhrRecno uniqueidentifier, \
                	MasterRecno uniqueidentifier, \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime, \
                	Code varchar(25) \
                ) \
                declare  @tempTableB table \
                ( \
                	RecNo uniqueidentifier, \
                	EhrRecno uniqueidentifier, \
                	MasterRecno uniqueidentifier, \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime, \
                	Code varchar(25) \
                ) \
                declare  @tempTableC table \
                ( \
                	RecNo uniqueidentifier, \
                	EhrRecno uniqueidentifier, \
                	MasterRecno uniqueidentifier, \
                	PatId varchar(25), \
                	DateOfVisit smalldatetime, \
                	StopDate smalldatetime, \
                	StartDate smalldatetime, \
                	Code varchar(25) \
                ) \
                insert into @tempTableA \
                select cqm.RecNo, cqm.EhrRecno, cqm.MasterRecno, cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate, (cqm.Code) \
                from xrxEhr_Cqm cqm \
                inner join \
                ( \
                    select cqm.PatId, max(DateOfVisit) as DateOfVisit \
                    from xrxEhr_Cqm cqm \
                    where \
                    ( \
                		(PatId = '"+patId+"') \
                		and \
                		( \
                			cqm.Code = '73831-0' \
                		) \
                		and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                	) \
                  group by PatId \
                ) tmpCqm \
                on cqm.PatId = tmpCqm .PatId and cqm.DateOfVisit = tmpCqm .DateOfVisit \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	( \
                		cqm.Code = '73831-0' \
                	) \
                ) \
                insert into @tempTableB \
                select cqm.RecNo, cqm.EhrRecno, cqm.MasterRecno, cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate, (cqm.Code) \
                from xrxEhr_Cqm cqm \
                inner join \
                ( \
                    select cqm.PatId, max(DateOfVisit) as DateOfVisit \
                    from xrxEhr_Cqm cqm \
                    where \
                    ( \
                		(PatId = '"+patId+"') \
                		and \
                		( \
                			cqm.Code = '73832-8' \
                		) \
                		and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                  ) \
                    group by PatId \
                ) tmpCqm \
                on cqm.PatId = tmpCqm .PatId and cqm.DateOfVisit = tmpCqm .DateOfVisit \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	( \
                		cqm.Code = '73832-8' \
                	) \
                ) \
                insert into @tempTableC \
                select cqm.RecNo, cqm.EhrRecno, cqm.MasterRecno, cqm.PatId, cqm.DateOfVisit, cqm.StopDate, cqm.StartDate, (cqm.Code) \
                from xrxEhr_Cqm cqm \
                where \
                ( \
                	(cqm.PatId = '"+patId+"') \
                	and \
                	( \
                		( \
                			cqm.Code = '14183003' or cqm.Code = '15193003' or cqm.Code = '15639000' or cqm.Code = '18818009' or cqm.Code = '191610000' or cqm.Code = '191611001' or cqm.Code = '191613003' or cqm.Code = '191616006' or cqm.Code = '191659001' or cqm.Code = '192080009' or cqm.Code = '19527009' or cqm.Code = '19694002' or cqm.Code = '20250007' or cqm.Code = '231504006' or cqm.Code = '231542000' or cqm.Code = '2506003' or cqm.Code = '25922000' or cqm.Code = '2618002' or cqm.Code = '268621008' or cqm.Code = '28475009' or cqm.Code = '3109008' or cqm.Code = '319768000' or cqm.Code = '320751009' or cqm.Code = '33078009' or cqm.Code = '35489007' or cqm.Code = '36170009' or cqm.Code = '36474008' or cqm.Code = '36923009' or cqm.Code = '370143000' or cqm.Code = '38451003' or cqm.Code = '38694004' or cqm.Code = '39809009' or cqm.Code = '40379007' or cqm.Code = '40568001' or cqm.Code = '42925002' or cqm.Code = '430852001' or cqm.Code = '442057004' or cqm.Code = '48589009' or cqm.Code = '63778009' or cqm.Code = '66344007' or cqm.Code = '67711008' or cqm.Code = '69392006' or cqm.Code = '71336009' or cqm.Code = '73867007' or cqm.Code = '75084000' or cqm.Code = '75837004' or cqm.Code = '76441001' or cqm.Code = '77486005' or cqm.Code = '77911002' or cqm.Code = '78667006' or cqm.Code = '79298009' or cqm.Code = '81319007' or cqm.Code = '83176005' or cqm.Code = '832007' or cqm.Code = '84760002' or cqm.Code = '85080004' or cqm.Code = '87512008' or cqm.Code = '290.13' or cqm.Code = '290.21' or cqm.Code = '290.43' or cqm.Code = '296.21' or cqm.Code = '296.22' or cqm.Code = '296.23' or cqm.Code = '296.24' or cqm.Code = '296.25' or cqm.Code = '296.26' or cqm.Code = '296.31' or cqm.Code = '296.32' or cqm.Code = '296.33' or cqm.Code = '296.34' or cqm.Code = '296.36' or cqm.Code = '296.82' or cqm.Code = '298.0' or cqm.Code = '300.4' or cqm.Code = '301.12' or cqm.Code = '309.0' or cqm.Code = '309.1' or cqm.Code = '309.28' or cqm.Code = '311' or cqm.Code = 'F01.51' or cqm.Code = 'F32.0' or cqm.Code = 'F32.1' or cqm.Code = 'F32.2' or cqm.Code = 'F32.3' or cqm.Code = 'F32.4' or cqm.Code = 'F32.5' or cqm.Code = 'F32.8' or cqm.Code = 'F32.9' or cqm.Code = 'F33.0' or cqm.Code = 'F33.1' or cqm.Code = 'F33.2' or cqm.Code = 'F33.3' or cqm.Code = 'F33.42' or cqm.Code = 'F33.9' or cqm.Code = 'F34.1' or cqm.Code = 'F43.21' or cqm.Code = 'F43.23' \
                		) \
                		or \
                		( \
                			cqm.Code = '10875004' or cqm.Code = '10981006' or cqm.Code = '111485001' or cqm.Code = '1196001' or cqm.Code = '13313007' or cqm.Code = '13581000' or cqm.Code = '13746004' or cqm.Code = '14495005' or cqm.Code = '1499003' or cqm.Code = '162004' or cqm.Code = '16295005' or cqm.Code = '16506000' or cqm.Code = '17782008' or cqm.Code = '191618007' or cqm.Code = '191620005' or cqm.Code = '191621009' or cqm.Code = '191623007' or cqm.Code = '191625000' or cqm.Code = '191627008' or cqm.Code = '191629006' or cqm.Code = '191630001' or cqm.Code = '191632009' or cqm.Code = '191634005' or cqm.Code = '191636007' or cqm.Code = '191638008' or cqm.Code = '191639000' or cqm.Code = '191641004' or cqm.Code = '191643001' or cqm.Code = '192362008' or cqm.Code = '19300006' or cqm.Code = '20960007' or cqm.Code = '21900002' or cqm.Code = '22121000' or cqm.Code = '22407005' or cqm.Code = '231444002' or cqm.Code = '26203008' or cqm.Code = '26530004' or cqm.Code = '28663008' or cqm.Code = '28884001' or cqm.Code = '29929003' or cqm.Code = '30520009' or cqm.Code = '30687003' or cqm.Code = '30935000' or cqm.Code = '31446002' or cqm.Code = '33380008' or cqm.Code = '34315001' or cqm.Code = '3530005' or cqm.Code = '35481005' or cqm.Code = '35846004' or cqm.Code = '36583000' or cqm.Code = '371596008' or cqm.Code = '371599001' or cqm.Code = '371600003' or cqm.Code = '371604007' or cqm.Code = '38368003' or cqm.Code = '40926005' or cqm.Code = '41552001' or cqm.Code = '41832009' or cqm.Code = '41836007' or cqm.Code = '43568002' or cqm.Code = '43769008' or cqm.Code = '4441000' or cqm.Code = '45479006' or cqm.Code = '46229002' or cqm.Code = '48937005' or cqm.Code = '49468007' or cqm.Code = '49512000' or cqm.Code = '51637008' or cqm.Code = '53049002' or cqm.Code = '53607008' or cqm.Code = '54761006' or cqm.Code = '55516002' or cqm.Code = '5703000' or cqm.Code = '59617007' or cqm.Code = '61403008' or cqm.Code = '63249007' or cqm.Code = '64731001' or cqm.Code = '65042007' or cqm.Code = '66631006' or cqm.Code = '68569003' or cqm.Code = '70546001' or cqm.Code = '71294008' or cqm.Code = '71984005' or cqm.Code = '73471000' or cqm.Code = '74686005' or cqm.Code = '75360000' or cqm.Code = '75752004' or cqm.Code = '78269000' or cqm.Code = '78640000' or cqm.Code = '79584002' or cqm.Code = '81319007' or cqm.Code = '82998009' or cqm.Code = '83225003' or cqm.Code = '85248005' or cqm.Code = '86058007' or cqm.Code = '87203005' or cqm.Code = '87950005' or cqm.Code = '9340000' or cqm.Code = '296.40' or cqm.Code = '296.41' or cqm.Code = '296.42' or cqm.Code = '296.43' or cqm.Code = '296.44' or cqm.Code = '296.45' or cqm.Code = '296.46' or cqm.Code = '296.80' or cqm.Code = 'F31.11' or cqm.Code = 'F31.12' or cqm.Code = 'F31.13' or cqm.Code = 'F31.2' or cqm.Code = 'F31.73' or cqm.Code = 'F31.74' or cqm.Code = 'F31.9' \
                		) \
                	) \
                	and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                ) \
                select tmpc.PatId \
                from   @tempTableA tmpa, @tempTableB tmpb, @tempTableC tmpc \
                where \
                ( \
                	( \
                		(tmpa.PatId = tmpc.PatId) \
                		and \
                		((tmpc.StopDate > isNull (tmpa.StartDate, tmpa.DateofVisit) or tmpc.StopDate is null) and (isNull (tmpc.StartDate, tmpc.DateofVisit) <= isNull (tmpa.StartDate, tmpa.DateofVisit))) \
                	) \
                	or \
                	( \
                		(tmpb.PatId = tmpc.PatId) \
                		and \
                		((tmpc.StopDate > isNull (tmpb.StartDate, tmpb.DateofVisit) or tmpc.StopDate is null) and (isNull (tmpc.StartDate, tmpc.DateofVisit) <= isNull (tmpb.StartDate, tmpb.DateofVisit))) \
                	) \
                )";


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
                          callback({criteriaName: "Denominator Exclusions", isCriteriaQualify : false,  message : "<p align='justify' class='text-danger'> Risk Category Assessment: Adolescent/Adult Depression Screening (result: 'Depression Screening Result')</p> \
                                                                                                                  <p align='justify' class='text-danger'>AND Diagnosis Active: Depression diagnosis or Diagnosis, Active: Bipolar Diagnosis</p> \
                                                                                                                  "});
                      }
                });


};
