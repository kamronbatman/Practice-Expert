var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var moment = require(nodeModulesPath + 'moment');
$(document).ready(function () {

  var cmGlb = remote.getGlobal('cmGlb');

  var _patId = cmGlb.patId;
  var _dctId = cmGlb.dctId;
  var _fclId = cmGlb.fclId;

  var  _paramName = "OncCQM";

  console.log("Patient Id: "+ _patId);
  console.log("Doctor  Id: "+ _dctId);
  console.log("Fcl     Id: "+ _fclId);

  var paramNameDctId = _paramName + _dctId;

  $( "#lblDctId" ).text(_dctId);
  //$( "#lblFclId" ).text(_fclId);

  loadParam(paramNameDctId);

  $( "#btnGuide" ).click(function( event ){

    event.preventDefault();

    var _fromDate = $( "#fromDate" ).val();
    var _toDate = $( "#toDate" ).val();

    var form = document.getElementById("mForm");

    for (var i = 0; i < form.elements.length; i++ ) {

      if (form.elements[i].type == 'checkbox')
      {
         if (form.elements[i].checked == true)
         {
           if(form.elements[i].id)
           {
             console.log(form.elements[i].id);
             var eleId = form.elements[i].id;
             var nqf = eleId.slice(1, eleId.length).toString().trim();
             var name = "";
             if($(form.elements[i]).parent().text())
             {
               name = $(form.elements[i]).parent().text().trim();
             }

             var measure = require(appPath + "/onc/xrxEhrCqmGuide/scripts/cqm-calc/"+ form.elements[i].id +".js");
             measure(nqf, name, _patId, _fromDate, _toDate, _dctId, _fclId, "cqmInstructionsModalBody");
           }

         }
       }

    }

    $('#cqmInstructionsModal').modal('show');
    $( "#cqmInstructionsModalBody" ).empty();

  });

  $( "#btnUncheckAll" ).click(function( event ){
    event.preventDefault();
    $("input:checkbox").prop('checked', false);
  });

  $( "#btnClose" ).click(function( event ){
      window.close();
  });


});

function viwDoc(nqf){

    const BrowserWindow = require('electron').remote.BrowserWindow;
    const ipcRenderer = require('electron').ipcRenderer;
    const shell = require('electron').shell
    const path = require('path');

    const loadURL = path.join('file://', __dirname, '../../docs/'+nqf+'_UserManual.htm');
    const loadPDF = path.join('file://', __dirname, '../../docs/'+nqf+'_UserManual.pdf');

    if(fileExists('./2/docs/'+nqf+'_UserManual.htm'))
    {
      let win = new BrowserWindow({ width: 600, height: 420, center: true, parent : BrowserWindow.getFocusedWindow(), modal : true, show: false });
      win.loadURL(loadURL);
      win.show();
    }
    else
    {
      shell.openExternal(loadPDF)
    }
}

function fileExists(filePath)
{
    var fs = require("fs");
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
      return false;
    }
}

function loadParam(paramName){
  var cqmGuideController = require("./controllers/cqmGuideController.js");
  cqmGuideController.xmlGetParam(paramName, function(err, record){
        if(record && record.length > 0)
        {
          var parser = new DOMParser();
          var xmlDoc = parser.parseFromString(record[0].XMLTEXT.value,"text/xml");
          if(xmlDoc)
          {
            var oncCQMNode  = xmlDoc.getElementsByTagName(paramName)[0];

            if(oncCQMNode)
            {
              for(var i = 0; i< oncCQMNode.childNodes.length; i ++)
              {
                var node = oncCQMNode.childNodes[i];
                if(node.nodeType === 1)
                {
                  if(node.nodeName == "FromDate")
                  {
                    var formDate = moment(new Date(node.childNodes[0].nodeValue)).format('YYYY-MM-DD');
                    $( "#fromDate" ).val(formDate);
                  }
                  else if(node.nodeName == "ToDate")
                  {
                    var toDate = moment(new Date(node.childNodes[0].nodeValue)).format('YYYY-MM-DD');
                    $( "#toDate" ).val(toDate);
                  }
                  else if(node.nodeName == "FclId")
                  {
                    var fcl = node.childNodes[0].nodeValue;
                    $( "#lblFclId" ).text(fcl);
                  }
                  else if(node.childNodes[0].nodeValue == 1)
                  {
                    var nodeName = node.nodeName? node.nodeName.toLowerCase() : "";
                    $('#'+nodeName).prop( "checked", true);
                  }
                }
              }
            }
          }
        }
        else if(err)
        {
            alert("Loading parameters failed.");
        }
  });
}
