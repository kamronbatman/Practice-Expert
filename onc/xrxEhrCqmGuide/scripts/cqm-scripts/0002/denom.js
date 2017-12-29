var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                 (PatId = '"+patId+"') \
                 and (pat.Birthdate is not null) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 2) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) < 18) \
              )";
var sql2 = "select cqm.PatId \
              from xrxEhr_CQM cqm \
              where \
              ( \
                (PatId = '"+patId+"') \
                and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                and \
                ( \
                  cqm.Category = 'Visit Type' \
                ) \
                and \
                ( \
                  cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' or cqm.Code = '99218' or cqm.Code = '99219' or cqm.Code = '99220' or cqm.Code = '99281' or cqm.Code = '99282' or cqm.Code = '99283' or cqm.Code = '99284' or cqm.Code = '99285' or cqm.Code = '99381' or cqm.Code = '99382' or cqm.Code = '99383' or cqm.Code = '99384' or cqm.Code = '99385' or cqm.Code = '99386' or cqm.Code = '99387' or cqm.Code = '99391' or cqm.Code = '99392' or cqm.Code = '99393' or cqm.Code = '99394' or cqm.Code = '99395' or cqm.Code = '99396' or cqm.Code = '99397' or cqm.Code = '12843005' or cqm.Code = '18170008' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '19681004' or cqm.Code = '207195004' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '308335008' or cqm.Code = '390906007' or cqm.Code = '406547006' or cqm.Code = '439708006' or cqm.Code = '87790002' or cqm.Code = '90526000' \
				          or cqm.Code = '87430' \
                ) \
              )";
  var sql3 = "select cqm.PatId \
              from  xrxEhr_CQM cqm \
              where \
              ( \
              	(PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = '1013659' or cqm.Code = '1013662' or cqm.Code = '1013665' or cqm.Code = '1043022' or cqm.Code = '1043027' or cqm.Code = '1043030' or cqm.Code = '1043464' or cqm.Code = '105152' or cqm.Code = '105170' or cqm.Code = '105171' or cqm.Code = '108449' or cqm.Code = '1113012' or cqm.Code = '1114491' or cqm.Code = '1148107' or cqm.Code = '1302650' or cqm.Code = '1302664' or cqm.Code = '1302674' or cqm.Code = '141962' or cqm.Code = '141963' or cqm.Code = '142118' or cqm.Code = '197449' or cqm.Code = '197450' or cqm.Code = '197451' or cqm.Code = '197452' or cqm.Code = '197453' or cqm.Code = '197454' or cqm.Code = '197511' or cqm.Code = '197512' or cqm.Code = '197516' or cqm.Code = '197517' or cqm.Code = '197518' or cqm.Code = '197595' or cqm.Code = '197596' or cqm.Code = '197633' or cqm.Code = '197650' or cqm.Code = '197736' or cqm.Code = '197898' or cqm.Code = '197899' or cqm.Code = '197984' or cqm.Code = '197985' or cqm.Code = '198044' or cqm.Code = '198048' or cqm.Code = '198049' or cqm.Code = '198050' or cqm.Code = '198201' or cqm.Code = '198202' or cqm.Code = '198228' or cqm.Code = '198250' or cqm.Code = '198252' or cqm.Code = '198332' or cqm.Code = '198334' or cqm.Code = '198335' or cqm.Code = '198395' or cqm.Code = '198396' or cqm.Code = '199026' or cqm.Code = '199027' or cqm.Code = '199055' or cqm.Code = '199326' or cqm.Code = '199327' or cqm.Code = '199332' or cqm.Code = '199370' or cqm.Code = '199620' or cqm.Code = '199802' or cqm.Code = '199884' or cqm.Code = '199885' or cqm.Code = '199886' or cqm.Code = '199997' or cqm.Code = '200346' or cqm.Code = '204466' or cqm.Code = '204844' or cqm.Code = '204871' or cqm.Code = '204929' or cqm.Code = '204931' or cqm.Code = '205964' or cqm.Code = '207362' or cqm.Code = '207364' or cqm.Code = '207390' or cqm.Code = '207391' or cqm.Code = '226633' or cqm.Code = '239186' or cqm.Code = '239189' or cqm.Code = '239190' or cqm.Code = '239191' or cqm.Code = '239200' or cqm.Code = '239204' or cqm.Code = '239209' or cqm.Code = '239210' or cqm.Code = '239211' or cqm.Code = '239212' or cqm.Code = '240447' or cqm.Code = '240637' or cqm.Code = '240639' or cqm.Code = '240741' or cqm.Code = '240984' or cqm.Code = '242800' or cqm.Code = '242807' or cqm.Code = '242816' or cqm.Code = '242825' or cqm.Code = '245242' or cqm.Code = '246282' or cqm.Code = '247673' or cqm.Code = '248656' or cqm.Code = '250347' or cqm.Code = '250582' or cqm.Code = '259290' or cqm.Code = '259311' or cqm.Code = '283535' or cqm.Code = '284215' or cqm.Code = '308177' or cqm.Code = '308181' or cqm.Code = '308182' or cqm.Code = '308188' or cqm.Code = '308189' or cqm.Code = '308191' or cqm.Code = '308192' or cqm.Code = '308194' or cqm.Code = '308207' or cqm.Code = '308208' or cqm.Code = '308210' or cqm.Code = '308212' or cqm.Code = '308459' or cqm.Code = '308460' or cqm.Code = '308461' or cqm.Code = '308466' or cqm.Code = '308467' or cqm.Code = '308468' or cqm.Code = '309040' or cqm.Code = '309042' or cqm.Code = '309043' or cqm.Code = '309044' or cqm.Code = '309045' or cqm.Code = '309047' or cqm.Code = '309048' or cqm.Code = '309049' or cqm.Code = '309051' or cqm.Code = '309052' or cqm.Code = '309053' or cqm.Code = '309054' or cqm.Code = '309055' or cqm.Code = '309056' or cqm.Code = '309057' or cqm.Code = '309058' or cqm.Code = '309065' or cqm.Code = '309066' or cqm.Code = '309067' or cqm.Code = '309068' or cqm.Code = '309069' or cqm.Code = '309070' or cqm.Code = '309071' or cqm.Code = '309072' or cqm.Code = '309074' or cqm.Code = '309075' or cqm.Code = '309076' or cqm.Code = '309078' or cqm.Code = '309079' or cqm.Code = '309080' or cqm.Code = '309081' or cqm.Code = '309082' or cqm.Code = '309083' or cqm.Code = '309084' or cqm.Code = '309085' or cqm.Code = '309086' or cqm.Code = '309087' or cqm.Code = '309090' or cqm.Code = '309091' or cqm.Code = '309092' or cqm.Code = '309093' or cqm.Code = '309095' or cqm.Code = '309096' or cqm.Code = '309097' or cqm.Code = '309098' or cqm.Code = '309099' or cqm.Code = '309100' or cqm.Code = '309101' or cqm.Code = '309110' or cqm.Code = '309111' or cqm.Code = '309112' or cqm.Code = '309113' or cqm.Code = '309114' or cqm.Code = '309115' or cqm.Code = '309175' or cqm.Code = '309304' or cqm.Code = '309308' or cqm.Code = '309309' or cqm.Code = '309310' or cqm.Code = '309322' or cqm.Code = '309329' or cqm.Code = '309335' or cqm.Code = '309336' or cqm.Code = '309339' or cqm.Code = '309860' or cqm.Code = '310026' or cqm.Code = '310027' or cqm.Code = '310028' or cqm.Code = '310029' or cqm.Code = '310030' or cqm.Code = '310151' or cqm.Code = '310154' or cqm.Code = '310155' or cqm.Code = '310156' or cqm.Code = '310157' or cqm.Code = '310160' or cqm.Code = '310163' or cqm.Code = '310165' or cqm.Code = '310472' or cqm.Code = '310473' or cqm.Code = '310474' or cqm.Code = '310475' or cqm.Code = '310476' or cqm.Code = '310477' or cqm.Code = '311214' or cqm.Code = '311215' or cqm.Code = '311296' or cqm.Code = '311341' or cqm.Code = '311342' or cqm.Code = '311345' or cqm.Code = '311346' or cqm.Code = '311347' or cqm.Code = '311364' or cqm.Code = '311370' or cqm.Code = '311371' or cqm.Code = '311681' or cqm.Code = '311683' or cqm.Code = '311787' or cqm.Code = '311895' or cqm.Code = '311896' or cqm.Code = '311897' or cqm.Code = '311898' or cqm.Code = '311899' or cqm.Code = '311988' or cqm.Code = '311989' or cqm.Code = '311992' or cqm.Code = '311994' or cqm.Code = '311995' or cqm.Code = '312127' or cqm.Code = '312128' or cqm.Code = '312130' or cqm.Code = '312443' or cqm.Code = '312444' or cqm.Code = '312446' or cqm.Code = '312447' or cqm.Code = '312821' or cqm.Code = '313115' or cqm.Code = '313133' or cqm.Code = '313134' or cqm.Code = '313135' or cqm.Code = '313137' or cqm.Code = '313251' or cqm.Code = '313252' or cqm.Code = '313253' or cqm.Code = '313254' or cqm.Code = '313401' or cqm.Code = '313402' or cqm.Code = '313416' or cqm.Code = '313570' or cqm.Code = '313571' or cqm.Code = '313572' or cqm.Code = '313574' or cqm.Code = '313797' or cqm.Code = '313799' or cqm.Code = '313800' or cqm.Code = '313819' or cqm.Code = '313850' or cqm.Code = '313888' or cqm.Code = '313890' or cqm.Code = '313920' or cqm.Code = '313922' or cqm.Code = '313925' or cqm.Code = '313926' or cqm.Code = '313929' or cqm.Code = '313996' or cqm.Code = '314079' or cqm.Code = '314106' or cqm.Code = '314108' or cqm.Code = '315090' or cqm.Code = '315209' or cqm.Code = '315219' or cqm.Code = '317127' or cqm.Code = '318218' or cqm.Code = '342904' or cqm.Code = '343049' or cqm.Code = '348719' or cqm.Code = '348869' or cqm.Code = '348870' or cqm.Code = '351121' or cqm.Code = '351127' or cqm.Code = '351156' or cqm.Code = '351239' or cqm.Code = '359383' or cqm.Code = '359385' or cqm.Code = '359465' or cqm.Code = '388510' or cqm.Code = '389025' or cqm.Code = '403840' or cqm.Code = '403920' or cqm.Code = '403921' or cqm.Code = '403945' or cqm.Code = '406524' or cqm.Code = '406696' or cqm.Code = '413716' or cqm.Code = '415059' or cqm.Code = '415868' or cqm.Code = '415869' or cqm.Code = '419849' or cqm.Code = '434018' or cqm.Code = '476193' or cqm.Code = '476299' or cqm.Code = '476322' or cqm.Code = '476325' or cqm.Code = '476327' or cqm.Code = '476576' or cqm.Code = '476623' or cqm.Code = '477391' or cqm.Code = '486912' or cqm.Code = '487129' or cqm.Code = '562058' or cqm.Code = '562251' or cqm.Code = '562253' or cqm.Code = '562266' or cqm.Code = '562508' or cqm.Code = '562707' or cqm.Code = '577378' or cqm.Code = '597194' or cqm.Code = '597298' or cqm.Code = '597455' or cqm.Code = '597761' or cqm.Code = '597808' or cqm.Code = '597823' or cqm.Code = '598006' or cqm.Code = '598025' or cqm.Code = '617296' or cqm.Code = '617302' or cqm.Code = '617304' or cqm.Code = '617309' or cqm.Code = '617316' or cqm.Code = '617322' or cqm.Code = '617423' or cqm.Code = '617430' or cqm.Code = '617993' or cqm.Code = '617995' or cqm.Code = '623677' or cqm.Code = '623695' or cqm.Code = '629695' or cqm.Code = '629697' or cqm.Code = '629699' or cqm.Code = '636559' or cqm.Code = '637173' or cqm.Code = '637560' or cqm.Code = '644541' or cqm.Code = '645617' or cqm.Code = '686354' or cqm.Code = '686355' or cqm.Code = '686383' or cqm.Code = '686400' or cqm.Code = '686405' or cqm.Code = '686406' or cqm.Code = '686418' or cqm.Code = '686447' or cqm.Code = '700408' or cqm.Code = '728207' or cqm.Code = '731538' or cqm.Code = '731560' or cqm.Code = '731564' or cqm.Code = '731567' or cqm.Code = '731570' or cqm.Code = '731572' or cqm.Code = '731575' or cqm.Code = '745047' or cqm.Code = '745053' or cqm.Code = '745276' or cqm.Code = '745278' or cqm.Code = '745280' or cqm.Code = '745282' or cqm.Code = '745302' or cqm.Code = '745303' or cqm.Code = '745462' or cqm.Code = '745519' or cqm.Code = '745560' or cqm.Code = '745561' or cqm.Code = '745585' or cqm.Code = '749780' or cqm.Code = '749783' or cqm.Code = '756189' or cqm.Code = '756192' or cqm.Code = '757460' or cqm.Code = '757464' or cqm.Code = '757466' or cqm.Code = '761979' or cqm.Code = '762666' or cqm.Code = '762893' or cqm.Code = '789980' or cqm.Code = '796301' or cqm.Code = '796484' or cqm.Code = '796486' or cqm.Code = '796488' or cqm.Code = '796490' or cqm.Code = '796492' or cqm.Code = '799048' or cqm.Code = '802550' or cqm.Code = '808917' or cqm.Code = '835341' or cqm.Code = '835700' or cqm.Code = '836306' or cqm.Code = '847360' or cqm.Code = '852868' or cqm.Code = '858062' or cqm.Code = '858372' or cqm.Code = '860441' or cqm.Code = '861416' or cqm.Code = '863538' or cqm.Code = '877486' or cqm.Code = '895915' or cqm.Code = '895924' or cqm.Code = '901610' or cqm.Code = '904288' or cqm.Code = '905143' or cqm.Code = '905148' or cqm.Code = '993109' or cqm.Code = '997632' or cqm.Code = '997656' or cqm.Code = '997665' or cqm.Code = '997999' or cqm.Code = '998004' or cqm.Code = '998239' or cqm.Code = '998241' or cqm.Code = '998756' \
              	) \
              	and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              )";
  var sql4 = "select cqm.PatId \
              from  xrxEhr_CQM cqm \
              where \
              ( \
              	(PatId = '"+patId+"') \
              	and \
              	( \
              		cqm.Code = 'J02.8' or cqm.Code = 'J02.9' or cqm.Code = '034.0' or cqm.Code = '462' or cqm.Code = '1532007' or cqm.Code = '195655000' or cqm.Code = '195656004' or cqm.Code = '195657008' or cqm.Code = '195658003' or cqm.Code = '195659006' or cqm.Code = '195660001' or cqm.Code = '195662009' or cqm.Code = '232399005' or cqm.Code = '232400003' or cqm.Code = '363746003' or cqm.Code = '40766000' or cqm.Code = '43878008' or cqm.Code = '55355000' or cqm.Code = '58031004' \
              		or cqm.Code = 'J03.80' or cqm.Code = 'J03.81' or cqm.Code = 'J03.90' or cqm.Code = 'J03.91' or cqm.Code = '463' or cqm.Code = '17741008' or cqm.Code = '195666007' or cqm.Code = '195667003' or cqm.Code = '195668008' or cqm.Code = '195669000' or cqm.Code = '195670004' or cqm.Code = '195671000' or cqm.Code = '195672007' or cqm.Code = '195673002' or cqm.Code = '195676005' or cqm.Code = '195677001' or cqm.Code = '302911003' \
              	) \
              	and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
             ) \
            ";

  cqmGuideController.cqmCheck(sql1, function(err, record){

                if(record && record.length > 0)
                {

                      cqmGuideController.cqmCheck(sql2, function(err, record){

                        if(record && record.length > 0)
                        {
                          cqmGuideController.cqmCheck(sql3, function(err, record){

                            if(record && record.length > 0)
                            {
                              cqmGuideController.cqmCheck(sql4, function(err, record){

                                if(record && record.length > 0)
                                {
                                  callback({criteriaName: "Denominator", isCriteriaQualify : true,  message : null});
                                }
                                else if(err)
                                {
                                  callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                                }
                                else
                                {
                                  callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Active: Acute Pharyngitis OR Tonsillitis"});
                                }

                              });
                            }
                            else if(err)
                            {
                              callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                            }
                            else
                            {
                              callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Antibiotic Medications starts within 3 days after office visit"});
                            }

                          });
                        }
                        else if(err)
                        {
                          callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                        }
                        else
                        {
                          callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Encounter type is not office visit"});
                        }

                      });
                }
                else if(err)
                {
                    callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                }
                else
                {
                    callback({criteriaName: "Denominator", isCriteriaQualify : false, message : null});
                }

  });

};
