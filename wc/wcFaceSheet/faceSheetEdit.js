var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var moment = require(nodeModulesPath + 'moment');
var Handlebars = require(nodeModulesPath + 'handlebars');
var cmGlb = remote.getGlobal('cmGlb');

var sqlPtNpp = require(appPath + "/wc/wcFaceSheet/faceSheetSql.js");

function getQueryStringValue (key)
{
    return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

var _patId = cmGlb.patId;

console.log(cmGlb.companyName);

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
    if (e.keyCode == 114) {
        clickPrint();
    }
    else if (e.keyCode == 27) {
        clickClose();
    }
});

$(document).on("change paste", "#nppForm :input", function () {
    $("#nppForm").data("change paste", true);
});

function clickClose() {
    window.close();
}

function stringDateTimeUniqueNumber() {

    var date = new Date();

    var month = date.getMonth() + 1;
    var dateD = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    return  month +""+ dateD +""+ year +""+ hours +""+ minutes +""+ seconds;
}

function clickPrint()
{
    var restorePage = document.body.innerHTML;
    var printContent = document.getElementById("formContent").innerHTML;
    document.body.innerHTML = printContent;

    //directly print to printer
    //window.print();

    //Print to pdf
    const fs = require('fs');
    const os = require('os');
    const path = require('path');
    const electron = require('electron');
    const BrowserWindow = electron.remote.BrowserWindow;
    const shell = electron.shell;
    const win = BrowserWindow.getFocusedWindow();

    var dateTimeSecUid = stringDateTimeUniqueNumber();
    const pdfPath = path.join(os.tmpdir(), 'printLetter_'+dateTimeSecUid+'.pdf');

    // Use default printing options
    win.webContents.printToPDF({marginsType: 2, pageSize: "A4"}, function (error, data) {
        if (error) throw error
        fs.writeFile(pdfPath, data, function (error) {

            if (error) {
                throw error
            }

            shell.openItem(pdfPath);
            document.body.innerHTML = restorePage;
        });
    });

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

 if (_patId) {
        document.title = "Worker's Comp Facesheet(web version)";
         sqlPtNpp.nppGet(_patId, function (err_message, record) {
            if (err_message != null) {
                alert(err_message);
            }
            else {
                 var template = $("#nppTemplate").html();
                 var renderer = Handlebars.compile(template);
                 var result = renderer({ "npp": record[0], "providerName": cmGlb.providerName, "providerStreet": cmGlb.providerStreet, "providerCityStateZip": cmGlb.providerCityStateZip, "providerPhoneFax": cmGlb.providerPhoneFax});
                 document.body.innerHTML = result
            }
        });
    }
});


$(document).on("change paste", "#nppForm :input", function () {
    $("#nppForm").data("change paste", true);
});
