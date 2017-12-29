var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.getUnReadMessages = function (fromDate, toDate, callback) {

    var sql = "select notes.NoteDate, pat.patId, pat.PatName, Notes.[Subject], pat.Email, isNull(pat.CellPhone, pat.Phone) as Phone from xrxpatnotes notes \
               join xrxPat pat on (pat.PatId = notes.PatId) \
               where notes.NoteType = 'ToPat' and (isNull(notes.isRead, 0) = 0) and (notes.NoteDate BETWEEN "+ xrxStr.datQuote(fromDate) +" AND "+ xrxStr.datQuote(toDate) +" )  \
               order by notes.NoteDate desc, pat.PatId";

               //console.log(sql);

    dbhelper.query(sql, function (err, record) {

        // console.log("Error.....");
        // console.log(err);
        // console.log("Record.....");
        // console.log(record);
        callback(err, record);

    });
}


exports.getDidNotRegisters = function (fromDate, toDate, callback) {

    var sql = "select [PortalInviteDate], patId, PatName, Email, isNull(CellPhone, Phone) as Phone from xrxpat \
               where (isNull(email, '') <> '') and ([PortalInviteDate] is not null) and (isNull(isPortalRegistered, 0) = 0) and ( [PortalInviteDate]  BETWEEN "+ xrxStr.datQuote(fromDate) +" AND "+ xrxStr.datQuote(toDate) +"  ) \
               order by [PortalInviteDate] desc, PatId";

    dbhelper.query(sql, function (err, record) {

        // console.log("Error.....");
        // console.log(err);
        // console.log("Record.....");
        // console.log(record);
        callback(err, record);

    });
}
