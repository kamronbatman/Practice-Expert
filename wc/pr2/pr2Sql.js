var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath+"/xrx_modules/xrx-str");
var cmGlb = remote.getGlobal('cmGlb');


exports.pr2Get = function (patId, dateOfExam, callback) {

    sp = "xrxPr2GetData";

    parameters = [
        {parameter: 'PatId', type: 'VarChar', value: patId},
        {parameter: 'DateOfExam', type: 'SmallDateTime', value: dateOfExam}
    ];

    dbhelper.storeProcedure(sp, parameters, function (err, record) {
        if (err) {
            console.log(err);
            callback('Error: ' + err, record);
        }
        else {
            callback(null , record);
        }
    });
};

exports.pr2Save = function (data, callback){

          if (data.RECNO.value) {

              var sqlupdate =
                  "update xrxPr2 set " +
                      " patId = " + xrxStr.strQuoteComma(data.PATID.value) +
                      " DateOfExam = " + xrxStr.datQuoteComma(data.DATEOFEXAM.value) +
                      " DctId = " + xrxStr.strQuoteComma(data.DCTID.value) +
                      " FclId = " + xrxStr.strQuoteComma(data.FCLID.value) +
                      " PeriodicRep = " + xrxStr.bolQuoteComma(data.PERIODICREP.value) +
                      " ChangeInTrtPlan = " + xrxStr.bolQuoteComma(data.CHANGEINTRTPLAN.value) +
                      " Discharged = " + xrxStr.bolQuoteComma(data.DISCHARGED.value) +
                      " ChangeInWrkStatus = " + xrxStr.bolQuoteComma(data.CHANGEINWRKSTATUS.value) +
                      " NeedRefOrCons = " + xrxStr.bolQuoteComma(data.NEEDREFORCONS.value) +
                      " ChangeInPatCond = " + xrxStr.bolQuoteComma(data.CHANGEINPATCOND.value) +
                      " NeedSrgHosp = " + xrxStr.bolQuoteComma(data.NEEDSRGHOSP.value) +
                      " IsInfoRequested = " + xrxStr.bolQuoteComma(data.ISINFOREQUESTED.value) +
                      " InfoRequestedBy = " + xrxStr.strQuoteComma(data.INFOREQUESTEDBY.value) +
                      " IsOther = " + xrxStr.bolQuoteComma(data.ISOTHER.value) +
                      " Other = " + xrxStr.strQuoteComma(data.OTHER.value) +
                      " RemainOffWorkUntil = " + xrxStr.bolQuoteComma(data.REMAINOFFWORKUNTIL.value) +
                      " RemainOffWorkUntilDate = " + xrxStr.datQuoteComma(data.REMAINOFFWORKUNTILDATE.value) +
                      " ReturnOnModifWork = " + xrxStr.bolQuoteComma(data.RETURNONMODIFWORK.value) +
                      " ReturnOnModifWorkDate = " + xrxStr.datQuoteComma(data.RETURNONMODIFWORKDATE.value) +
                      " ReturnToUsualWork = " + xrxStr.bolQuoteComma(data.RETURNTOUSUALWORK.value) +
                      " ReturnToUsualWorkDate = " + xrxStr.datQuoteComma(data.RETURNTOUSUALWORKDATE.value) +
                      " NextVisit = " + xrxStr.datQuoteComma(data.NEXTVISIT.value) +
                      " LimitsRestrictions = " + xrxStr.strQuoteComma(data.LIMITSRESTRICTIONS.value) +
                      " LimitsRestrictions1 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS1.value) +
                      " LimitsRestrictions2 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS2.value) +
                      " LimitsRestrictions2lbs = " + xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS2LBS.value) +
                      " LimitsRestrictions3 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS3.value) +
                      " LimitsRestrictions4 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS4.value) +
                      " LimitsRestrictions4gt = " + xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4GT.value) +
                      " LimitsRestrictions4ex = " + xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4EX.value) +
                      " LimitsRestrictions5 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS5.value) +
                      " LimitsRestrictions5Pos = " + xrxStr.strQuoteComma(data.LIMITSRESTRICTIONS5POS.value) +
                      " LimitsRestrictions6 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS6.value) +
                      " LimitsRestrictions7 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS7.value) +
                      " LimitsRestrictions8 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS8.value) +
                      " LimitsRestrictions4Hrs = " + xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4HRS.value) +
                      " LimitsRestrictions5PosVal = " + xrxStr.strQuoteComma(data.LIMITSRESTRICTIONS5POSVAL.value) +
                      " EmpContacted = " + xrxStr.strQuoteComma(data.EMPCONTACTED.value) +
                      " EmpContactDate = " + xrxStr.datQuoteComma(data.EMPCONTACTDATE.value) +
                      " RequestForAuthorization = " + xrxStr.bolQuoteComma(data.REQUESTFORAUTHORIZATION.value) +
                      " isDmeSubjectiveComplaints = " + xrxStr.bolQuoteComma(data.ISDMESUBJECTIVECOMPLAINTS.value) +
                      " isDmeObjectiveFindings = " + xrxStr.bolQuoteComma(data.ISDMEOBJECTIVEFINDINGS.value) +
                      " isDmeTreatmentPlan = " + xrxStr.bolQuoteComma(data.ISDMETREATMENTPLAN.value) +
                      " SubjectiveComplaints = " + xrxStr.strQuoteComma(data.SUBJECTIVECOMPLAINTS.value) +
                      " ObjectiveFindings = " + xrxStr.strQuoteComma(data.OBJECTIVEFINDINGS.value) +
                      " TreatmentPlan = " + xrxStr.strQuoteComma(data.TREATMENTPLAN.value) +
                      " EntryDate = " + xrxStr.datQuoteComma(data.ENTRYDATE.value) +
                      " UserId = " + xrxStr.strQuote(data.USERID.value) +
                  "where RecNo = " + xrxStr.strQuote(data.RECNO.value) +
                  " update xrxWrk  set InjDate1 = "+ xrxStr.datQuoteComma(data.INJDATE.value) +" ClaimNo = "+xrxStr.strQuote(data.CLAIMNO.value)+" where patId =  "+xrxStr.strQuote(data.PATID.value)+"  ";

                 //console.log(sqlupdate);



              dbhelper.query(sqlupdate, function (err, record) {
                  if (err) {
                      callback('Error: ' + err, false);
                  }
                  else {
                      callback(null, true);
                  }
              });
          }
          else {
              var sqlinsert = "insert into xrxPr2(" +
                  "patId, " +
                  "DateOfExam, " +
                  "DctId, " +
                  "FclId, " +
                  "PeriodicRep, " +
                  "ChangeInTrtPlan, " +
                  "Discharged, " +
                  "ChangeInWrkStatus, " +
                  "NeedRefOrCons, " +
                  "ChangeInPatCond, " +
                  "NeedSrgHosp, " +
                  "IsInfoRequested, " +
                  "InfoRequestedBy, " +
                  "IsOther, " +
                  "Other, " +
                  "RemainOffWorkUntil, " +
                  "RemainOffWorkUntilDate, " +
                  "ReturnOnModifWork, " +
                  "ReturnOnModifWorkDate, " +
                  "ReturnToUsualWork, " +
                  "ReturnToUsualWorkDate, " +
                  "NextVisit, " +
                  "LimitsRestrictions, " +
                  "LimitsRestrictions1, " +
                  "LimitsRestrictions2, " +
                  "LimitsRestrictions2lbs, " +
                  "LimitsRestrictions3, " +
                  "LimitsRestrictions4, " +
                  "LimitsRestrictions4gt, " +
                  "LimitsRestrictions4ex, " +
                  "LimitsRestrictions5, " +
                  "LimitsRestrictions5Pos, " +
                  "LimitsRestrictions6, " +
                  "LimitsRestrictions7, " +
                  "LimitsRestrictions8, " +
                  "LimitsRestrictions4Hrs, " +
                  "LimitsRestrictions5PosVal, " +
                  "EmpContacted, " +
                  "EmpContactDate, " +
                  "RequestForAuthorization, " +
                  "isDmeSubjectiveComplaints, " +
                  "isDmeObjectiveFindings, " +
                  "isDmeTreatmentPlan, " +
                  "SubjectiveComplaints, " +
                  "ObjectiveFindings, " +
                  "TreatmentPlan, " +
                  "EntryDate, " +
                  "UserId " +
                   ") " +
                  " values(" +
                      xrxStr.strQuoteComma(data.PATID.value) +
                      xrxStr.datQuoteComma(data.DATEOFEXAM.value) +
                      xrxStr.strQuoteComma(data.DCTID.value) +
                      xrxStr.strQuoteComma(data.FCLID.value) +
                      xrxStr.bolQuoteComma(data.PERIODICREP.value) +
                      xrxStr.bolQuoteComma(data.CHANGEINTRTPLAN.value) +
                      xrxStr.bolQuoteComma(data.DISCHARGED.value) +
                      xrxStr.bolQuoteComma(data.CHANGEINWRKSTATUS.value) +
                      xrxStr.bolQuoteComma(data.NEEDREFORCONS.value) +
                      xrxStr.bolQuoteComma(data.CHANGEINPATCOND.value) +
                      xrxStr.bolQuoteComma(data.NEEDSRGHOSP.value) +
                      xrxStr.bolQuoteComma(data.ISINFOREQUESTED.value) +
                      xrxStr.strQuoteComma(data.INFOREQUESTEDBY.value) +
                      xrxStr.bolQuoteComma(data.ISOTHER.value) +
                      xrxStr.strQuoteComma(data.OTHER.value) +
                      xrxStr.bolQuoteComma(data.REMAINOFFWORKUNTIL.value) +
                      xrxStr.datQuoteComma(data.REMAINOFFWORKUNTILDATE.value) +
                      xrxStr.bolQuoteComma(data.RETURNONMODIFWORK.value) +
                      xrxStr.datQuoteComma(data.RETURNONMODIFWORKDATE.value) +
                      xrxStr.bolQuoteComma(data.RETURNTOUSUALWORK.value) +
                      xrxStr.datQuoteComma(data.RETURNTOUSUALWORKDATE.value) +
                      xrxStr.datQuoteComma(data.NEXTVISIT.value) +
                      xrxStr.strQuoteComma(data.LIMITSRESTRICTIONS.value) +
                      xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS1.value) +
                      xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS2.value) +
                      xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS2LBS.value) +
                      xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS3.value) +
                      xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS4.value) +
                      xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4GT.value) +
                      xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4EX.value) +
                      xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS5.value) +
                      xrxStr.strQuoteComma(data.LIMITSRESTRICTIONS5POS.value) +
                      xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS6.value) +
                      xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS7.value) +
                      xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS8.value) +
                      xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4HRS.value) +
                      xrxStr.strQuoteComma(data.LIMITSRESTRICTIONS5POSVAL.value) +
                      xrxStr.strQuoteComma(data.EMPCONTACTED.value) +
                      xrxStr.datQuoteComma(data.EMPCONTACTDATE.value) +
                      xrxStr.bolQuoteComma(data.REQUESTFORAUTHORIZATION.value) +
                      xrxStr.bolQuoteComma(data.ISDMESUBJECTIVECOMPLAINTS.value) +
                      xrxStr.bolQuoteComma(data.ISDMEOBJECTIVEFINDINGS.value) +
                      xrxStr.bolQuoteComma(data.ISDMETREATMENTPLAN.value) +
                      xrxStr.strQuoteComma(data.SUBJECTIVECOMPLAINTS.value) +
                      xrxStr.strQuoteComma(data.OBJECTIVEFINDINGS.value) +
                      xrxStr.strQuoteComma(data.TREATMENTPLAN.value) +
                      xrxStr.datQuoteComma(data.ENTRYDATE.value) +
                      xrxStr.strQuote(data.USERID.value) +
                  ")" + " update xrxWrk  set InjDate1 = "+ xrxStr.datQuoteComma(data.INJDATE.value) +" ClaimNo = "+xrxStr.strQuote(data.CLAIMNO.value)+" where patId =  "+xrxStr.strQuote(data.PATID.value)+"  ";

              //console.log(sqlinsert);
              dbhelper.query(sqlinsert, function (err, record) {
                  if (err) {
                      callback('Error: ' + err, false);
                  }
                  else {
                      callback(null, true);
                  }
              });
          }
};

exports.pr2Print = function (para, callback) {

    var child = require('child_process').execFile;

    //Change this path
    var executablePath = cmGlb.mainFolder + "xrxRpCrystalReports.exe";
    //var executablePath = "c:\\calmed\\xrxReporting.exe";
    //var executablePath = "D:\\Calmed_NodeJs\\Supporting_Projects\\xrxRpCrystalReports\\bin\\Debug\\xrxRpCrystalReports";

    var reportParameters = {
       'CompanyName'  : para.COMPANYNAME,
       'ProviderName' : para.PROVIDERNAME,
       '@PatId' : para.PATID,
       '@DateOfExam' : para.DATEOFEXAM
    };
console.log(reportParameters);
    var reportParametersStr =  JSON.stringify(reportParameters);
    var parameters = [cmGlb.connectionDataSourceName, dbhelper.config.options.database, dbhelper.config.userName, dbhelper.config.password, "pr2" , para.TEMPLATE, cmGlb.mainFolder, reportParametersStr];

    child(executablePath, parameters, function(err, data) {
        //console.log(err)
        //console.log(data.toString());

        if(err) {
          //console.log(err);
          callback(err , null);
        }
        else {
          //console.log(data.toString());
          callback(null , true);
        }
    });

};

exports.xmlGetParam = function (callback) {

    var sql = "select XmlText from xrxParam where ParamName = 'Pr2'";

    dbhelper.query(sql, function (err, record) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null , record);
        }
    });
};

exports.xmlUpdateParam = function(xmlText, userId, callback) {

    var sql = "DELETE FROM xrxParam WHERE ParamName = 'Pr2';  INSERT INTO xrxParam (ParamName, XmlText, EntryDate, UserId) VALUES ('Pr2', '" + xmlText + "', GETDATE(), '" + userId + "');"
    //console.log(sql);
    dbhelper.query(sql, function (err, record) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, record);
        }
    });
}
