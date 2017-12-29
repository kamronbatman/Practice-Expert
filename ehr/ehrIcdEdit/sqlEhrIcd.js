var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.icdGet = function (recno, callback) {
    var sql =  "select * from xrxEhr_chg where (Recno = " + xrxStr.strQuote(recno) + ")";
    dbhelper.query(sql, function (err, record) {
        console.log(err);
        if (err) {
            callback('Error: ' + err, record);
        }
        else
            callback(null , record);
    });
};
exports.icdSave = function (icdRecord, callback){
        if (icdRecord.RECNO.value) {
            var sqlupdate =
                "update xrxEhr_chg set " +
                " patId = " + xrxStr.strQuoteComma(icdRecord.PATID.value) +
                " PatName = " + xrxStr.strQuoteComma(icdRecord.PATNAME.value) +
                " DctId = " + xrxStr.strQuoteComma(icdRecord.DCTID.value) +
                " FclId = " + xrxStr.strQuoteComma(icdRecord.FCLID.value) +
                " ServDate = " + xrxStr.strQuoteComma(icdRecord.SERVDATE.value) +
                " PostDate = " + xrxStr.strQuoteComma(icdRecord.POSTDATE.value) +
                " ChgType = " + xrxStr.intQuoteComma(icdRecord.CHGTYPE.value) +
                " ChgCode = " + xrxStr.strQuoteComma(icdRecord.CHGCODE.value) +
                " ChgName = " + xrxStr.strQuoteComma(icdRecord.CHGNAME.value) +
                " ChgDesc = " + xrxStr.strQuoteComma(icdRecord.CHGDESC.value) +
                " Status = " + xrxStr.strQuoteComma(icdRecord.STATUS.value) +
                " OnsetDate = " + xrxStr.strQuoteComma(icdRecord.ONSETDATE.value) +
                " ResolutionDate = " + xrxStr.strQuoteComma(icdRecord.RESOLUTIONDATE.value) +
                " Chronicity = " + xrxStr.strQuoteComma(icdRecord.CHRONICITY.value) +
                " Classification = " + xrxStr.strQuoteComma(icdRecord.CLASSIFICATION.value) +
                " SubClassification = " + xrxStr.strQuoteComma(icdRecord.SUBCLASSIFICATION.value) +
                " SNOMED = " + xrxStr.strQuoteComma(icdRecord.SNOMED.value) +
                " UserId = " + xrxStr.strQuote(icdRecord.USERID.value) +
                "where RecNo = " + xrxStr.strQuote(icdRecord.RECNO.value);


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
            var sqlinsert =
                "insert into xrxEhr_chg(PatId, PatName, DctId, FclId, ServDate, PostDate, ChgType, ChgCode, ChgName, ChgDesc, [Status], OnsetDate, ResolutionDate, Chronicity, Classification, SubClassification, SNOMED, Orderno, UserId) " +
                " values(" +
                xrxStr.strQuoteComma(icdRecord.PATID.value) +
                xrxStr.strQuoteComma(icdRecord.PATNAME.value) +
                xrxStr.strQuoteComma(icdRecord.DCTID.value) +
                xrxStr.strQuoteComma(icdRecord.FCLID.value) +
                xrxStr.strQuoteComma(icdRecord.SERVDATE.value) +
                xrxStr.strQuoteComma(icdRecord.POSTDATE.value) +
                xrxStr.intQuoteComma(icdRecord.CHGTYPE.value) +
                xrxStr.strQuoteComma(icdRecord.CHGCODE.value) +
                xrxStr.strQuoteComma(icdRecord.CHGNAME.value) +
                xrxStr.strQuoteComma(icdRecord.CHGDESC.value) +
                xrxStr.strQuoteComma(icdRecord.STATUS.value) +
                xrxStr.strQuoteComma(icdRecord.ONSETDATE.value) +
                xrxStr.strQuoteComma(icdRecord.RESOLUTIONDATE.value) +
                xrxStr.strQuoteComma(icdRecord.CHRONICITY.value) +
                xrxStr.strQuoteComma(icdRecord.CLASSIFICATION.value) +
                xrxStr.strQuoteComma(icdRecord.SUBCLASSIFICATION.value) +
                xrxStr.strQuoteComma(icdRecord.SNOMED.value) +
                xrxStr.intQuoteComma("1") +
                xrxStr.strQuote(icdRecord.USERID.value) +
                ")";


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
exports.isIcdAlreadyExists = function (icdRecord, callback){
    var sqlQry = "select Recno from xrxEhr_chg where " +
        "(PatId = " + xrxStr.strQuote(icdRecord.PATID.value) + ") and " +
        "(ServDate = " + xrxStr.strQuote(icdRecord.SERVDATE.value) + ") and" +
        "(ChgType = 1) and" +
        "(ChgCode = " + xrxStr.strQuote(icdRecord.CHGCODE.value) + ")";
    //var sqlQry = "select * from xrxEhr_chg where (ChgCode = '" + icdRecord.CHGCODE.value + "' and PatId = '" + icdRecord.PATID.value + "' and ServDate = '" + icdRecord.SERVDATE.value + "' )";
    dbhelper.query(sqlQry, function (err, record) {
        if (err) {
            callback('Error: ' + err, null);
        }
        else {
            if (record) {
                if (record.length > 0) {

                    if (!icdRecord.RECNO.value) {
                        callback(null, true);
                    }
                    else {
                        if (record[0].RECNO.value != icdRecord.RECNO.value) {
                            callback(null, true);
                        }
                        else {
                            callback(null, false);
                        }
                    }
                }
                else {
                    callback(null, false);
                }
            }
            else {
                callback(null, false);
            }
        }
    });
}

//SearchIcdBased On SNOMEDDESC
exports.getIcdBasedOnSnomed = function (snomedCode, callback) {

  var sql = "select top 1 icdName from xrxIcd10 where SNOMED = "+ xrxStr.strQuote(snomedCode) +"  ";

    dbhelper.query(sql, function (err, record) {

      callback(err , record);

    });


}

exports.getSnomedToIcdMap = function (snomedCode, callback) {

  var sql = "select * from xrxSnomedIcdMap where SnomedCode = "+ xrxStr.strQuote(snomedCode) +" order by MapPriority desc  ";

  dbhelper.query(sql, function (err, record) {

    callback(err , record);

  });
}


//Icd Search Sql Methods
exports.icdGetDesc = function (icdCode, callback) {
    var sql =  "select IcdName, ICDDesc, Chronic, SNOMED from xrxIcd10 where (isNull(Valid, 1) = 1) and (IcdName = " + xrxStr.strQuote(icdCode) + ")";
    dbhelper.query(sql, function (err, record) {
        if (err) {
            callback('Error: ' + err, record);
        }
        else {

            callback(null , record);
        }
    });
};
exports.searchPrimary = function (icdSrchText, searchType, callback) {

    var sql = "";
    if (searchType == "CODE") {
        sql = "select * from xrxIcd10 where (icdName like " + xrxStr.strQuote(icdSrchText + "%") + ") order by IcdName";
        // sql = "select distinct(main.icdName), main.IcdDesc from xrxIcd10Main main " +
        //          "join xrxIcd10 dir on (dir.IcdMain = main.IcdName) " +
        //          "where (dir.IcdName like " + xrxStr.strQuote("%" + icdSrchText + "%") + ") " +
        //           "order by main.IcdName";


    }
    else if (searchType == "DESCRIPTION") {
        var pOr = icdSrchText.indexOf(",");
        var pAnd = icdSrchText.indexOf("&");
        if ((pOr != -1) && (pAnd != -1)) {
            icdSrchText = icdSrchText.replace("&", " ");
            pAnd = -1;
        }
        var s1 = '';
        var s2 = '';
        if (pOr != -1) {
            var s1 = icdSrchText.substr(0, pOr).trim();
            var s2 = icdSrchText.slice(pOr + 1).trim();
        }
        else if (pAnd != -1) {
            var s1 = icdSrchText.substr(0, pAnd).trim();
            var s2 = icdSrchText.slice(pAnd + 1).trim();
        }

        if ((pOr == -1) && (pAnd == -1)) {
            sql = "select distinct(main.icdName), main.IcdDesc from xrxIcd10Main main " +
                  "join xrxIcd10 dir on (dir.IcdMain = main.IcdName) " +
                  "where (dir.IcdDesc like " + xrxStr.strQuote("%" + icdSrchText + "%") + ") " +
                  "order by main.IcdName";
        }
        else if (pAnd != -1) {
            sql = "select distinct(main.icdName), main.IcdDesc from xrxIcd10Main main " +
                  "join xrxIcd10 dir on (dir.IcdMain = main.IcdName) " +
                  "where " +
                    "(dir.IcdDesc like " + xrxStr.strQuote("%" + s1 + "%") + ") and " +
                    "(dir.IcdDesc like " + xrxStr.strQuote("%" + s2 + "%") + ") " +
                  "order by main.IcdName";
        }
        else {
            sql = "select distinct(main.icdName), main.IcdDesc from xrxIcd10Main main " +
                  "join xrxIcd10 dir on (dir.IcdMain = main.IcdName) " +
                  "where " +
                    "(dir.IcdDesc like " + xrxStr.strQuote("%" + s1 + "%") + ") or " +
                    "(dir.IcdDesc like " + xrxStr.strQuote("%" + s2 + "%") + ") " +
                  "order by main.IcdName";
        }
    }
    //var sql = "select * from xrxIcd10 where (IcdDesc like " + xrxStr.strQuote("%" + icdDesc + "%") + ") order by IcdName";

    dbhelper.query(sql, function (err, record) {

        if (typeof err == 'undefined' || (!err)) {
            callback(null , record);
        }
        else {
            callback('Error: ' + err, record);
        }
    });
};
exports.searchSecondary = function (icdMain, searchType, callback) {

    var sql = "";
    if (searchType == "CODE") {

        sql = "select * from xrxIcd10 where (isNull(Valid, 1) = 1) and (icdName like " + xrxStr.strQuote(icdMain + "%") + ") order by IcdName";
    }
    else if (searchType == "DESCRIPTION") {

        sql = "select * from xrxicd10 where (isNull(Valid, 1) = 1) and (IcdMain = " + xrxStr.strQuote(icdMain) + ") Order by IcdName";
    }
    dbhelper.query(sql, function (err, record) {
        if (typeof err == 'undefined' || (!err)) {

            callback(null , record);
        }
        else {

            callback('Error: ' + err, record);
        }
    });
};
exports.searchICD10Map = function (icd9, callback) {

    var sql = "select * from xrxIcd10Map where (Icd9 = " + xrxStr.strQuote(icd9) + ") Order by Icd10";

    dbhelper.query(sql, function (err, record) {

        if (typeof err == 'undefined' || (!err)) {

            callback(null , record);
        }
        else {

            callback('Error: ' + err, record);
        }
    });
};
