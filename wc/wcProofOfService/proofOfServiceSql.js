var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");
var cmGlb = remote.getGlobal('cmGlb');
var moment = require(nodeModulesPath + 'moment');

exports.printProofOfService = function (para, callback) {

          var child = require('child_process').execFile;

          //Change this path
          var executablePath = cmGlb.mainFolder + "xrxRpCrystalReports.exe";
          //var executablePath = "c:\\calmed\\xrxReporting.exe";
          //var executablePath = "D:\\Calmed_NodeJs\\Supporting_Projects\\xrxReporting_VS10\\xrxReporting_VS10\\bin\\Debug\\xrxReporting_VS10";

            var report1 = '';
            if (para.ITEMIZEDSTATEMENTDATE) {
              report1 = 'Itemized Statement';
              report1 = report1 + ' sent on ' + moment.utc(para.ITEMIZEDSTATEMENTDATE).format("MM/DD/YYYY");
            }

            var report2 = '';
            if(para.MEDICALREPORT) {
              console.log(para.MEDICALREPORT);
              report2 = para.MEDICALREPORT;
              if(para.INITIALREPORTDATE){
                report2 = report2 + ' sent on ' + moment.utc(para.INITIALREPORTDATE).format("MM/DD/YYYY");
              }

              console.log(report2);
              if(report1 == '')
              {
                report1 = report2; report2 = '';
              }
            }

            var report3 = '';
            if(para.REVIEWOFRECORDS) {
              report3 = 'Review Of Records';
              if(report1 == '')
              {
                report1 = report3; report3 = '';
              }
              else if (report2 == '') {
                report2 = report3; report3 = '';
              }
            }

            var report4 = '';
            if(para.MEDICATION)
            {
              report4 = 'Office Dispensed Medication Prescription';
              if(para.DISPENSEDATE) {
                report4 = report4 + ' on ' + moment.utc(para.DISPENSEDATE).format("MM/DD/YYYY");
              }

              if(report1 == '') {
                report1 = report4; report4 = '';
              }
              else if (report2 == '') {
                report2 = report4; report4 = '';
              }
              else if (report3 == '') {
                report3 = report4; report4 = '';
              }
            }

            var report5 = '';
            if(para.OTHER)
            {
              report5 = para.OTHER;
              if(report1 == '') {
                report1 = report5; report5 = '';
              }
              else if (report2 == '') {
                report2 = report5; report5 = '';
              }
              else if (report3 == '') {
                report3 = report5; report5 = '';
              }
              else if (report4 == '') {
                report4 = report5; report5 = '';
              }
            }
            var reportParameters = {

             'CompanyName'  : para.COMPANYNAME,
             'ProviderName' : para.PROVIDERNAME,
             '@PatId' : para.PATID,
             '@EmployedBy' : para.EMPLOYEDBY,
             '@County' : para.COUNTY,
             '@Street1' : para.STREET1,
             '@Street2' : para.STREET2,
             '@City' : para.CITY,
             '@State' : para.STATE,
             '@Zip' : para.ZIP,
             '@PrevDate' : para.PREVDATE,
             '@report1' : report1,
             '@report2' : report2,
             '@report3' : report3,
             '@report4' : report4,
             '@report5' : report5,
             '@report6' : '',
             '@PrmInsurance' : para.PRMINSURANCE ? 'Y' : '',
             '@SecInsurance' : para.SECINSURANCE ? 'Y' : '',
             '@PlaintiffAttorney' : para.PLAINTIFFATTORNEY ? 'Y' : '',
             '@DefenseAttorney' : para.DEFENSEATTORNEY ? 'Y' : '' ,
             '@CoDefenseAttorney' : para.CODEFENSEATTORNEY ? 'Y' : '',
             '@RefPhysician' : para.REFPHYSICIAN ? 'Y' : '',
             '@Employer' : para.EMPLOYER ? 'Y' : '',
             '@Patient' : para.PATIENT ? 'Y' : '',
             '@DEUOffice' : para.DEUOFFICE,
             '@PersonServing' : para.PERSONSERVING,
          };

          var reportParametersStr =  JSON.stringify(reportParameters);
          var parameters = [cmGlb.connectionDataSourceName, dbhelper.config.options.database, dbhelper.config.userName, dbhelper.config.password, "ProofOfService" , para.TEMPLATE, cmGlb.mainFolder, reportParametersStr];

          child(executablePath, parameters, function(err, data) {

              if(err) {
                console.log(err);
                callback(err , null);
              }
              else {
                //console.log(data.toString());
                callback(null , record);
              }

          });

}

exports.xmlGetParam = function (callback) {

    var sql = "select XmlText from xrxParam where ParamName = 'POS'";

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

  var sql = "DELETE FROM xrxParam WHERE ParamName = 'POS';  INSERT INTO xrxParam (ParamName, XmlText, EntryDate, UserId) VALUES ('POS', '"+xmlText+"', GETDATE(), '"+userId+"');"

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
