var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select (cqm.patid) from xrxEhr_cqm cqm \
              where \
              (cqm.PatId = '"+patId+"') \
              and \
              (cqm.Flag = 'MedicationDispensed') \
              and \
              ( \
	               cqm.Code = '1085805' or cqm.Code = '1148643' or cqm.Code = '1245270' or cqm.Code = '1245276' or cqm.Code = '1246288' or cqm.Code = '1246304' or cqm.Code = '1246314' or cqm.Code = '1246316' or cqm.Code = '197354' or cqm.Code = '197637' or cqm.Code = '197638' or cqm.Code = '197639' or cqm.Code = '198255' or cqm.Code = '198257' or cqm.Code = '198258' or cqm.Code = '198261' or cqm.Code = '198263' or cqm.Code = '198264' or cqm.Code = '198266' or cqm.Code = '198381' or cqm.Code = '199331' or cqm.Code = '199655' or cqm.Code = '199904' or cqm.Code = '200224' or cqm.Code = '237178' or cqm.Code = '241063' or cqm.Code = '242438' or cqm.Code = '243327' or cqm.Code = '245322' or cqm.Code = '247047' or cqm.Code = '248333' or cqm.Code = '249984' or cqm.Code = '252559' or cqm.Code = '308103' or cqm.Code = '308105' or cqm.Code = '308107' or cqm.Code = '308110' or cqm.Code = '308113' or cqm.Code = '308114' or cqm.Code = '308119' or cqm.Code = '308120' or cqm.Code = '310045' or cqm.Code = '310616' or cqm.Code = '310617' or cqm.Code = '310658' or cqm.Code = '311759' or cqm.Code = '313263' or cqm.Code = '313264' or cqm.Code = '313271' or cqm.Code = '313272' or cqm.Code = '313278' or cqm.Code = '313284' or cqm.Code = '313285' or cqm.Code = '313291' or cqm.Code = '313297' or cqm.Code = '313298' or cqm.Code = '313302' or cqm.Code = '313304' or cqm.Code = '313306' or cqm.Code = '313310' or cqm.Code = '313758' or cqm.Code = '313794' or cqm.Code = '314240' or cqm.Code = '314241' or cqm.Code = '315111' or cqm.Code = '317769' or cqm.Code = '317831' or cqm.Code = '346574' or cqm.Code = '348472' or cqm.Code = '349094' or cqm.Code = '349629' or cqm.Code = '351109' or cqm.Code = '351246' or cqm.Code = '359468' or cqm.Code = '403866' or cqm.Code = '409732' or cqm.Code = '411090' or cqm.Code = '421824' or cqm.Code = '422737' or cqm.Code = '425539' or cqm.Code = '428923' or cqm.Code = '428925' or cqm.Code = '428980' or cqm.Code = '431807' or cqm.Code = '434109' or cqm.Code = '434226' or cqm.Code = '562480' or cqm.Code = '597829' or cqm.Code = '617270' or cqm.Code = '692475' or cqm.Code = '692477' or cqm.Code = '701712' or cqm.Code = '706550' or cqm.Code = '730834' or cqm.Code = '746803' or cqm.Code = '746810' or cqm.Code = '746812' or cqm.Code = '746814' or cqm.Code = '746821' or cqm.Code = '746832' or cqm.Code = '752376' or cqm.Code = '755737' or cqm.Code = '755738' or cqm.Code = '755739' or cqm.Code = '756248' or cqm.Code = '756306' or cqm.Code = '756346' or cqm.Code = '756347' or cqm.Code = '790278' or cqm.Code = '790283' or cqm.Code = '828927' or cqm.Code = '831246' or cqm.Code = '831257' or cqm.Code = '831261' or cqm.Code = '831263' or cqm.Code = '895994' or cqm.Code = '895999' or cqm.Code = '896004' or cqm.Code = '896018' or cqm.Code = '896021' or cqm.Code = '896025' or cqm.Code = '896028' or cqm.Code = '896030' or cqm.Code = '896161' or cqm.Code = '896184' or cqm.Code = '896186' or cqm.Code = '896192' or cqm.Code = '896209' or cqm.Code = '896218' or cqm.Code = '896228' or cqm.Code = '896231' or cqm.Code = '896236' or cqm.Code = '896239' or cqm.Code = '896244' or cqm.Code = '896267' or cqm.Code = '896272' or cqm.Code = '896300' or cqm.Code = '897296' or cqm.Code = '966522' or cqm.Code = '966525' or cqm.Code = '966527' or cqm.Code = '966536' or cqm.Code = '966540' or cqm.Code = '966548' or cqm.Code = '966564' or cqm.Code = '966635' or cqm.Code = '966675' \
              ) \
              and (isNull (cqm.StartDate, cqm.DateofVisit)>='"+fromDate+"') and (isNull (cqm.StartDate, cqm.DateofVisit)<= '"+toDate+"') and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              ";

        cqmGuideController.cqmCheck(sql1, function(err, record){
            if(record && record.length > 0)
            {
              callback({criteriaName: "Numerator", isCriteriaQualify : true,  message : null});
            }
            else if(err) {
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : err});
            }
            else {
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Medication, Dispensed: Preferred Asthma Therapy."});
            }
        });

}
