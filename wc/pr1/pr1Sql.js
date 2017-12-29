var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath+"/xrx_modules/xrx-str");
var cmGlb = remote.getGlobal('cmGlb');

exports.pr1Get = function (patId, callback) {

    var sqlPr1 = "select * from xrxPr1 where (PatId = '"+patId+"')";
    var sqlWrk = "select ClaimNo from xrxWrk where (PatId = '"+patId+"')";

    dbhelper.query(sqlPr1, function (err, record) {

        if (err) {
            console.log(err);
            callback('Error: ' + err, record);
        }
        else {

            if(record && record.length > 0)
            {
              callback(null , record);
            }
            else
            {
                  dbhelper.query(sqlWrk, function (err, record) {

                      if (err)
                      {
                          console.log(err);
                          callback('Error: ' + err, record);
                      }
                      else
                      {
                        callback(null , record);
                      }
                  });
            }

        }
    });
};

exports.xmlGetParam = function (callback) {

    var sql = "select XmlText from xrxParam where ParamName = 'Pr1'";

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

    var sql = "DELETE FROM xrxParam WHERE ParamName = 'Pr1';  INSERT INTO xrxParam (ParamName, XmlText, EntryDate, UserId) VALUES ('Pr1', '" + xmlText + "', GETDATE(), '" + userId + "');"
    ///console.log(sql);
    dbhelper.query(sql, function (err, record) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, record);
        }
    });
}

exports.pr1Save = function (data, callback){

      var sql = "";

      if (data.RECNO.value) {


        sql =
            "update  xrxPr1 set " +
            " PatId = " + xrxStr.strQuoteComma(data.PATID.value) +
            " DctId = " + xrxStr.strQuoteComma(data.DCTID.value) +
            " FclId = " + xrxStr.strQuoteComma(data.FCLID.value) +
            " JobYears = " + xrxStr.strQuoteComma(data.JOBYEARS.value) +
            " JobMonths = " + xrxStr.strQuoteComma(data.JOBMONTHS.value) +
            " MajorHand = " + xrxStr.strQuoteComma(data.MAJORHAND.value) +
            " F121 = " + xrxStr.strQuoteComma(data.F121.value) +
            " F122 = " + xrxStr.strQuoteComma(data.F122.value) +
            " F123 = " + xrxStr.strQuoteComma(data.F123.value) +
            " F131 = " + xrxStr.datQuoteComma(data.F131.value) +
            " F14 = " + xrxStr.datQuoteComma(data.F14.value) +
            " F151 = " + xrxStr.datQuoteComma(data.F151.value) +
            " F16 = " + xrxStr.strQuoteComma(data.F16.value) +
            " Allergies = " + xrxStr.strQuoteComma(data.ALLERGIES.value) +
            " F17 = " + xrxStr.strQuoteComma(data.F17.value) +
            " F18 = " + xrxStr.strQuoteComma(data.F18.value) +
            " F191 = " + xrxStr.strQuoteComma(data.F191.value) +
            " F192 = " + xrxStr.strQuoteComma(data.F192.value) +
            " F212 = " + xrxStr.strQuoteComma(data.F212.value) +
            " F222 = " + xrxStr.strQuoteComma(data.F222.value) +
            " F23 = " + xrxStr.strQuoteComma(data.F23.value) +
            " FirstAid = " + xrxStr.strQuoteComma(data.FIRSTAID.value) +
            " F20 = " + xrxStr.strQuoteComma(data.F20.value) +
            " F211 = " + xrxStr.strQuoteComma(data.F211.value) +
            " F221 = " + xrxStr.strQuoteComma(data.F221.value) +
            " F241 = " + xrxStr.strQuoteComma(data.F241.value) +
            " F242 = " + xrxStr.strQuoteComma(data.F242.value) +
            " F251 = " + xrxStr.strQuoteComma(data.F251.value) +
            " F252 = " + xrxStr.datQuoteComma(data.F252.value) +
            " F253 = " + xrxStr.strQuoteComma(data.F253.value) +
            " F261 = " + xrxStr.strQuoteComma(data.F261.value) +
            " F262 = " + xrxStr.datQuoteComma(data.F262.value) +
            " F263 = " + xrxStr.datQuoteComma(data.F263.value) +
            " F264 = " + xrxStr.strQuoteComma(data.F264.value) +
            " EntryDate = " + xrxStr.datQuoteComma(data.ENTRYDATE.value) +
            " UserName = " + xrxStr.strQuoteComma(data.USERNAME.value) +
            " F132 = " + xrxStr.strQuoteComma(data.F132.value) +
            " F152 = " + xrxStr.strQuoteComma(data.F152.value) +
            " CaseNo = " + xrxStr.strQuoteComma(data.CASENO.value) +
            " ClaimNo = " + xrxStr.strQuoteComma(data.CLAIMNO.value) +
            " DateOfHire = " + xrxStr.strQuoteComma(data.DATEOFHIRE.value) +
            " Remark = " + xrxStr.strQuoteComma(data.REMARK.value) +
            " Ulcers = " + xrxStr.strQuoteComma(data.ULCERS.value) +
            " Diabetes = " + xrxStr.strQuoteComma(data.DIABETES.value) +
            " Asthma = " + xrxStr.strQuoteComma(data.ASTHMA.value) +
            " Allergy = " + xrxStr.strQuoteComma(data.ALLERGY.value) +
            " Currmed = " + xrxStr.strQuoteComma(data.CURRMED.value) +
            " TetDate = " + xrxStr.strQuoteComma(data.TETDATE.value) +
            " Weight = " + xrxStr.strQuoteComma(data.WEIGHT.value) +
            " Bp = " + xrxStr.strQuoteComma(data.BP.value) +
            " LimitsRestrictions1 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS1.value) +
            " LimitsRestrictions2 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS2.value) +
            " LimitsRestrictions2lbs = " + xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS2LBS.value) +
            " LimitsRestrictions3 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS3.value) +
            " LimitsRestrictions4 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS4.value) +
            " LimitsRestrictions4gt = " + xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4GT.value) +
            " LimitsRestrictions4ex = " + xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4EX.value) +
            " LimitsRestrictions4Hrs = " + xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4HRS.value) +
            " LimitsRestrictions5 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS5.value) +
            " LimitsRestrictions5Pos = " + xrxStr.strQuoteComma(data.LIMITSRESTRICTIONS5POS.value) +
            " LimitsRestrictions5PosVal = " + xrxStr.strQuoteComma(data.LIMITSRESTRICTIONS5POSVAL.value) +
            " LimitsRestrictions6 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS6.value) +
            " LimitsRestrictions7 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS7.value) +
            " LimitsRestrictions8 = " + xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS8.value) +
            " RegDate = " + xrxStr.datQuoteComma(data.REGDATE.value) +
            " FdisDate = " + xrxStr.datQuoteComma(data.FDISDATE.value) +
            " TdisDate = " + xrxStr.datQuoteComma(data.TDISDATE.value) +
            " FmodDate = " + xrxStr.datQuoteComma(data.FMODDATE.value) +
            " TmodDate = " + xrxStr.datQuoteComma(data.TMODDATE.value) +
            " F14s = " + xrxStr.strQuoteComma(data.F14S.value) +
            " F27 = " + xrxStr.strQuoteComma(data.F27.value) +
            " IllRecNo = " + xrxStr.strQuoteComma(data.ILLRECNO.value) +
            " EmpContacted = " + xrxStr.strQuoteComma(data.EMPCONTACTED.value) +
            " EmpContactDate = " + xrxStr.datQuote(data.EMPCONTACTDATE.value) +
        "where RecNo = " + xrxStr.strQuote(data.RECNO.value) + "; update xrxWrk  set ClaimNo = "+xrxStr.strQuote(data.CLAIMNO.value)+" where patId =  "+xrxStr.strQuote(data.PATID.value)+"  ";


      }
      else {

        sql =
                "insert into xrxPr1 (" +
                "PatId, " +
                "DctId, " +
                "FclId, " +
                "JobYears, " +
                "JobMonths, " +
                "MajorHand, " +
                "F121, " +
                "F122, " +
                "F123, " +
                "F131, " +
                "F14, " +
                "F151, " +
                "F16, " +
                "Allergies, " +
                "F17, " +
                "F18, " +
                "F191, " +
                "F192, " +
                "F212, " +
                "F222, " +
                "F23, " +
                "FirstAid, " +
                "F20, " +
                "F211, " +
                "F221, " +
                "F241, " +
                "F242, " +
                "F251, " +
                "F252, " +
                "F253, " +
                "F261, " +
                "F262, " +
                "F263, " +
                "F264, " +
                "EntryDate, " +
                "UserName, " +
                "F132, " +
                "F152, " +
                "CaseNo, " +
                "ClaimNo, " +
                "DateOfHire, " +
                "Remark, " +
                "Ulcers, " +
                "Diabetes, " +
                "Asthma, " +
                "Allergy, " +
                "Currmed, " +
                "TetDate, " +
                "Weight, " +
                "Bp, " +
                "LimitsRestrictions1, " +
                "LimitsRestrictions2, " +
                "LimitsRestrictions2lbs, " +
                "LimitsRestrictions3, " +
                "LimitsRestrictions4, " +
                "LimitsRestrictions4gt, " +
                "LimitsRestrictions4ex, " +
                "LimitsRestrictions4Hrs, " +
                "LimitsRestrictions5, " +
                "LimitsRestrictions5Pos, " +
                "LimitsRestrictions5PosVal, " +
                "LimitsRestrictions6, " +
                "LimitsRestrictions7, " +
                "LimitsRestrictions8, " +
                "RegDate, " +
                "FdisDate, " +
                "TdisDate, " +
                "FmodDate, " +
                "TmodDate, " +
                "F14s, " +
                "F27, " +
                "IllRecNo, " +
                "EmpContacted, " +
                "EmpContactDate " +
                 ") " +
                " values(" +
                    xrxStr.strQuoteComma(data.PATID.value) +
                    xrxStr.strQuoteComma(data.DCTID.value) +
                    xrxStr.strQuoteComma(data.FCLID.value) +
                    xrxStr.strQuoteComma(data.JOBYEARS.value) +
                    xrxStr.strQuoteComma(data.JOBMONTHS.value) +
                    xrxStr.strQuoteComma(data.MAJORHAND.value) +
                    xrxStr.strQuoteComma(data.F121.value) +
                    xrxStr.strQuoteComma(data.F122.value) +
                    xrxStr.strQuoteComma(data.F123.value) +
                    xrxStr.datQuoteComma(data.F131.value) +
                    xrxStr.datQuoteComma(data.F14.value) +
                    xrxStr.datQuoteComma(data.F151.value) +
                    xrxStr.strQuoteComma(data.F16.value) +
                    xrxStr.strQuoteComma(data.ALLERGIES.value) +
                    xrxStr.strQuoteComma(data.F17.value) +
                    xrxStr.strQuoteComma(data.F18.value) +
                    xrxStr.strQuoteComma(data.F191.value) +
                    xrxStr.strQuoteComma(data.F192.value) +
                    xrxStr.strQuoteComma(data.F212.value) +
                    xrxStr.strQuoteComma(data.F222.value) +
                    xrxStr.strQuoteComma(data.F23.value) +
                    xrxStr.strQuoteComma(data.FIRSTAID.value) +
                    xrxStr.strQuoteComma(data.F20.value) +
                    xrxStr.strQuoteComma(data.F211.value) +
                    xrxStr.strQuoteComma(data.F221.value) +
                    xrxStr.strQuoteComma(data.F241.value) +
                    xrxStr.strQuoteComma(data.F242.value) +
                    xrxStr.strQuoteComma(data.F251.value) +
                    xrxStr.datQuoteComma(data.F252.value) +
                    xrxStr.strQuoteComma(data.F253.value) +
                    xrxStr.strQuoteComma(data.F261.value) +
                    xrxStr.datQuoteComma(data.F262.value) +
                    xrxStr.datQuoteComma(data.F263.value) +
                    xrxStr.strQuoteComma(data.F264.value) +
                    xrxStr.datQuoteComma(data.ENTRYDATE.value) +
                    xrxStr.strQuoteComma(data.USERNAME.value) +
                    xrxStr.strQuoteComma(data.F132.value) +
                    xrxStr.strQuoteComma(data.F152.value) +
                    xrxStr.strQuoteComma(data.CASENO.value) +
                    xrxStr.strQuoteComma(data.CLAIMNO.value) +
                    xrxStr.strQuoteComma(data.DATEOFHIRE.value) +
                    xrxStr.strQuoteComma(data.REMARK.value) +
                    xrxStr.strQuoteComma(data.ULCERS.value) +
                    xrxStr.strQuoteComma(data.DIABETES.value) +
                    xrxStr.strQuoteComma(data.ASTHMA.value) +
                    xrxStr.strQuoteComma(data.ALLERGY.value) +
                    xrxStr.strQuoteComma(data.CURRMED.value) +
                    xrxStr.strQuoteComma(data.TETDATE.value) +
                    xrxStr.strQuoteComma(data.WEIGHT.value) +
                    xrxStr.strQuoteComma(data.BP.value) +
                    xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS1.value) +
                    xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS2.value) +
                    xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS2LBS.value) +
                    xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS3.value) +
                    xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS4.value) +
                    xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4GT.value) +
                    xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4EX.value) +
                    xrxStr.intQuoteComma(data.LIMITSRESTRICTIONS4HRS.value) +
                    xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS5.value) +
                    xrxStr.strQuoteComma(data.LIMITSRESTRICTIONS5POS.value) +
                    xrxStr.strQuoteComma(data.LIMITSRESTRICTIONS5POSVAL.value) +
                    xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS6.value) +
                    xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS7.value) +
                    xrxStr.bolQuoteComma(data.LIMITSRESTRICTIONS8.value) +
                    xrxStr.datQuoteComma(data.REGDATE.value) +
                    xrxStr.datQuoteComma(data.FDISDATE.value) +
                    xrxStr.datQuoteComma(data.TDISDATE.value) +
                    xrxStr.datQuoteComma(data.FMODDATE.value) +
                    xrxStr.datQuoteComma(data.TMODDATE.value) +
                    xrxStr.strQuoteComma(data.F14S.value) +
                    xrxStr.strQuoteComma(data.F27.value) +
                    xrxStr.strQuoteComma(data.ILLRECNO.value) +
                    xrxStr.datQuoteComma(data.ENTRYDATE.value) +
                    xrxStr.datQuote(data.EMPCONTACTDATE.value) +
                ");" + "  update xrxWrk  set ClaimNo = "+xrxStr.strQuote(data.CLAIMNO.value)+" where patId =  "+xrxStr.strQuote(data.PATID.value)+"  ";
            }


    dbhelper.query(sql, function (err, record) {
            if (err) {
                callback('Error: ' + err, false);
            }
            else {
                callback(null, true);
            }
      });

};

exports.pr1Print = function (para, callback) {

  var child = require('child_process').execFile;
  console.log(para);
  //Change this path
  var executablePath = cmGlb.mainFolder + "xrxRpCrystalReports.exe";
  //var executablePath = "c:\\calmed\\xrxReporting.exe";
  //var executablePath = "D:\\Calmed_NodeJs\\Supporting_Projects\\xrxRpCrystalReports\\bin\\Debug\\xrxRpCrystalReports.exe";

  var reportParameters = {
     'CompanyName'  : para.COMPANYNAME,
     'ProviderName' : para.PROVIDERNAME,
     '@PatId' : para.PATID,
     '@DateOfExam' : para.DATEOFEXAM,
     '@Completed' : para.COMPLETED
  };

  var reportParametersStr =  JSON.stringify(reportParameters);
  var parameters = [cmGlb.connectionDataSourceName, dbhelper.config.options.database, dbhelper.config.userName, dbhelper.config.password, "pr1" , para.TEMPLATE, cmGlb.mainFolder, reportParametersStr];

  child(executablePath, parameters, function(err, data) {

      if(err) {
        console.log(err);
        callback(err , null);
      }
      else {
        //console.log(data.toString());
        callback(null , true);
      }
  });

};
