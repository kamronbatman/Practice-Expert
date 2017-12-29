var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "select cqm.patid from xrxEhr_cqm cqm \
              where \
              ( \
              	cqm.Code = 'G0202' or cqm.Code = 'G0204' or cqm.Code = 'G0206' or cqm.Code = '24604-1' or cqm.Code = '24605-8' or cqm.Code = '24606-6' or cqm.Code = '24610-8' or cqm.Code = '26175-0' or cqm.Code = '26176-8' or cqm.Code = '26177-6' or cqm.Code = '26287-3' or cqm.Code = '26289-9' or cqm.Code = '26291-5' or cqm.Code = '26346-7' or cqm.Code = '26347-5' or cqm.Code = '26348-3' or cqm.Code = '26349-1' or cqm.Code = '26350-9' or cqm.Code = '26351-7' or cqm.Code = '36319-2' or cqm.Code = '36625-2' or cqm.Code = '36626-0' or cqm.Code = '36627-8' or cqm.Code = '36642-7' or cqm.Code = '36962-9' or cqm.Code = '37005-6' or cqm.Code = '37006-4' or cqm.Code = '37016-3' or cqm.Code = '37017-1' or cqm.Code = '37028-8' or cqm.Code = '37029-6' or cqm.Code = '37030-4' or cqm.Code = '37037-9' or cqm.Code = '37038-7' or cqm.Code = '37052-8' or cqm.Code = '37053-6' or cqm.Code = '37539-4' or cqm.Code = '37542-8' or cqm.Code = '37543-6' or cqm.Code = '37551-9' or cqm.Code = '37552-7' or cqm.Code = '37553-5' or cqm.Code = '37554-3' or cqm.Code = '37768-9' or cqm.Code = '37769-7' or cqm.Code = '37770-5' or cqm.Code = '37771-3' or cqm.Code = '37772-1' or cqm.Code = '37773-9' or cqm.Code = '37774-7' or cqm.Code = '37775-4' or cqm.Code = '38067-5' or cqm.Code = '38070-9' or cqm.Code = '38071-7' or cqm.Code = '38072-5' or cqm.Code = '38090-7' or cqm.Code = '38091-5' or cqm.Code = '38807-4' or cqm.Code = '38820-7' or cqm.Code = '38854-6' or cqm.Code = '38855-3' or cqm.Code = '39150-8' or cqm.Code = '39152-4' or cqm.Code = '39153-2' or cqm.Code = '39154-0' or cqm.Code = '42168-5' or cqm.Code = '42169-3' or cqm.Code = '42174-3' or cqm.Code = '42415-0' or cqm.Code = '42416-8' or cqm.Code = '46335-6' or cqm.Code = '46336-4' or cqm.Code = '46337-2' or cqm.Code = '46338-0' or cqm.Code = '46339-8' or cqm.Code = '46342-2' or cqm.Code = '46350-5' or cqm.Code = '46351-3' or cqm.Code = '46354-7' or cqm.Code = '46355-4' or cqm.Code = '46356-2' or cqm.Code = '46380-2' or cqm.Code = '48475-8' or cqm.Code = '48492-3' or cqm.Code = '69150-1' or cqm.Code = '69251-7' or cqm.Code = '69259-0' \
              	or cqm.Code = 'V76.10' or cqm.Code =  'Z12.39' \
              ) \
              and \
              ( \
              	cqm.StopDate is not null \
              	and \
              	cqm.StopDate  >= dateadd(month, -12 , '"+fromDate+"') \
              	and \
              	cqm.StopDate <= '"+toDate+"' \
              ) \
              and  (isNull(cqm.FclId, '') = case when ('"+fclId+"' = '')  then isNull(cqm.FclId, '') else '"+fclId+"' end) and  (isNull(cqm.DctId, '') = case when ('"+dctId+"' = '')  then isNull(cqm.DctId, '') else '"+dctId+"' end) \
              and (PatId = '"+patId+"') \
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
              callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Mammogram."});
            }
        });
}
