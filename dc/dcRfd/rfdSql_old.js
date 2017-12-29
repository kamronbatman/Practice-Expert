var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.rfdCount = function(sqlWhereClause, callback) {

  var sqlWhereClause = sqlWhereClause;
  if(!sqlWhereClause)
    sqlWhereClause = "";

  var sql = "SELECT COUNT(*) AS COUNT FROM xrxRfd " + sqlWhereClause;

  dbhelper.query(sql,  function (err, record) {
    if ((!err) || typeof err === 'undefined'){
      if (record && record.length>0){
        callback(null,  record[0].COUNT.value);
      }
      else{
        callback (null,  0);
      }
    }
    else{
        callback(err, null);
    }
  });
};
exports.rfdRows = function(sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback) {

      if(!sqlWhereClause){
        sqlWhereClause = "";
      }
      else{
        //sqlWhereClause = xrxStr.strClean(sqlWhereClause);
      }

      var tableName = "xrxRfd"
      var sqlJoin = " ";
      var selectColumns = "*";

      var sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY "+ sortBy +" "+ sortType +" ) AS rownumber FROM " + tableName + sqlJoin + sqlWhereClause + ") AS MyDerivedTable "+
                  "WHERE rownumber >= '" + rowStart + "' AND rownumber <= '"+ rowEnd +"'";
      
      dbhelper.query(sql, function (err, record) {
        if ((!err) || typeof err === 'undefined'){
              if (record) {
                callback(null, record);
              }
              else{
                  callback(null, null);
              }
        }
        else{
              callback(err, null);
        }
      });
};
exports.rfdRowRecNo = function(recNo, callback) {

  var sql = "SELECT * FROM xrxRfd WHERE RECNO='" + recNo + "'";
  dbhelper.query(sql, function (err, record) {
    if ((!err) || typeof err === 'undefined'){
          if (record && record.length>0){
            callback(null, record[0]);
          }
          else{
              callback(null, null);
          }
    }
    else{
          callback(err, null);
    }
  });
};
exports.rfdExistsId = function (id, recNo, callback) {

  var sql = "select * from xrxRfd where RFDID=" + xrxStr.strQuote(id) +" ";
  if(recNo){
      sql += " AND RECNO <> '" + recNo + "'";
  }
  dbhelper.query(sql, function (err, record) {
      if (err){
          callback(err, null);
      }
      else{
        callback(null , record);
      }
  });
};
exports.rfdSave = function(record, callback) {

  var recordnumber = record.RECNO.value;
  var sqlInsert = "";

  if(!recordnumber){
      sqlInsert = " INSERT INTO xrxRfd (RECNO, RFDID) VALUES (NEWID(), '"+ record.RFDID.value +"'); ";
  }

var sqlUpdate =
    " UPDATE xrxRfd SET "+
    " RfdId  = " + xrxStr.strQuoteComma(record.RFDID.value) +
    " ShortCode = " + xrxStr.strQuoteComma(record.SHORTCODE.value) +
    " AppOrder  = " + xrxStr.strQuoteComma(record.APPORDER.value) +
    " FirstName  = " + xrxStr.strQuoteComma(record.FIRSTNAME.value) +
    " LastName  = " + xrxStr.strQuoteComma(record.LASTNAME.value) +
    " Mi  = " + xrxStr.strQuoteComma(record.MI.value) +
    " Title  = " + xrxStr.strQuoteComma(record.TITLE.value) +
    " Addr  = " + xrxStr.strQuoteComma(record.ADDR.value) +
    " Addr2  = " + xrxStr.strQuoteComma(record.ADDR2.value) +
    " City  = " + xrxStr.strQuoteComma(record.CITY.value) +
    " State  = " + xrxStr.strQuoteComma(record.STATE.value) +
    " Zip  = " + xrxStr.strQuoteComma(record.ZIP.value) +
    " Phone  = " + xrxStr.strQuoteComma(record.PHONE.value) +
    " PhoneExt  = " + xrxStr.strQuoteComma(record.PHONEEXT.value) +
    " Fax  = " + xrxStr.strQuoteComma(record.FAX.value) +
    " Email  = " + xrxStr.strQuoteComma(record.EMAIL.value) +
    " Pin  = " + xrxStr.strQuoteComma(record.PIN.value) +
    " Specialty  = " + xrxStr.strQuoteComma(record.SPECIALTY.value) +
    " TypeQualifier  = " + xrxStr.strQuoteComma(record.TYPEQUALIFIER.value) +
    " HcfaFirstName  = " + xrxStr.strQuoteComma(record.HCFAFIRSTNAME.value) +
    " HcfaLastName  = " + xrxStr.strQuoteComma(record.HCFALASTNAME.value) +
    " HcfaMi  = " + xrxStr.strQuoteComma(record.HCFAMI.value) +
    " HcfaTitle  = " + xrxStr.strQuoteComma(record.HCFATITLE.value) +
    " JudPercent  = " + xrxStr.strQuoteComma(record.JUDPERCENT.value) +
    " DrgId  = " + xrxStr.strQuoteComma(record.DRGID.value) +
    " DrgExDate  = " + xrxStr.strQuoteComma(record.DRGEXDATE.value) +
    " LicExDate  = " + xrxStr.strQuoteComma(record.LICEXDATE.value) +
    " MalPolicy  = " + xrxStr.strQuoteComma(record.MALPOLICY.value) +
    " MalExDate  = " + xrxStr.strQuoteComma(record.MALEXDATE.value) +
    " FeeName  = " + xrxStr.strQuoteComma(record.FEENAME.value) +
    " ClassCd  = " + xrxStr.strQuoteComma(record.CLASSCD.value) +
    " EnvoySiteId  = " + xrxStr.strQuoteComma(record.ENVOYSITEID.value) +
    " MonarchId  = " + xrxStr.strQuoteComma(record.MONARCHID.value) +
    " EmployerIdNo  = " + xrxStr.strQuoteComma(record.EMPLOYERIDNO.value) +
    " SocSecNo  = " + xrxStr.strQuoteComma(record.SOCSECNO.value) +
    " NPI  = " + xrxStr.strQuoteComma(record.NPI.value) +
    " StateLicenseNo  = " + xrxStr.strQuoteComma(record.STATELICENSENO.value) +
    " BlueShieldNo  = " + xrxStr.strQuoteComma(record.BLUESHIELDNO.value) +
    " MedicareNo  = " + xrxStr.strQuoteComma(record.MEDICARENO.value) +
    " MedicaidNo  = " + xrxStr.strQuoteComma(record.MEDICAIDNO.value) +
    " UPINNo  = " + xrxStr.strQuoteComma(record.UPINNO.value) +
    " CHAMPUSIdNo  = " + xrxStr.strQuoteComma(record.CHAMPUSIDNO.value) +
    " CommercialNo  = " + xrxStr.strQuoteComma(record.COMMERCIALNO.value) +
    " LocationNo  = " + xrxStr.strQuoteComma(record.LOCATIONNO.value) +
    " PlanNetworkIdNo  = " + xrxStr.strQuoteComma(record.PLANNETWORKIDNO.value) +
    " IndustrialAccidentNo  = " + xrxStr.strQuoteComma(record.INDUSTRIALACCIDENTNO.value) +
    " TaxonomyCode  = " + xrxStr.strQuoteComma(record.TAXONOMYCODE.value) +
    " NM108_Id_Code_Qual  = " + xrxStr.strQuoteComma(record.NM108_ID_CODE_QUAL.value) +
    " NM109_Id_Code  = " + xrxStr.strQuoteComma(record.NM109_ID_CODE.value) +
    " MedicareDMERCNo  = " + xrxStr.strQuoteComma(record.MEDICAREDMERCNO.value) +
    " MedicareRailroadNo  = " + xrxStr.strQuoteComma(record.MEDICARERAILROADNO.value) +
    " FullName  = " + xrxStr.strQuoteComma(record.FULLNAME.value) +
    " RfdName  = " + xrxStr.strQuoteComma(record.RFDNAME.value) +
    " SubSpecialty  = " + xrxStr.strQuoteComma(record.SUBSPECIALTY.value) +
    " DirectAddr  = " + xrxStr.strQuoteComma(record.DIRECTADDR.value) +
    " ENTRYDATE  = " + xrxStr.strQuoteComma(record.ENTRYDATE.value) +
    " USERID = " + xrxStr.strQuote(record.USERID.value) + " ";
                  if(recordnumber)
                      sqlUpdate += "WHERE RECNO = '"+ recordnumber +"'; ";
                  else
                      sqlUpdate += "WHERE RFDID = '"+ record["RFDID"].value +"'; ";

    var sql =   " BEGIN TRY "+
                " BEGIN TRANSACTION RFD "+
                sqlInsert+
                sqlUpdate+
                " COMMIT TRANSACTION RFD "+
                " END TRY "+
                " BEGIN CATCH "+
                " IF @@TRANCOUNT>0 ROLLBACK TRANSACTION RFD "+
                " END CATCH ";

  dbhelper.query(sql,  function (err, record) {
      if (err){
        callback(err, null);
      }
      else{
        callback(null , record);
      }
  });
};

exports.rfdShortCodeExsists = function (shortCode, recNo, callback) {

    var shortCode = shortCode;
    var recNo = recNo;

    var sql = "select * from xrxRfd where ShortCode=" + xrxStr.strQuote(shortCode) +" ";
    if(recNo)
    {
        sql += " AND RECNO <> '" + recNo + "'";
    }

    dbhelper.query(sql, function (err, record) {
        if (err)
        {
            callback(err, null);
        }
        else
        {
            callback(null , record);
        }
    });

}
exports.rfdDelete = function(recNo, callback) {

    var sql = "DELETE FROM xrxRfd WHERE RECNO ='"+ recNo +"'";
    dbhelper.query(sql, function (err, record) {
        if ((!err) || typeof err === 'undefined') {
            callback(null, record);
        }
        else {
            callback(err, null);
        }
    });
};
