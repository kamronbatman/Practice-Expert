var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {
  var sql1 = "select PatId from xrxPat pat \
               where ( \
                 (PatId = '"+patId+"') \
                 and (pat.Birthdate is not null) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 18) \
                )";
var sql2 =  "select cqm.PatId \
              from xrxEhr_CQM cqm \
              where \
              ( \
                (PatId = '"+patId+"') \
                and \
                ( \
                  cqm.Code = 'G0101' or cqm.Code = 'G0108' or cqm.Code = 'G0270' or cqm.Code = 'G0402' or cqm.Code = 'G0438' or cqm.Code = 'G0439' or cqm.Code = '10197000' or cqm.Code = '108220007' or cqm.Code = '108221006' or cqm.Code = '108224003' or cqm.Code = '108311000' or cqm.Code = '13607009' or cqm.Code = '14736009' or cqm.Code = '165171009' or cqm.Code = '18091003' or cqm.Code = '18512000' or cqm.Code = '185349003' or cqm.Code = '185463005' or cqm.Code = '185465003' or cqm.Code = '209099002' or cqm.Code = '210098006' or cqm.Code = '225967005' or cqm.Code = '252592009' or cqm.Code = '252624005' or cqm.Code = '270427003' or cqm.Code = '270430005' or cqm.Code = '273643004' or cqm.Code = '274803000' or cqm.Code = '277404009' or cqm.Code = '278465006' or cqm.Code = '284015009' or cqm.Code = '30346009' or cqm.Code = '308335008' or cqm.Code = '32537008' or cqm.Code = '34651001' or cqm.Code = '35025007' or cqm.Code = '36228007' or cqm.Code = '370803007' or cqm.Code = '37894004' or cqm.Code = '385973000' or cqm.Code = '386372009' or cqm.Code = '390906007' or cqm.Code = '397745006' or cqm.Code = '405096004' or cqm.Code = '406547006' or cqm.Code = '408983003' or cqm.Code = '410155007' or cqm.Code = '410157004' or cqm.Code = '410158009' or cqm.Code = '410160006' or cqm.Code = '410170008' or cqm.Code = '428119001' or cqm.Code = '439708006' or cqm.Code = '439952009' or cqm.Code = '440524004' or cqm.Code = '46662001' or cqm.Code = '48423005' or cqm.Code = '50357006' or cqm.Code = '53555003' or cqm.Code = '54290001' or cqm.Code = '63547008' or cqm.Code = '66902005' or cqm.Code = '78318003' or cqm.Code = '83607001' or cqm.Code = '8411005' or cqm.Code = '86013001' or cqm.Code = '90526000' or cqm.Code = '91573000' or cqm.Code = '90791' or cqm.Code = '90792' or cqm.Code = '90832' or cqm.Code = '90834' or cqm.Code = '90837' or cqm.Code = '90839' or cqm.Code = '90957' or cqm.Code = '90958' or cqm.Code = '90959' or cqm.Code = '90960' or cqm.Code = '90962' or cqm.Code = '90965' or cqm.Code = '90966' or cqm.Code = '92002' or cqm.Code = '92004' or cqm.Code = '92012' or cqm.Code = '92014' or cqm.Code = '92507' or cqm.Code = '92508' or cqm.Code = '92526' or cqm.Code = '92541' or cqm.Code = '92542' or cqm.Code = '92543' or cqm.Code = '92544' or cqm.Code = '92545' or cqm.Code = '92547' or cqm.Code = '92548' or cqm.Code = '92557' or cqm.Code = '92567' or cqm.Code = '92568' or cqm.Code = '92570' or cqm.Code = '92585' or cqm.Code = '92588' or cqm.Code = '92626' or cqm.Code = '96116' or cqm.Code = '96150' or cqm.Code = '96151' or cqm.Code = '96152' or cqm.Code = '97001' or cqm.Code = '97002' or cqm.Code = '97003' or cqm.Code = '97004' or cqm.Code = '97110' or cqm.Code = '97140' or cqm.Code = '97532' or cqm.Code = '97802' or cqm.Code = '97803' or cqm.Code = '97804' or cqm.Code = '98960' or cqm.Code = '98961' or cqm.Code = '98962' or cqm.Code = '99201' or cqm.Code = '99202' or cqm.Code = '99203' or cqm.Code = '99204' or cqm.Code = '99205' or cqm.Code = '99212' or cqm.Code = '99213' or cqm.Code = '99214' or cqm.Code = '99215' or cqm.Code = '99324' or cqm.Code = '99325' or cqm.Code = '99326' or cqm.Code = '99327' or cqm.Code = '99328' or cqm.Code = '99334' or cqm.Code = '99335' or cqm.Code = '99336' or cqm.Code = '99337' or cqm.Code = '99341' or cqm.Code = '99342' or cqm.Code = '99343' or cqm.Code = '99344' or cqm.Code = '99345' or cqm.Code = '99347' or cqm.Code = '99348' or cqm.Code = '99349' or cqm.Code = '99350' or cqm.Code = '99495' or cqm.Code = '99496' \
                ) \
                and (cqm.DateOfVisit>= '"+fromDate+"') and (cqm.DateOfVisit<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
                and \
                ( \
                  cqm.Category = 'Visit Type' \
                ) \
              )";

          cqmGuideController.cqmCheck(sql1, function(err, record){

                if(record && record.length > 0)
                {

                  cqmGuideController.cqmCheck(sql2, function(err, record){

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

}
