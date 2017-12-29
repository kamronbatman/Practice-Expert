var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

    var sql1 = "select cqm.PatId \
                from xrxEhr_CQM cqm \
                where \
                ( \
                  (PatId = '"+patId+"') \
                  and \
                  ( \
                    (cqm.Flag is null) \
                    and \
                    ( \
                      cqm.Code = '13217-5' or cqm.Code = '13218-3' or cqm.Code = '13219-1' or cqm.Code = '13220-9' or cqm.Code = '13221-7' or cqm.Code = '14199-4' or cqm.Code = '14200-0' or cqm.Code = '14201-8' or cqm.Code = '14202-6' or cqm.Code = '14203-4' or cqm.Code = '14204-2' or cqm.Code = '14461-8' or cqm.Code = '14462-6' or cqm.Code = '14463-4' or cqm.Code = '14464-2' or cqm.Code = '14465-9' or cqm.Code = '14467-5' or cqm.Code = '14468-3' or cqm.Code = '14469-1' or cqm.Code = '14470-9' or cqm.Code = '14471-7' or cqm.Code = '14472-5' or cqm.Code = '14474-1' or cqm.Code = '14507-8' or cqm.Code = '14508-6' or cqm.Code = '14509-4' or cqm.Code = '14510-2' or cqm.Code = '14511-0' or cqm.Code = '14513-6' or cqm.Code = '16594-4' or cqm.Code = '16595-1' or cqm.Code = '16596-9' or cqm.Code = '16597-7' or cqm.Code = '16598-5' or cqm.Code = '16599-3' or cqm.Code = '16600-9' or cqm.Code = '16601-7' or cqm.Code = '18490-3' or cqm.Code = '18491-1' or cqm.Code = '18492-9' or cqm.Code = '21187-0' or cqm.Code = '21188-8' or cqm.Code = '21189-6' or cqm.Code = '21190-4' or cqm.Code = '21191-2' or cqm.Code = '21192-0' or cqm.Code = '21613-5' or cqm.Code = '22187-9' or cqm.Code = '22188-7' or cqm.Code = '22189-5' or cqm.Code = '22190-3' or cqm.Code = '22191-1' or cqm.Code = '22192-9' or cqm.Code = '22193-7' or cqm.Code = '22194-5' or cqm.Code = '22195-2' or cqm.Code = '22196-0' or cqm.Code = '22197-8' or cqm.Code = '22198-6' or cqm.Code = '22199-4' or cqm.Code = '22200-0' or cqm.Code = '22201-8' or cqm.Code = '22202-6' or cqm.Code = '23838-6' or cqm.Code = '26626-2' or cqm.Code = '26663-5' or cqm.Code = '26664-3' or cqm.Code = '26665-0' or cqm.Code = '26666-8' or cqm.Code = '26667-6' or cqm.Code = '26668-4' or cqm.Code = '26715-3' or cqm.Code = '27167-6' or cqm.Code = '27185-8' or cqm.Code = '27368-0' or cqm.Code = '27370-6' or cqm.Code = '27371-4' or cqm.Code = '28556-9' or cqm.Code = '28557-7' or cqm.Code = '28558-5' or cqm.Code = '30204-2' or cqm.Code = '31293-4' or cqm.Code = '31294-2' or cqm.Code = '31295-9' or cqm.Code = '31296-7' or cqm.Code = '31297-5' or cqm.Code = '31298-3' or cqm.Code = '31768-5' or cqm.Code = '31769-3' or cqm.Code = '31770-1' or cqm.Code = '31771-9' or cqm.Code = '31772-7' or cqm.Code = '31774-3' or cqm.Code = '31775-0' or cqm.Code = '31776-8' or cqm.Code = '31777-6' or cqm.Code = '32005-1' or cqm.Code = '32006-9' or cqm.Code = '32007-7' or cqm.Code = '33574-5' or cqm.Code = '33575-2' or cqm.Code = '33604-0' or cqm.Code = '33605-7' or cqm.Code = '34709-6' or cqm.Code = '34710-4' or cqm.Code = '36902-5' or cqm.Code = '36903-3' or cqm.Code = '38469-3' or cqm.Code = '40710-6' or cqm.Code = '40854-2' or cqm.Code = '40855-9' or cqm.Code = '40856-7' or cqm.Code = '41157-9' or cqm.Code = '42931-6' or cqm.Code = '43058-7' or cqm.Code = '43059-5' or cqm.Code = '43060-3' or cqm.Code = '43061-1' or cqm.Code = '43062-9' or cqm.Code = '43173-4' or cqm.Code = '43174-2' or cqm.Code = '43175-9' or cqm.Code = '43304-5' or cqm.Code = '43355-7' or cqm.Code = '43356-5' or cqm.Code = '43357-3' or cqm.Code = '43404-3' or cqm.Code = '43405-0' or cqm.Code = '43406-8' or cqm.Code = '43848-1' or cqm.Code = '44005-7' or cqm.Code = '44079-2' or cqm.Code = '44806-8' or cqm.Code = '44807-6' or cqm.Code = '44983-5' or cqm.Code = '44984-3' or cqm.Code = '44985-0' or cqm.Code = '44986-8' or cqm.Code = '44987-6' or cqm.Code = '44988-4' or cqm.Code = '44989-2' or cqm.Code = '44990-0' or cqm.Code = '44991-8' or cqm.Code = '44992-6' or cqm.Code = '44993-4' or cqm.Code = '44994-2' or cqm.Code = '44995-9' or cqm.Code = '44996-7' or cqm.Code = '44997-5' or cqm.Code = '44998-3' or cqm.Code = '44999-1' or cqm.Code = '45000-7' or cqm.Code = '45001-5' or cqm.Code = '45002-3' or cqm.Code = '45003-1' or cqm.Code = '45004-9' or cqm.Code = '45005-6' or cqm.Code = '45006-4' or cqm.Code = '45007-2' or cqm.Code = '45008-0' or cqm.Code = '45009-8' or cqm.Code = '45067-6' or cqm.Code = '45068-4' or cqm.Code = '45069-2' or cqm.Code = '45070-0' or cqm.Code = '45072-6' or cqm.Code = '45073-4' or cqm.Code = '45074-2' or cqm.Code = '45075-9' or cqm.Code = '45076-7' or cqm.Code = '45078-3' or cqm.Code = '45080-9' or cqm.Code = '45084-1' or cqm.Code = '45085-8' or cqm.Code = '45086-6' or cqm.Code = '45089-0' or cqm.Code = '45090-8' or cqm.Code = '45091-6' or cqm.Code = '45092-4' or cqm.Code = '45093-2' or cqm.Code = '45094-0' or cqm.Code = '45095-7' or cqm.Code = '45096-5' or cqm.Code = '45130-2' or cqm.Code = '45135-1' or cqm.Code = '46176-4' or cqm.Code = '46177-2' or cqm.Code = '46178-0' or cqm.Code = '47211-8' or cqm.Code = '47212-6' or cqm.Code = '47234-0' or cqm.Code = '47362-9' or cqm.Code = '49096-1' or cqm.Code = '4993-2' or cqm.Code = '50387-0' or cqm.Code = '5087-2' or cqm.Code = '5088-0' or cqm.Code = '5089-8' or cqm.Code = '5090-6' or cqm.Code = '51734-2' or cqm.Code = '53925-4' or cqm.Code = '53926-2' or cqm.Code = '57287-5' or cqm.Code = '57288-3' or cqm.Code = '6349-5' or cqm.Code = '6350-3' or cqm.Code = '6351-1' or cqm.Code = '6352-9' or cqm.Code = '6353-7' or cqm.Code = '6354-5' or cqm.Code = '6355-2' or cqm.Code = '6356-0' or cqm.Code = '6357-8' or cqm.Code = '64017-7' or cqm.Code = '6918-7' or cqm.Code = '6919-5' or cqm.Code = '6920-3' or cqm.Code = '7824-6' \
                      or cqm.Code = 'V74.5' or cqm.Code = 'Z11.3' \
                    ) \
                  ) \
                ) \
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
                callback({criteriaName: "Numerator", isCriteriaQualify : false,  message : "Laboratory Test, Result: Chlamydia Screening (result)."});
              }
      });


};
