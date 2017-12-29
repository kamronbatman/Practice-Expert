var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var dbhelper = remote.getGlobal('dbhelper');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");
var nodemailer = require(nodeModulesPath + 'nodemailer');

exports.getOptions = function(userId, callback) {
    sp = "xrxEhr_Options2_sp";
    parameters = [
        {parameter: 'UserId', type: 'VarChar', value: userId},
        {parameter: 'OptName', type: 'VarChar', value: 'Clinical Summary'},
        {parameter: 'VisitType', type: 'VarChar', value: ''}
    ];

  dbhelper.storeProcedure(sp, parameters, function (err, record) {
    // console.log("Error.....");
    // console.log(err);
    // console.log("Record.....");
    // console.log(record);

    callback(err, record);
  });
};

exports.saveOptions = function(userId, data, callback) {
  var tempColStr = "";
  for (var key in data)
  {
    if (data.hasOwnProperty(key))
    {
      //console.log(key);
      tempColStr = tempColStr + ", ["+ key +"] = '"+ data[key] +"'  ";

    }
  }

  var colStr = tempColStr.slice(1);

  //console.log(colStr);

  var sql = "UPDATE xrxEhr_options2 SET  "+ colStr +"  WHERE (UserId = '"+ userId +"') AND (OptName = 'Clinical Summary') AND (isNull(VisitType, '') = '') " ;

        //console.log(sql);

  dbhelper.query(sql,  function (err, record) {

      // console.log("Error.....");
      // console.log(err);
      // console.log("Record.....");
      // console.log(record);

      callback(err, record);

  });

};

exports.getClinicalSummaryTemplate = function (callback) {

  var sql = "select RecNo, FormHtml from xrxForms_List where FormName = 'Clinical Summary'";

  dbhelper.query(sql,  function (err, record) {

    // console.log("Error.....");
    // console.log(err);
    // console.log("Record.....");
    // console.log(record);
    callback(err, record);

  });
};

exports.getClinicalSummaryData = function (patId, dateOfVisit, license, userId, callback) {

  var sql = "select RecNo, FormSql from xrxForms_List where FormName = 'Clinical Summary'";

  dbhelper.query(sql, function (err, record) {

      if(err)
      {
        callback(err, record);
      }
      else
      {
          if(record && record.length > 0)
          {
              if(record[0].FORMSQL.value)
              {
                  var sqlClinicalSummary = record[0].FORMSQL.value;

                  d = new Date(dateOfVisit);
                  //If date is coming as utc.
                  offset = d.getTimezoneOffset()/60;
                  d.setHours(d.getHours() - offset);

                  parameters = [
                    {parameter: 'PatId', type: 'VarChar', value: patId},
                    {parameter: 'DateOfVisit', type: 'SmallDateTime', value: d},
                    {parameter: 'UserId', type: 'VarChar', value: userId},
                    {parameter: 'License', type: 'VarChar', value: license}
                  ];

                  dbhelper.queryWithParams(sqlClinicalSummary, parameters, function (err1, record1) {

                      callback(err1, record1);
                  });
              }
              else
              {
                  callback("Function : getClinicalSummaryData -> No SQL Value Found for Clinical Summary in Record", null);
              }

          }
          else
          {
            callback("Function : getClinicalSummaryData -> No Record Found in xrxForms_List", null);
          }

      }

  });


}


exports.sendSummaryToPortal = function(patId, userId, dateOfVisit, dctId, img, callback){


  var noteType = 'ToPat';
  var notes = 'Please click on the button (Open Attached Pdf)  to view your Summary document.';
  var subject = 'Clinical Summary';


  var sql =    "insert into xrxPatNotes(Recno, PatId, NoteDate, NoteType, Notes, Subject, UserId, DateOfVisit, DctId, Img) \
               values (NEWID(), '"+ patId +"', GETDATE(), '"+ noteType +"', '"+ notes +"', '"+ subject +"', '"+ userId +"', '"+ dateOfVisit +"', '"+ dctId +"', @img);";

  var parameters = [
     {parameter: 'img', type: 'VarBinary', value: img}
  ];

   dbhelper.queryWithParams(sql, parameters, function (err, record) {

     callback(err, record);

   });

}

exports.sendEmailToPatient = function(email, license, firstName, patientName,  callback){


    //Send email
     var toEmail = email;
     var transporter = nodemailer.createTransport({
       host:   "smtp.sendgrid.net",
       port: "587",
       auth: {
         user: "tmagami@cal-med.com",
         pass: "VaL@RM0rghul1s"
       }
     });
     var mailOptions = {
       from: "info@cal-med.com", // sender address
       to: toEmail, // list of receivers
       subject: "Information about a past visit to " + license, // Subject line
       text: '', // plaintext body
       html: "<p>Dear "+ firstName +",</p> \
              <p>A Clinical Summary of a past visit is now available for "+ patientName +". <br /> \
              Please click the link below or copy and paste it into your browser. <br /> \
              <p><a href='https://portal.cal-med.com/'>https://portal.cal-med.com/</a></p> <br /> \
              Thank you for being a patient of "+ license +".</p>"// html body
     };

     transporter.sendMail(mailOptions, function(error, info){

        // console.error(error);
        // console.log(info);
        callback(error, info);

      });

}
