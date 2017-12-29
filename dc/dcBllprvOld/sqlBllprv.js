var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.bllprvCount = function(sqlWhereClause, callback) {

  var sqlWhereClause = sqlWhereClause;
  if(!sqlWhereClause)
    sqlWhereClause = "";

  var sql = "SELECT COUNT(*) AS COUNT FROM xrxBllPrv " + sqlWhereClause;
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

exports.bllprvRows = function(sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback) {

      if(!sqlWhereClause){
        sqlWhereClause = "";
      }
      else{
        //sqlWhereClause = xrxStr.strClean(sqlWhereClause);
      }

      var tableName = "xrxBllPrv"
      var sqlJoin = " ";
      var selectColumns = "*";

      var sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY "+ sortBy +" "+ sortType +" ) AS rownumber FROM " + tableName + sqlJoin + sqlWhereClause + ") AS MyDerivedTable "+
                  "WHERE rownumber >= '" + rowStart + "' AND rownumber <= '"+ rowEnd +"'";
      console.log(sql);
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

exports.bllprvRowRecNo = function(recNo, callback) {

  var sql = "SELECT * FROM xrxBllPrv WHERE RECNO='" + recNo + "'";
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

exports.bllprvExistsId = function (id, recNo, callback) {

  var sql = "select * from xrxBllPrv where BLLPRVID=" + xrxStr.strQuote(id) +" ";
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

exports.bllprvSave = function(record, callback) {

  var recordnumber = record.RECNO.value;
  var sqlInsert = "";
  if(!recordnumber)
      sqlInsert = " INSERT INTO xrxBllPrv (RECNO, BLLPRVID) VALUES (NEWID(), "+ xrxStr.strQuote(record.BLLPRVID.value) +" ); ";

  var sqlUpdate = " UPDATE xrxBllPrv SET "+
                  " BLLPRVID = "+ xrxStr.strQuoteComma(record.BLLPRVID.value) +
                  " NM102_BP_ENTITY_TYPE_QUAL = "+ xrxStr.strQuoteComma(record.NM102_BP_ENTITY_TYPE_QUAL.value) +
                  " NM103_BP_NAME = "+ xrxStr.strQuoteComma(record.NM103_BP_NAME.value) +
                  " NM104_BP_FIRST_NAME = "+ xrxStr.strQuoteComma(record.NM104_BP_FIRST_NAME.value) +
                  " NM105_BP_MI = "+ xrxStr.strQuoteComma(record.NM105_BP_MI.value) +
                  " TITLE = "+ xrxStr.strQuoteComma(record.TITLE.value) +
                  " N301_BP_ADDR1 = "+ xrxStr.strQuoteComma(record.N301_BP_ADDR1.value) +
                  " N302_BP_ADDR2 = "+ xrxStr.strQuoteComma(record.N302_BP_ADDR2.value) +
                  " N401_BP_CITY = "+ xrxStr.strQuoteComma(record.N401_BP_CITY.value) +
                  " N402_BP_STATE = "+ xrxStr.strQuoteComma(record.N402_BP_STATE.value) +
                  " N403_BP_ZIP = "+ xrxStr.strQuoteComma(record.N403_BP_ZIP.value) +
                  " PER02_BP_CONTACT = "+ xrxStr.strQuoteComma(record.PER02_BP_CONTACT.value) +
                  " PER04_BP_COMMUNICATION_PHONE = "+ xrxStr.strQuoteComma(record.PER04_BP_COMMUNICATION_PHONE.value) +
                  " PER04_BP_COMMUNICATION_EMAIL = "+ xrxStr.strQuoteComma(record.PER04_BP_COMMUNICATION_EMAIL.value) +
                  " PER04_BP_COMMUNICATION_FAX = "+ xrxStr.strQuoteComma(record.PER04_BP_COMMUNICATION_FAX.value) +
                  " FULLNAME = "+ xrxStr.strQuoteComma(record.FULLNAME.value) +
                  " EMPLOYERIDNO = "+ xrxStr.strQuoteComma(record.EMPLOYERIDNO.value) +
                  " SOCSECNO = "+ xrxStr.strQuoteComma(record.SOCSECNO.value) +
                  " NM109_BP_ID_CODE = "+ xrxStr.strQuoteComma(record.NM109_BP_ID_CODE.value) +
                  " NM108_BP_ID_CODE_QUAL = "+ xrxStr.strQuoteComma(record.NM108_BP_ID_CODE_QUAL.value) +
                  " NPI = "+ xrxStr.strQuoteComma(record.NPI.value) +
                  " TAXONOMYCODE = "+ xrxStr.strQuoteComma(record.TAXONOMYCODE.value) +
                  " COMMERCIALNO = "+ xrxStr.strQuoteComma(record.COMMERCIALNO.value) +
                  " LOCATIONNO = "+ xrxStr.strQuoteComma(record.LOCATIONNO.value) +
                  " UPINNO = "+ xrxStr.strQuoteComma(record.UPINNO.value) +
                  " STATELICENSENO = "+ xrxStr.strQuoteComma(record.STATELICENSENO.value) +
                  " MEDICAIDNO = "+ xrxStr.strQuoteComma(record.MEDICAIDNO.value) +
                  " BLUECROSSNO = "+ xrxStr.strQuoteComma(record.BLUECROSSNO.value) +
                  " BLUESHIELDNO = "+ xrxStr.strQuoteComma(record.BLUESHIELDNO.value) +
                  " MEDICARENO = "+ xrxStr.strQuoteComma(record.MEDICARENO.value) +
                  " MEDICAREDMERCNO = "+ xrxStr.strQuoteComma(record.MEDICAREDMERCNO.value) +
                  " MEDICARERAILROADNO = "+ xrxStr.strQuoteComma(record.MEDICARERAILROADNO.value) +
                  " UNIQUESUPPLIERIDNO = "+ xrxStr.strQuoteComma(record.UNIQUESUPPLIERIDNO.value) +
                  " CLINICNO = "+ xrxStr.strQuoteComma(record.CLINICNO.value) +
                  " CHAMPUSIDNO = "+ xrxStr.strQuoteComma(record.CHAMPUSIDNO.value) +
                  " FACILITYIDNO = "+ xrxStr.strQuoteComma(record.FACILITYIDNO.value) +
                  " PPONO = "+ xrxStr.strQuoteComma(record.PPONO.value) +
                  " HMONO = "+ xrxStr.strQuoteComma(record.HMONO.value) +
                  " INDUSTRIALACCIDENTNO = "+ xrxStr.strQuoteComma(record.INDUSTRIALACCIDENTNO.value) +
                  " PROVIDERSITENO = "+ xrxStr.strQuoteComma(record.PROVIDERSITENO.value) +

                  " ISPAYTOPROVEQUALBILLPROV = '"+ record.ISPAYTOPROVEQUALBILLPROV.value + "', " +
                  " NM102_PP_ENTITY_TYPE_QUAL = "+ xrxStr.strQuoteComma(record.NM102_PP_ENTITY_TYPE_QUAL.value) +
                  " NM103_PP_NAME = "+ xrxStr.strQuoteComma(record.NM103_PP_NAME.value) +
                  " NM104_PP_FIRST_NAME = "+ xrxStr.strQuoteComma(record.NM104_PP_FIRST_NAME.value) +
                  " NM105_PP_MI = "+ xrxStr.strQuoteComma(record.NM105_PP_MI.value) +
                  " N301_PP_ADDR1 = "+ xrxStr.strQuoteComma(record.N301_PP_ADDR1.value) +
                  " N302_PP_ADDR2 = "+ xrxStr.strQuoteComma(record.N302_PP_ADDR2.value) +
                  " N403_PP_ZIP = "+ xrxStr.strQuoteComma(record.N403_PP_ZIP.value) +
                  " N401_PP_CITY = "+ xrxStr.strQuoteComma(record.N401_PP_CITY.value) +
                  " N402_PP_STATE = "+ xrxStr.strQuoteComma(record.N402_PP_STATE.value) +
                  " PAYTOPHONE = "+ xrxStr.strQuoteComma(record.PAYTOPHONE.value) +
                  " NM109_PP_ID_CODE = "+ xrxStr.strQuoteComma(record.NM109_PP_ID_CODE.value) +
                  " NM108_PP_ID_CODE_QUAL = "+ xrxStr.strQuoteComma(record.NM108_PP_ID_CODE_QUAL.value) +
                  " PPSTATELICENSENO = "+ xrxStr.strQuoteComma(record.PPSTATELICENSENO.value) +
                  " PPBLUECROSSNO = "+ xrxStr.strQuoteComma(record.PPBLUECROSSNO.value) +
                  " PPBLUESHIELDNO = "+ xrxStr.strQuoteComma(record.PPBLUESHIELDNO.value) +
                  " PPMEDICARENO = "+ xrxStr.strQuoteComma(record.PPMEDICARENO.value) +
                  " PPMEDICAIDNO = "+ xrxStr.strQuoteComma(record.PPMEDICAIDNO.value) +
                  " PPUPINNO = "+ xrxStr.strQuoteComma(record.PPUPINNO.value) +
                  " PPCHAMPUSIDNO = "+ xrxStr.strQuoteComma(record.PPCHAMPUSIDNO.value) +
                  " PPFACILITYIDNO = "+ xrxStr.strQuoteComma(record.PPFACILITYIDNO.value) +
                  " PPPPONO = "+ xrxStr.strQuoteComma(record.PPPPONO.value) +
                  " PPHMONO = "+ xrxStr.strQuoteComma(record.PPHMONO.value) +
                  " PPEMPLOYERIDNO = "+ xrxStr.strQuoteComma(record.PPEMPLOYERIDNO.value) +
                  " PPCLINICNO = "+ xrxStr.strQuoteComma(record.PPCLINICNO.value) +
                  " PPCOMMERCIALNO = "+ xrxStr.strQuoteComma(record.PPCOMMERCIALNO.value) +
                  " PPPROVIDERSITENO = "+ xrxStr.strQuoteComma(record.PPPROVIDERSITENO.value) +
                  " PPLOCATIONNO = "+ xrxStr.strQuoteComma(record.PPLOCATIONNO.value) +
                  " PPSOCSECNO = "+ xrxStr.strQuoteComma(record.PPSOCSECNO.value) +
                  " PPUNIQUESUPPLIERIDNO = "+ xrxStr.strQuoteComma(record.PPUNIQUESUPPLIERIDNO.value) +
                  " PPINDUSTRIALACCIDENTNO = "+ xrxStr.strQuoteComma(record.PPINDUSTRIALACCIDENTNO.value) +
                  " PPMEDICAREDMERCNO = "+ xrxStr.strQuoteComma(record.PPMEDICAREDMERCNO.value) +
                  " PPMEDICARERAILROADNO = "+ xrxStr.strQuoteComma(record.PPMEDICARERAILROADNO.value) +
                  " PPNPI = "+ xrxStr.strQuoteComma(record.PPNPI.value) +

                  " ENTRYDATE = "+ xrxStr.strQuoteComma(record.ENTRYDATE.value) +
                  " USERID = "+ xrxStr.strQuote(record.USERID.value) +" ";

                  if(recordnumber)
                      sqlUpdate += "WHERE RECNO = '"+ recordnumber +"'; ";
                  else
                      sqlUpdate += "WHERE BLLPRVID = " + xrxStr.strQuote(record.BLLPRVID.value) +  "; ";

  var sql =   " BEGIN TRY "+
              " BEGIN TRANSACTION BLLPRV "+
              sqlInsert+
              sqlUpdate+
              " COMMIT TRANSACTION BLLPRV "+
              " END TRY "+
              " BEGIN CATCH "+
              " IF @@TRANCOUNT>0 ROLLBACK TRANSACTION BLLPRV "+
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

exports.bllprvDelete = function(recNo, callback) {

    var sql = "DELETE FROM xrxBllPrv WHERE RECNO ='"+ recNo +"'";
    dbhelper.query(sql, function (err, record) {
        if ((!err) || typeof err === 'undefined') {
            callback(null, record);
        }
        else {
            callback(err, null);
        }
    });
};

exports.bllPrvSearch = function (searchText, searchType, callback){
    var searchText = searchText;
    var searchType = searchType;

    var sqlQuery = "select RECNO, BLLPRVID, NM103_BP_NAME from xrxBllPrv where "+ searchType +" LIKE " + xrxStr.strQuote("%"+searchText+"%") + "";
    dbhelper.query(sqlQuery,  function (err, record) {
          if(err)
          {
              callback(err, null);
          }
          else
          {
              if(record && record.length > 0)
              {
                callback(null, record);
              }
              else
              {
                callback(null, record);
              }
          }
    });
};

exports.bllPrvExists = function(id, recordId, callback){
  var id = id;
  var recordid = recordId;

  var sql = "select RECNO, BLLPRVID, NM103_BP_NAME from xrxBllPrv where BLLPRVID=" + xrxStr.strQuote(id) +" ";

  dbhelper.query(sql, function (err, record){
      if ((!err) || typeof err === 'undefined') {
          if (record && record.length>0)
          {
            callback(null, record);
          }
          else
          {
            callback(null, record);
          }

      }
      else
      {
        callback(err, null);
      }
  });
};
