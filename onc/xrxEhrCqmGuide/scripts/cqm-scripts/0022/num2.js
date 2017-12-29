var cqmGuideController = require("../../../controllers/cqmGuideController.js");
module.exports = function (patId, fromDate, toDate, dctId, fclId, callback) {

  var sql1 = "  select distinct med.PatId \
                from xrxehr_medication med \
                join xrxRxNormHighRisk HR on (HR.Code = isNull(med.RxNormCode, '')) \
                join xrxEhr_cqm cqm on (cqm.PatId = '"+patId+"') and (DATEDIFF(DAY, isNull(cqm.DateOfVisit, cqm.StartDate), med.persciptionDate) = 0) \
                where \
                  (med.[PersciptionDate] >= '"+fromDate+"') and (med.[PersciptionDate] <= '"+toDate+"') and  \
                  ( \
                  (cqm.Code = 'G0438') or (cqm.Code = 'G0439') or (cqm.Code = '99341') or (cqm.Code = '99342') or (cqm.Code = '99343') or \
                  (cqm.Code = '99344') or (cqm.Code = '99345') or (cqm.Code = '99347') or (cqm.Code = '99348') or (cqm.Code = '99349') or (cqm.Code = '99350') or \
                  (cqm.Code = '99201') or (cqm.Code = '99202') or (cqm.Code = '99203') or (cqm.Code = '99204') or (cqm.Code = '99205') or (cqm.Code = '99212') or  \
                  (cqm.Code = '99213') or (cqm.Code = '99214') or (cqm.Code = '99215') or (cqm.Code = '99395') or (cqm.Code = '99396') or (cqm.Code = '99397') or \
                  (cqm.Code = '99385') or (cqm.Code = '99386') or (cqm.Code = '99387') or \
                  (cqm.Code = '12843005') or (cqm.Code = '18170008') or (cqm.Code = '185349003') or (cqm.Code = '185463005') or \
                  (cqm.Code = '185465003') or (cqm.Code = '19681004') or (cqm.Code = '207195004') or (cqm.Code = '270427003') or \
                  (cqm.Code = '270430005') or (cqm.Code = '308335008') or (cqm.Code = '390906007') or (cqm.Code = '406547006') or \
                  (cqm.Code = '439708006')  or (cqm.Code = '87790002') or (cqm.Code = '90526000') \
                  ) \
                group by med.PatId \
                having (COUNT(med.PatId) >= 2)  \
              ";

        cqmGuideController.cqmCheck(sql1, function(err, record){
            if(record && record.length > 0)
            {
              callback({criteriaName: "Numerator2", isCriteriaQualify : true,  message : null});
            }
            else if(err) {
              callback({criteriaName: "Numerator2", isCriteriaQualify : false,  message : err});
            }
            else {
              callback({criteriaName: "Numerator2", isCriteriaQualify : false,  message : "High Risk Medications for the Elderly (Count >= 2)."});
            }
        });
}
