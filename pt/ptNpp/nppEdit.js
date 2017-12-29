var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var moment = require(nodeModulesPath + 'moment');
var Handlebars = require(nodeModulesPath + 'handlebars');
var cmGlb = remote.getGlobal('cmGlb');

var sqlPtNpp = require(appPath + "/pt/ptNpp/nppSql.js");

function getQueryStringValue (key)
{
    return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

var patId = cmGlb.patId;
console.log(cmGlb.isSqlAzure);

$(document).keydown(function(e) {
  // Set self as the current item in focus
  var self = $(':focus'),
      // Set the form by the current item in focus
      form = self.parents('form:eq(0)'),
      focusable;
  // Array of Indexable/Tab-able items
  focusable = form.find('input,a,select,button,textarea,div[contenteditable=true]').filter(':visible');
  function enterKey(){
    if (e.which === 13 && !self.is('textarea,div[contenteditable=true]')) { // [Enter] key
      // If not a regular hyperlink/button/textarea
      if ($.inArray(self, focusable) && (!self.is('a,button'))){
        // Then prevent the default [Enter] key behaviour from submitting the form
        e.preventDefault();
      } // Otherwise follow the link/button as by design, or put new line in textarea
      // Focus on the next item (either previous or next depending on shift)
      focusable.eq(focusable.index(self) + (e.shiftKey ? -1 : 1)).focus();
      return false;
    }
  }
  // We need to capture the [Shift] key and check the [Enter] key either way.
  if (e.shiftKey) { enterKey() } else { enterKey() }
});

$(document).keyup(function (e) {
    if (e.keyCode == 121) {
        clickSave();
    }
    else if (e.keyCode == 27) {
        clickClose();
    }
});

$(document).on("change paste", "#nppForm :input", function () {
    $("#nppForm").data("change paste", true);
});

function clickClose() {
    //window.close();
    inputDataChange();
}

function inputDataChange()
{
    if ($("#nppForm").data("change paste")) {
        var r = confirm("Your changes will be lost. Are you sure?");
        if (r == true) window.close();
    }
    else {
          window.close();
    }
}

Handlebars.registerHelper('edithelper_datetimeFormat', function(datetime) {
    return  ( datetime ? moment(datetime).utcOffset(new Date().getTimezoneOffset()).format("YYYY-MM-DD") : '');
});

Handlebars.registerHelper('edithelper_checked', function(checked) {
    return (checked === true ? 'checked' : '');
});

Handlebars.registerHelper('edithelper_selected', function(status, statusComparer) {
    return  status === statusComparer ? 'selected' : '';
});


$(document).ready(function () {

 if (patId) {
        document.title = "Patient Privacy(web version)";
         sqlPtNpp.nppGet(patId, function (err_message, record) {
            if (err_message != null) {
                alert(err_message);
            }
            else {
                 var template = $("#nppTemplate").html();
                 var renderer = Handlebars.compile(template);
                 var result = renderer({ "npp": record[0]})
                 document.body.innerHTML = result
            }
        });
    }
});

function validateForm() {
    return true;
}

function clickSave() {
    if (validateForm()) {
        var RecNo = $('#Recno').val();
        var NppDate = $('#NppDate').val();
        var DeliveryMethod = $('#DeliveryMethod').val();
        var IsSignedAcknoledgementOnFile = $('#IsSignedAcknoledgementOnFile').is(':checked');
        var SignedAcknoledgementOnFileDate = $('#SignedAcknoledgementOnFileDate').val();
        var IsRefused = $('#IsRefused').is(':checked');
        var RefusedNote = $('#RefusedNote').val();
        var MsgAtHome = $('#MsgAtHome').is(':checked');
        var MsgAtWork = $('#MsgAtWork').is(':checked');
        var MsgWithAnyoneAtHome = $('#MsgWithAnyoneAtHome').is(':checked');
        var MsgAtCell = $('#MsgAtCell').is(':checked');
        var AdvDirCom = $('#AdvDirCom').is(':checked');
        var AdvDirTyp = $('#AdvDirTyp').val();
        var ReviewDate = $('#ReviewDate').val();
        var MsgEmail = $('#MsgEmail').is(':checked');
        var RetrieveMedHist = $('#RetrieveMedHist').is(':checked');
        var ConsentToHIE = $('#ConsentToHIE').is(':checked');
        var AdvDirNote = $('#AdvDirNote').val();
        var DirectAddr = $('#DirectAddr').val();
         sqlPtNpp.nppSave(
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
            function (err , isDataSaved) {
            if (isDataSaved && !err) {
              window.close();
            }
            else {
                alert(err);
            }
        });
   }
}


$(document).on("change paste", "#nppForm :input", function () {
    $("#nppForm").data("change paste", true);
});
