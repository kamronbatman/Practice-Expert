var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.nppGet = function (patId, callback) {
    var sql =  "select * from xrxNpp where PatId = " + xrxStr.strQuote(patId);
    dbhelper.query(sql, function (err, record) {
        if (err) {
            callback('Error: ' + err, record);
        }
        else if (record.length === 0) {
            record[0] = {
                RECNO : {value : ''},
                PATID : {value : patId},
                NPPDATE : {value : ''},
                DELIVERYMETHOD : {value : ''},
                ISSIGNEDACKNOLEDGEMENTONFILE : {value : ''},
                SIGNEDACKNOLEDGEMENTONFILEDATE : {value : ''},
                ISREFUSED : {value : ''},
                REFUSEDNOTE : {value : ''},
                MSGATHOME : {value : ''},
                MSGATWORK : {value : ''},
                MSGWITHANYONEATHOME : {value : ''},
                MSGATCELL : {value : ''},
                ADVDIRCOM : {value : ''},
                ADVDIRTYP : {value : ''},
                REVIEWDATE : {value : ''},
                MSGEMAIL : {value : ''},
                RETRIEVEMEDHIST : {value : true},
                CONSENTTOHIE : {value : true},
                ADVDIRNOTE : {value : ''},
                DIRECTADDR : {value : ''}
            };
        }
        // else {

        //     if (record[0].RECNO.value === null)
        //         record[0].RECNO.value = '';
        //     if (record[0].PATID.value === null)
        //         record[0].PATID.value = '';
        //     if (record[0].NPPDATE.value === null)
        //         record[0].NPPDATE.value = '';
        //     if (record[0].DELIVERYMETHOD.value === null)
        //         record[0].DELIVERYMETHOD.value = '';
        //     if (record[0].ISSIGNEDACKNOLEDGEMENTONFILE.value === null)
        //         record[0].ISSIGNEDACKNOLEDGEMENTONFILE.value = '';
        //     if (record[0].SIGNEDACKNOLEDGEMENTONFILEDATE.value === null)
        //         record[0].SIGNEDACKNOLEDGEMENTONFILEDATE.value = '';
        //     if (record[0].ISREFUSED.value === null)
        //         record[0].ISREFUSED.value = '';
        //     if (record[0].REFUSEDNOTE.value === null)
        //         record[0].REFUSEDNOTE.value = '';
        //     if (record[0].MSGATHOME.value === null)
        //         record[0].MSGATHOME.value = '';
        //     if (record[0].MSGATWORK.value === null)
        //         record[0].MSGATWORK.value = '';
        //     if (record[0].MSGWITHANYONEATHOME.value == null)
        //         record[0].MSGWITHANYONEATHOME.value = '';
        //     if (record[0].MSGATCELL.value === null)
        //         record[0].MSGATCELL.value = '';
        //     if (record[0].ADVDIRCOM.value === null)
        //         record[0].ADVDIRCOM.value = '';
        //     if (record[0].ADVDIRTYP.value === null)
        //         record[0].ADVDIRTYP.value = '';
        //     if (record[0].REVIEWDATE.value === null)
        //         record[0].REVIEWDATE.value = '';
        //     if (record[0].MSGEMAIL.value === null)
        //         record[0].MSGEMAIL.value = '';
        //     if (record[0].RETRIEVEMEDHIST.value === null)
        //         record[0].RETRIEVEMEDHIST.value = 'true';
        //     if (record[0].CONSENTTOHIE.value === null)
        //         record[0].CONSENTTOHIE.value = 'true';
        //     if (record[0].ADVDIRNOTE.value === null)
        //         record[0].ADVDIRNOTE.value = '';
        //     if (record[0].DIRECTADDR.value === null)
        //         record[0].DIRECTADDR.value = '';
        // }
        callback(null , record);
    });
};
exports.nppSave = function (
        RecNo,
        patId,
        NppDate,
        DeliveryMethod,
        IsSignedAcknoledgementOnFile,
        SignedAcknoledgementOnFileDate,
        IsRefused,
        RefusedNote,
        MsgAtHome,
        MsgAtWork,
        MsgWithAnyoneAtHome,
        MsgAtCell,
        AdvDirCom,
        AdvDirTyp,
        ReviewDate,
        MsgEmail,
        RetrieveMedHist,
        ConsentToHIE,
        AdvDirNote,
        DirectAddr,
        callback)
        {
          if (RecNo) {
              //var s1 = AdvDirNote.replace(/'/g, "''");
              var sqlupdate =
                  "update xrxNpp set " +
                      " patId = " + xrxStr.strQuoteComma(patId) +
                      " NppDate = " + xrxStr.strQuoteComma(NppDate) +
                      " DeliveryMethod = " + xrxStr.strQuoteComma(DeliveryMethod) +
                      " IsSignedAcknoledgementOnFile = " + xrxStr.bolQuoteComma(IsSignedAcknoledgementOnFile) +
                      " SignedAcknoledgementOnFileDate = " + xrxStr.strQuoteComma(SignedAcknoledgementOnFileDate) +
                      " IsRefused = " + xrxStr.bolQuoteComma(IsRefused) +
                      " RefusedNote = " + xrxStr.strQuoteComma(RefusedNote) +
                      " MsgAtHome = " + xrxStr.bolQuoteComma(MsgAtHome) +
                      " MsgAtWork = " + xrxStr.bolQuoteComma(MsgAtWork) +
                      " MsgWithAnyoneAtHome = " + xrxStr.bolQuoteComma(MsgWithAnyoneAtHome) +
                      " MsgAtCell = " + xrxStr.bolQuoteComma(MsgAtCell) +
                      " AdvDirCom = " + xrxStr.bolQuoteComma(AdvDirCom) +
                      " AdvDirTyp = " + xrxStr.strQuoteComma(AdvDirTyp) +
                      " ReviewDate = " + xrxStr.strQuoteComma(ReviewDate) +
                      " MsgEmail = " + xrxStr.bolQuoteComma(MsgEmail) +
                      " RetrieveMedHist = " + xrxStr.bolQuoteComma(RetrieveMedHist) +
                      " ConsentToHIE = " + xrxStr.bolQuoteComma(ConsentToHIE) +
                      " AdvDirNote = " + xrxStr.strQuoteComma(AdvDirNote) +
                      " DirectAddr = " + xrxStr.strQuote(DirectAddr) +
                  "where RecNo = " + xrxStr.strQuote(RecNo);
                  //console.log(sqlupdate);
                  //ert(sqlupdate);
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
                  "insert into xrxNpp(patId, NppDate, DeliveryMethod, IsSignedAcknoledgementOnFile, SignedAcknoledgementOnFileDate, IsRefused, RefusedNote, MsgAtHome, MsgAtWork, MsgWithAnyoneAtHome, MsgAtCell, AdvDirCom, AdvDirTyp, ReviewDate, MsgEmail, RetrieveMedHist, ConsentToHIE, AdvDirNote, DirectAddr) " +
                  " values(" +
                      xrxStr.strQuoteComma(patId) +
                      xrxStr.strQuoteComma(NppDate) +
                      xrxStr.strQuoteComma(DeliveryMethod) +
                      xrxStr.bolQuoteComma(IsSignedAcknoledgementOnFile) +
                      xrxStr.bolQuoteComma(SignedAcknoledgementOnFileDate) +
                      xrxStr.bolQuoteComma(IsRefused) +
                      xrxStr.strQuoteComma(RefusedNote) +
                      xrxStr.bolQuoteComma(MsgAtHome) +
                      xrxStr.bolQuoteComma(MsgAtWork) +
                      xrxStr.bolQuoteComma(MsgWithAnyoneAtHome) +
                      xrxStr.bolQuoteComma(MsgAtCell) +
                      xrxStr.strQuoteComma(AdvDirCom) +
                      xrxStr.strQuoteComma(AdvDirTyp) +
                      xrxStr.strQuoteComma(ReviewDate) +
                      xrxStr.bolQuoteComma(MsgEmail) +
                      xrxStr.bolQuoteComma(RetrieveMedHist) +
                      xrxStr.bolQuoteComma(ConsentToHIE) +
                      xrxStr.strQuoteComma(AdvDirNote) +
                      xrxStr.strQuote(DirectAddr) +
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
