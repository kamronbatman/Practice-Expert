var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select PatId from xrxPat pat \
               where ( \
                 (pat.Birthdate is not null) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) >= 18) \
                 and ((select dbo.xrxGetPatAge(pat.Birthdate,null, '"+fromDate+"')) < 75) \
                 and (PatId = '"+patId+"') \
               )";

 var sql2 = "select cqm.PatId \
             from xrxEhr_CQM cqm \
             where (PatId = '"+patId+"') and \
             ( \
            	(	 \
            		cqm.patId in  \
            		( \
            			select PatId from xrxEhr_CQM cqm where \
            			( \
            				(	 \
            					cqm.Code = 'E10.10' or cqm.Code = 'E10.11' or cqm.Code = 'E10.21' or cqm.Code = 'E10.22' or cqm.Code = 'E10.29' or cqm.Code = 'E10.311' or cqm.Code = 'E10.319' or cqm.Code = 'E10.321' or cqm.Code = 'E10.329' or cqm.Code = 'E10.331' or cqm.Code = 'E10.339' or cqm.Code = 'E10.341' or cqm.Code = 'E10.349' or cqm.Code = 'E10.351' or cqm.Code = 'E10.359' or cqm.Code = 'E10.36' or cqm.Code = 'E10.39' or cqm.Code = 'E10.40' or cqm.Code = 'E10.41' or cqm.Code = 'E10.42' or cqm.Code = 'E10.43' or cqm.Code = 'E10.44' or cqm.Code = 'E10.49' or cqm.Code = 'E10.51' or cqm.Code = 'E10.52' or cqm.Code = 'E10.59' or cqm.Code = 'E10.610' or cqm.Code = 'E10.618' or cqm.Code = 'E10.620' or cqm.Code = 'E10.621' or cqm.Code = 'E10.622' or cqm.Code = 'E10.628' or cqm.Code = 'E10.630' or cqm.Code = 'E10.638' or cqm.Code = 'E10.641' or cqm.Code = 'E10.649' or cqm.Code = 'E10.65' or cqm.Code = 'E10.69' or cqm.Code = 'E10.8' or cqm.Code = 'E10.9' or cqm.Code = 'E11.00' or cqm.Code = 'E11.01' or cqm.Code = 'E11.21' or cqm.Code = 'E11.22' or cqm.Code = 'E11.29' or cqm.Code = 'E11.311' or cqm.Code = 'E11.319' or cqm.Code = 'E11.321' or cqm.Code = 'E11.329' or cqm.Code = 'E11.331' or cqm.Code = 'E11.339' or cqm.Code = 'E11.341' or cqm.Code = 'E11.349' or cqm.Code = 'E11.351' or cqm.Code = 'E11.359' or cqm.Code = 'E11.36' or cqm.Code = 'E11.39' or cqm.Code = 'E11.40' or cqm.Code = 'E11.41' or cqm.Code = 'E11.42' or cqm.Code = 'E11.43' or cqm.Code = 'E11.44' or cqm.Code = 'E11.49' or cqm.Code = 'E11.51' or cqm.Code = 'E11.52' or cqm.Code = 'E11.59' or cqm.Code = 'E11.610' or cqm.Code = 'E11.618' or cqm.Code = 'E11.620' or cqm.Code = 'E11.621' or cqm.Code = 'E11.622' or cqm.Code = 'E11.628' or cqm.Code = 'E11.630' or cqm.Code = 'E11.638' or cqm.Code = 'E11.641' or cqm.Code = 'E11.649' or cqm.Code = 'E11.65' or cqm.Code = 'E11.69' or cqm.Code = 'E11.8' or cqm.Code = 'E11.9' or cqm.Code = 'O24.011' or cqm.Code = 'O24.012' or cqm.Code = 'O24.013' or cqm.Code = 'O24.019' or cqm.Code = 'O24.02' or cqm.Code = 'O24.03' or cqm.Code = 'O24.111' or cqm.Code = 'O24.112' or cqm.Code = 'O24.113' or cqm.Code = 'O24.119' or cqm.Code = 'O24.12' or cqm.Code = 'O24.13' or cqm.Code = '250.00' or cqm.Code = '250.01' or cqm.Code = '250.02' or cqm.Code = '250.03' or cqm.Code = '250.10' or cqm.Code = '250.11' or cqm.Code = '250.12' or cqm.Code = '250.13' or cqm.Code = '250.20' or cqm.Code = '250.21' or cqm.Code = '250.22' or cqm.Code = '250.23' or cqm.Code = '250.30' or cqm.Code = '250.31' or cqm.Code = '250.32' or cqm.Code = '250.33' or cqm.Code = '250.41' or cqm.Code = '250.42' or cqm.Code = '250.43' or cqm.Code = '250.50' or cqm.Code = '250.51' or cqm.Code = '250.52' or cqm.Code = '250.53' or cqm.Code = '250.60' or cqm.Code = '250.61' or cqm.Code = '250.62' or cqm.Code = '250.63' or cqm.Code = '250.70' or cqm.Code = '250.71' or cqm.Code = '250.72' or cqm.Code = '250.73' or cqm.Code = '250.80' or cqm.Code = '250.81' or cqm.Code = '250.82' or cqm.Code = '250.83' or cqm.Code = '250.90' or cqm.Code = '250.91' or cqm.Code = '250.92' or cqm.Code = '250.93' or cqm.Code = '648.01' or cqm.Code = '648.02' or cqm.Code = '648.03' or cqm.Code = '648.04' or cqm.Code = '190330002' or cqm.Code = '190331003' or cqm.Code = '190368000' or cqm.Code = '190369008' or cqm.Code = '190372001' or cqm.Code = '190389009' or cqm.Code = '190390000' or cqm.Code = '199223000' or cqm.Code = '199225007' or cqm.Code = '199226008' or cqm.Code = '199227004' or cqm.Code = '199228009' or cqm.Code = '199229001' or cqm.Code = '199230006' or cqm.Code = '23045005' or cqm.Code = '237599002' or cqm.Code = '237618001' or cqm.Code = '237626009' or cqm.Code = '237627000' or cqm.Code = '28032008' or cqm.Code = '313435000' or cqm.Code = '313436004' or cqm.Code = '314771006' or cqm.Code = '314772004' or cqm.Code = '314893005' or cqm.Code = '314894004' or cqm.Code = '314902007' or cqm.Code = '314903002' or cqm.Code = '314904008' or cqm.Code = '359642000' or cqm.Code = '359939009' or cqm.Code = '44054006' or cqm.Code = '46635009' or cqm.Code = '4783006' or cqm.Code = '75682002' or cqm.Code = '76751001' or cqm.Code = '81531005' or cqm.Code = '9859006' \
            				) \
            				and (cqm.StopDate >= '"+fromDate+"' or cqm.StopDate is null) and (isNull (cqm.StartDate, cqm.DateofVisit) <= '"+toDate+"')  and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) 				 \
            			) \
            		) \
            	) \
            	and \
            	( \
            		cqm.patId in  \
            		( \
            			select PatId from xrxEhr_CQM cqm where \
            			( \
            				( \
            					cqm.Code='99201' or cqm.Code='99202' or cqm.Code='99203' or cqm.Code='99204' or cqm.Code='99205' or cqm.Code='99212' or cqm.Code='99213' or cqm.Code='99214' or cqm.Code='99215' \
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
            				and (cqm.DateOfVisit>='"+fromDate+"') and (cqm.DateOfVisit<='"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
            			) \
            		)	 \
            	) \
             )";

       cqmGuideController.cqmCheck(sql1, function(err, record){

           if(record && record.length > 0){

                 cqmGuideController.cqmCheck(sql2, function(err, record){
                   if(record && record.length > 0){
                     callback({criteriaName: "Denominator", isCriteriaQualify : true,  message : null});
                   }
                   else if(err){
                     callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
                   }
                   else{
                     callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : "Encounter type is not one of the following office visit, face to face visit."});
                   }
                 });
           }
           else if(err){
               callback({criteriaName: "Denominator", isCriteriaQualify : false,  message : err});
           }
           else{
               callback({criteriaName: "Denominator", isCriteriaQualify : false, message : null});
           }
       });
};
