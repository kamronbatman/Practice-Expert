var remote = require('electron').remote;
var appPath = remote.getGlobal('appPath');
var dbhelper = remote.getGlobal('dbhelper');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");
const dbhelper_i = require(appPath+"/xrx_modules/sqldbhelper");
var converter = require('base64-arraybuffer');

dbhelper_i.config.server = dbhelper.config.server;
dbhelper_i.config.options.instanceName = dbhelper.config.options.instanceName;
dbhelper_i.config.userName = dbhelper.config.userName;
dbhelper_i.config.password = dbhelper.config.password;
dbhelper_i.config.options.database = dbhelper.config.options.database+ "_I";

exports.xrxAcuantScan_LoadParam = function(callback){

  var sql = "SELECT * FROM xrxParam WHERE PARAMNAME = 'OCR'";

  dbhelper.query(sql, function (err, record) {
          if ((!err) || typeof err == 'undefined') {
            if(record && record.length > 0){
              callback(record[0], true);
            }
            else{
              callback(null, true);
            }
          }
          else{
              callback('Error: ' + 'There was an error loading your saved parameters.', false);
          }
  });
};

exports.xrxAcuantScan_SaveParam = function(xmlText, userId, callback){

  var sql = "DELETE FROM xrxParam WHERE ParamName = 'OCR';  INSERT INTO xrxParam (ParamName, XmlText, EntryDate, UserId) VALUES ('OCR', '"+xmlText+"', GETDATE(), '"+userId+"');"

  dbhelper.query(sql, function (err, record) {
      if (err){
          callback(err, false);
      }
      else{
        callback(record , true);
      }
  });
};

exports.xrxAcuantScan_CheckForArchiveInsurance = function(insData, callback) {

  var sql = "SELECT * FROM xrxPatIns WHERE (PatId = '"+ insData.PATID +"' AND InsType = CONVERT(tinyint,'"+ insData.INSTYPE +"') AND Active = 1 AND (PrimaryId  IS NOT NULL OR  PrimaryId <> ''))";

  dbhelper.query(sql, function (err, record) {
    callback(err, record);
  });

};

exports.xrxAcuantScan_SaveInsurance = function (insData, bufferPdf, isArchive, callback) {


    var sqlSave =  "BEGIN \
                      DECLARE @PatId varchar(50); \
                      DECLARE @InsId uniqueidentifier; \
                      DECLARE @InsPayorId varchar(50); \
                      DECLARE @InsName varchar(50); \
                      DECLARE @InsAddr varchar(55); \
                      DECLARE @InsCity varchar(25); \
                      DECLARE @InsState varchar(2); \
                      DECLARE @InsZip varchar(10); \
                      DECLARE @InsPhone varchar(20); \
                      DECLARE @InsWeb varchar(50); \
                      DECLARE @PatInsId uniqueidentifier; \
                      DECLARE @NewPatInsId uniqueidentifier; \
                      DECLARE @ServDate smalldatetime; \
                      DECLARE @FromDate smalldatetime; \
                      DECLARE @EntryDate smalldatetime; \
                      DECLARE @UserId varchar(11); \
                      DECLARE @InsType tinyint; \
                      DECLARE @TrnType smallint; \
                      DECLARE @Deduction money; \
                      DECLARE @Coverage varchar(25); \
                      DECLARE @PrimaryId varchar(25); \
                      DECLARE @GroupPolicyNo varchar(25); \
                      DECLARE @GroupPlanName varchar(25); \
                      DECLARE @FirstName varchar(25); \
                      DECLARE @LastName varchar(35); \
                      DECLARE @Birthdate datetime; \
                      \
                      SET @PatId = '"+ insData.PATID +"'; \
                      SET @InsPayorId = '"+ insData.PAYORID +"'; \
                      SET @InsName = "+ xrxStr.strQuote(insData.INSNAME) +"; \
                      SET @InsAddr = "+ xrxStr.strQuote(insData.ADDR2) +"; \
                      SET @InsCity = "+ xrxStr.strQuote(insData.CITY) +"; \
                      SET @InsState = "+ xrxStr.strQuote(insData.STATE) +"; \
                      SET @InsZip = "+ xrxStr.strQuote(insData.ZIP) +"; \
                      SET @InsPhone = '"+ insData.PHONE +"'; \
                      SET @InsWeb = "+ xrxStr.strQuote(insData.WEB) +"; \
                      SET @InsType = CONVERT(tinyint,'"+ insData.INSTYPE +"'); \
                      SET @TrnType = 2; \
                      SET @ServDate = '"+ insData.EXPIRATIONDATE +"'; \
                      SET @FromDate = '"+ insData.EFFECTIVEDATE +"'; \
                      SET @EntryDate = GETDATE(); \
                      SET @UserId = '"+ insData.USERID +"'; \
                      SET @Deduction = '"+ insData.DEDUCTION +"'; \
                      SET @Coverage =  "+ xrxStr.strQuote(insData.COVERAGETYPE) +"; \
                      SET @PrimaryId = '"+ insData.PRIMARYID +"'; \
                      SET @GroupPolicyNo = "+ xrxStr.strQuote(insData.GROUPPOLICYNO) +"; \
                      SET @GroupPlanName = "+ xrxStr.strQuote(insData.GROUPPLANNAME) +"; \
                      SET @FirstName = "+ xrxStr.strQuote(insData.FIRSTNAME) +"; \
                      SET @LastName = "+ xrxStr.strQuote(insData.LASTNAME) +"; \
                      SET @Birthdate = '"+ insData.DATEOFBIRTH +"'; \
                      \
                      SET @NewPatInsId = NEWID(); \
                      IF(@InsType = 1) \
  		                  SET @PatInsId = (SELECT PrmInsId FROM xrxPat WHERE PatId = @PatId); \
  	                  ELSE IF(@InsType = 2) \
                        SET @PatInsId = (SELECT SecInsId FROM xrxPat WHERE PatId = @PatId); \
  	                  ELSE IF(@InsType = 3) \
  		                  SET @PatInsId = (SELECT SupInsId FROM xrxPat WHERE PatId = @PatId); \
                      \
                      IF(@Birthdate = '') \
                        SET @Birthdate = NULL; \
                      ELSE \
                      SET @Birthdate = CONVERT(datetime, @Birthdate); \
                      \
                      IF(@ServDate = '') \
                        SET @ServDate = NULL; \
                      ELSE \
                        SET @ServDate = CONVERT(smalldatetime, @ServDate); \
                      \
                      IF(@FromDate = '') \
                        SET @FromDate = NULL; \
                      ELSE  \
                        SET @FromDate = CONVERT(smalldatetime, @FromDate); \
                      \
                      IF(@InsName IS NOT NULL OR @InsName <> '') \
                      BEGIN  \
                        SET @InsId = (SELECT TOP 1 RecNo FROM xrxIns WHERE InsName = @InsName); \
                      END \
                      ELSE IF ((@InsZip IS NOT NULL OR @InsZip <> '') AND (@InsPayorId IS NOT NULL OR @InsPayorId <> ''))  \
                      BEGIN \
                        SET @InsId = (SELECT TOP 1 RecNo FROM xrxIns WHERE (Zip = @InsZip AND PayorId = @InsPayorId)); \
                      END  \
                      ELSE IF(@InsPayorId IS NOT NULL OR @InsPayorId <> '') \
                      BEGIN \
                        SET @InsId = (SELECT TOP 1 RecNo FROM xrxIns WHERE (PayorId = @InsPayorId)); \
                      END  \
                      \
                      IF(@InsId IS NULL) \
                      BEGIN  \
                      SET @InsId = NEWID(); \
                        INSERT INTO xrxIns (RecNo, InsName, PayorId, Addr, City, State, Zip, Phone, Web) \
                        VALUES (@InsId, @InsName,  (CASE WHEN @InsPayorId = '' THEN null ELSE @InsPayorId END), @InsAddr, @InsCity, @InsState, (CASE WHEN @InsZip = '' THEN null ELSE @InsZip END), @InsPhone, @InsWeb); \
                      END \
                    END;  ";

      var sqlUpdate = "BEGIN \
                        UPDATE xrxPatIns SET \
                          PatId = @PatId, \
                          ParentId = @PatId, \
                          TrnType = @TrnType, \
                          ServDate = @ServDate, \
                          FromDate = @FromDate, \
                          EntryDate = @EntryDate, \
                          UserId = @UserId, \
                          InsType = @InsType, \
                          InsId = @InsId, \
                          InsName = @InsName, \
                          Active = 'true', \
                          Coverage = @Coverage, \
                          PrimaryId = @PrimaryId, \
                          GroupPolicyNo = @GroupPolicyNo, \
                          GroupPlanName = @GroupPlanName, \
                          FirstName = @FirstName, \
                          LastName =  @LastName, \
                          Birthdate = @Birthdate \
                          WHERE RecNo = @PatInsId; \
                          \
                          SELECT @PatInsId AS PatInsIdRecNo; \
                        END;  ";

    var sqlInsertArchive = "BEGIN \
                  \
                  INSERT INTO \
                  xrxPatIns (RecNo, PatId, ParentId, TrnType, ServDate, FromDate, EntryDate, UserId, InsType, InsId, InsName, Active, Coverage, PrimaryId, GroupPolicyNo, GroupPlanName, FirstName, LastName, Birthdate)  \
                  VALUES (@NewPatInsId, @PatId, @PatId, @TrnType, @ServDate, @FromDate, @EntryDate, @UserId, @InsType, @InsId, @InsName, 'true', @Coverage, (CASE WHEN @PrimaryId = '' THEN null ELSE @PrimaryId END), @GroupPolicyNo, @GroupPlanName, @FirstName, @LastName, @Birthdate); \
                  \
                  IF(@PatInsId IS NOT NULL OR @PatInsId <> '') \
                  BEGIN \
                    DECLARE @EndDate datetime; \
                     \
                    SET  @EndDate = (SELECT ServDate FROM xrxPatIns WHERE RecNo = @PatInsId); \
                    \
                    IF(@EndDate IS NULL OR @EndDate = '') \
                    BEGIN \
                      IF((@FromDate IS NOT NULL OR @FromDate <> '')) \
                        BEGIN \
                          SET @EndDate =  DATEADD(day, -1, @FromDate) \
                        END \
                      ELSE \
                        BEGIN \
                          SET @EndDate =  DATEADD(dd, -1, DATEDIFF(dd, 0, GETDATE())); \
                        END \
                    END \
                     \
                    UPDATE xrxPatIns SET Active = 'false', ServDate = @EndDate WHERE RecNo = @PatInsId; \
                  END \
                  \
                  IF(@InsType = 1) \
                  BEGIN \
                    UPDATE xrxPat set PrmInsId = @NewPatInsId WHERE PatId = @PatId; \
                    SELECT PrmInsId AS PatInsIdRecNo FROM xrxPat WHERE PatId = @PatId; \
                  END \
                  ELSE IF(@InsType = 2) \
                  BEGIN \
                    UPDATE xrxPat set SecInsId = @NewPatInsId WHERE PatId = @PatId; \
                    SELECT SecInsId AS PatInsIdRecNo FROM xrxPat WHERE PatId = @PatId; \
                  END \
                  ELSE IF(@InsType = 3) \
                  BEGIN \
                    UPDATE xrxPat set SupInsId = @NewPatInsId WHERE PatId = @PatId; \
                    SELECT SupInsId AS PatInsIdRecNo FROM xrxPat WHERE PatId = @PatId; \
                  END \
              END;  ";





    var sqlSaveTrn = "";
      if(isArchive)
      {
        sqlSaveTrn = " BEGIN TRY "+
                  " BEGIN TRANSACTION PATINS "+
                    sqlSave +"   "+ sqlInsertArchive +
                  " COMMIT TRANSACTION PATINS "+
                  " END TRY "+
                  " BEGIN CATCH "+
                  " IF @@TRANCOUNT>0 ROLLBACK TRANSACTION PATINS "+
                  " END CATCH ";


      }
      else
      {
        sqlSaveTrn = " BEGIN TRY "+
                  " BEGIN TRANSACTION PATINS "+
                    sqlSave +"   "+ sqlUpdate +
                  " COMMIT TRANSACTION PATINS "+
                  " END TRY "+
                  " BEGIN CATCH "+
                  " IF @@TRANCOUNT>0 ROLLBACK TRANSACTION PATINS "+
                  " END CATCH ";
      }



      //console.log("******************* Query*********************");
      // console.log(isArchive);
      // console.log(sqlSaveTrn);

      dbhelper.query(sqlSaveTrn, function (err, record) {
              if ((!err) || typeof err == 'undefined') {
                  //console.log(record);
                  //callback("Success.", true);
                  if(record && record.length > 0){
                    console.log(record[0].PATINSIDRECNO.value);
                    var parameters = [
                      {parameter: 'PatId', type: 'VarChar', value: insData.PATID},
                      {parameter: 'ImgType', type: 'VarChar', value: insData.INSTYPENAME},
                      {parameter: 'UserId', type: 'VarChar', value: insData.USERID},
                      {parameter: 'PatInsRecNo', type: 'UniqueIdentifier', value: record[0].PATINSIDRECNO.value},
                      {parameter: 'Image', type: 'Image', value: bufferPdf}
                    ];
                    var sqlSavePdf = "INSERT INTO xrxPatInsCard (RecNo , PatInsRecNo, PatId, InsCard, ScanDate, UserId, ThumbNail, ImgType, Removedate)"+
                                     "VALUES (NEWID(), @PatInsRecNo, @PatId, @Image, GETDATE(), @UserId, NULL, @ImgType, NULL)";
                    //console.log(sqlSavePdf);
                    dbhelper_i.queryWithParams(sqlSavePdf, parameters, function (err, record) {
                            if ((!err) || typeof err == 'undefined') {
                                callback("Success.", true);
                            }
                            else{
                                callback('Error: ' + err, false);//Error in sqlUpdateCheckin
                            }
                    });
                  }
                  else{
                    callback('Error: ' + 'There was an error saving insurance information.', false);
                  }

              }
              else{
                  callback('Error: ' + err, false);//Error in sqlUpdateCheckin
              }
      });
};

exports.xrxAcuantScan_SaveDL = function (dlData, bufferPdf, callback) {


  var mi = dlData.MIDDLENAME ? dlData.MIDDLENAME.charAt(0) : "";


  var sqlArchive = "    BEGIN "+
  "INSERT INTO xrxPatHist  \
  (RecNo, ArchiveDate, PatId, LastName, FirstName, Title, Mi, DriverLicense, Sex, Marital,  \
  Addr, Addr2, City, State, Zip, Country,  \
  Phone, CellPhone, Email, \
  PatRelToRsp, RelName, RelPhone,  \
  ChartNo, Collection, CollectionDate, RefPhysician, RefPerson, \
  Emp, EmpWorkPhone, EmpWorkPhoneExt, EmpStatus, Occupation, Alias, \
  DctId, FclId, Coverage, RelRelation, EmergName,  \
  Release_of_Information_Code, Patient_Signature_Source_Code, RetiredDate, Photo, \
  RspLastName, RspFirstName, RspMi, RspTitle, RspDriverLicense, \
  RspAddr, RspAddr2, RspCity, RspState, RspZip, RspCountry, \
  RspPhone, RspCellPhone, RspWorkPhone, RspWorkPhoneExt, RspEmail) \
  SELECT NEWID(), GETDATE(), pat.PatId, pat.LastName, pat.FirstName, pat.Title, pat.Mi,  \
  pat.DriverLicense, pat.Sex, pat.Marital,  \
  pat.Addr, pat.Addr2, pat.City, pat.State, pat.Zip, pat.Country,  \
  pat.Phone, pat.CellPhone, pat.Email, \
  pat.PatRelToRsp, pat.RelName, pat.RelPhone,  \
  pat.ChartNo, pat.Collection, pat.CollectionDate, pat.RefPhysicianId, pat.RefPerson, \
  pat.EmpId, pat.EmpWorkPhone, pat.EmpWorkPhoneExt, pat.EmpStatus, pat.Occupation, pat.Alias, \
  pat.DctId, pat.FclId, pat.Coverage, pat.RelRelation, pat.EmergName,  \
  pat.Release_of_Information_Code, pat.Patient_Signature_Source_Code, pat.RetiredDate, pat.Photo, \
  rsp.LastName, rsp.FirstName, rsp.Mi, rsp.Title, rsp.DriverLicense, \
  rsp.Addr, rsp.Addr2, rsp.City, rsp.State, rsp.Zip, rsp.Country, \
  rsp.Phone, rsp.CellPhone, rsp.EmpWorkPhone, rsp.EmpWorkPhoneExt, rsp.Email FROM xrxPat pat  \
  LEFT JOIN xrxRsp rsp ON pat.RspId = rsp.RecNo \
  WHERE pat.PatId = '"+ dlData.PATID +"'; \
  END;    ";

    var sqlInsertUpdate =   "BEGIN \
                \
                DECLARE @PatId varchar(50); \
      	        DECLARE @UserId varchar(11); \
      	        DECLARE @FirstName varchar(35); \
      	        DECLARE @MiddleName varchar(35); \
      	        DECLARE @LastName varchar(35); \
      	        DECLARE @PatName varchar(100); \
      	        DECLARE @Birthdate datetime; \
      	        DECLARE @DriverLicense varchar(16); \
      	        DECLARE @Sex varchar(1); \
      	        DECLARE @Addr varchar(55); \
      	        DECLARE @City varchar(25); \
      	        DECLARE @State varchar(2); \
      	        DECLARE @Zip varchar(10); \
                \
                SET @PatId =	(SELECT PatId FROM xrxPat WHERE PatId = '"+ dlData.PATID +"'); \
            	  SET @UserId = '"+ dlData.USERID +"'; \
            	  SET @FirstName = '"+ dlData.FIRSTNAME +"'; \
            	  SET @MiddleName = '"+ mi +"'; \
            	  SET @LastName = '"+ dlData.LASTNAME +"'; \
            	  SET @PatName = @LastName + ', ' + @FirstName; \
            	  SET @Birthdate = '"+ dlData.DATEOFBIRTH +"'; \
            	  SET @DriverLicense = '"+ dlData.LICENSENUMBER +"'; \
            	  SET @Sex = '"+ dlData.SEX +"'; \
            	  SET @Addr = '"+ dlData.ADDR +"'; \
            	  SET @City = '"+ dlData.CITY +"'; \
            	  SET @State = '"+ dlData.STATE +"'; \
             	  SET @Zip = '"+ dlData.ZIP +"'; \
                \
            	  IF(@Birthdate = '') \
            	  SET @Birthdate = NULL; \
            	  ELSE \
            	  SET @Birthdate = CONVERT(datetime, @Birthdate); \
                \
                IF(@PatId IS NULL OR @PatId = '') \
            	  BEGIN \
              		  INSERT INTO xrxPat (PatId, UserId, PatName, FirstName, Mi, LastName, DriverLicense, Sex, Birthdate, Addr, City, State, Zip) \
              		  VALUES ('"+ dlData.PATID +"', @UserId, @PatName, @FirstName, @MiddleName, @LastName, @DriverLicense, @Sex, @Birthdate,  @Addr,  @City, @State, @Zip); \
                    SELECT RECNO FROM xrxPat WHERE PatId = '"+ dlData.PATID +"'; \
                END \
            	  ELSE \
            	  BEGIN \
                    " + sqlArchive  +
                    "   UPDATE xrxPat SET PATNAME = @PatName, FirstName = @FirstName, Mi = @MiddleName, LastName = @LastName, DriverLicense = @DriverLicense, Sex = @Sex, Birthdate = @Birthdate, Addr = @Addr, City = @City, State = @State, Zip = @Zip WHERE PatId = @PatId; \
            		        SELECT RECNO FROM xrxPat WHERE PatId = @PatId; \
            	  END \
          END;";

  var sqlSave = " BEGIN TRY "+
                " BEGIN TRANSACTION PATDL "+
                  sqlInsertUpdate +
                " COMMIT TRANSACTION PATDL "+
                " END TRY "+
                " BEGIN CATCH "+
                " IF @@TRANCOUNT>0 ROLLBACK TRANSACTION PATDL "+
                " END CATCH "

    //console.log(sqlSave);
    dbhelper.query(sqlSave, function (err, record) {
            if ((!err) || typeof err === 'undefined') {
                //console.log(record);
                //callback("Success.", true);
                if(record && record.length > 0){
                  //console.log(record[0].RECNO.value);
                  var parameters = [
                    {parameter: 'PatId', type: 'VarChar', value: dlData.PATID},
                    {parameter: 'UserId', type: 'VarChar', value: dlData.USERID},
                    {parameter: 'PatRecNo', type: 'UniqueIdentifier', value: record[0].RECNO.value},
                    {parameter: 'Image', type: 'Image', value: bufferPdf}
                  ];
                  var sqlSavePdf = "INSERT INTO xrxPatDriversLicense (RecNo , PatRecNo, PatId, DriversLicense, ScanDate, UserId, Removedate)"+
                                   "VALUES (NEWID(), @PatRecNo, @PatId, @Image, GETDATE(), @UserId, NULL)";
                  //console.log(sqlSavePdf);
                  dbhelper_i.queryWithParams(sqlSavePdf, parameters, function (err, record) {
                          if ((!err) || typeof err == 'undefined') {
                              callback("Success.", true);
                          }
                          else{
                              callback('Error: ' + err, false);//Error in sqlUpdateCheckin
                          }
                  });
                }
                else{
                  console.log(err);
                  callback('Error: ' + 'There was an error saving Drivers License information.', false);
                }
            }
            else{
                callback('Error: ' + err, false);//Error in sqlUpdateCheckin
            }
    });
};

exports.xrxAcuantScan_Test = function (callback) {
  var sqlTest = "UPDATE xrxPatInsCard set UserId = 'AA' where RECNO = '68C78BBE-690D-4212-B648-70B46ABB24BE'";
  dbhelper_i.query(sqlTest, function (err, record) {
          if ((!err) || typeof err == 'undefined') {
              callback("Success.", true);
          }
          else{
              callback('Error: ' + err, false);//Error in sqlUpdateCheckin
          }
  });
};

exports.xrxAcuantScan_SaveMedicalCard = function (image, callback) {
  console.log(image);
  //var arrImage = converter.decode(image);
  parameters = [
    {parameter: 'PatId', type: 'VarChar', value: '1111'},
    {parameter: 'Image', type: 'Image', value: image}
  ];
  var sqlSave =   "INSERT INTO xrxPatInsCard (RecNo , PatInsRecNo, PatId, InsCard, ScanDate, UserId, ThumbNail, ImgType, Removedate)"+
                  "VALUES (NEWID(), 'D80F1237-C84B-4B23-B77D-04FF8C010ACA', @PatId, @Image, GETDATE(), 'A', NULL, 'PRIMARY', NULL)";
  console.log(sqlSave);
  dbhelper_i.queryWithParams(sqlSave, parameters, function (err, record) {
          if ((!err) || typeof err == 'undefined') {
              callback("Success.", true);
          }
          else{
              callback('Error: ' + err, false);//Error in sqlUpdateCheckin
          }
  });
};

exports.xrxAcuantScan_LoadMedicalCard = function (patId, callback) {
    var sqlLoad =   "select * from xrxPatInsCard where PATID = '"+patId+"'";
    sqlLoad = "select * from xrxPatInsCard";
    console.log(sqlLoad);
    dbhelper_i.query(sqlLoad, function (err, record) {
            if ((!err) || typeof err == 'undefined') {
                callback("Success.", record);
            }
            else{
                callback('Error: ' + err, null);//Error in sqlUpdateCheckin
            }
    });
};
