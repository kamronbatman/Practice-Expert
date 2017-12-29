

$(document).ready(function () {

    Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

    var DWObject;
    var duplexScanner;
    var frontImageBuffer;
    var backImageBuffer;
    var remote = require('electron').remote;
    var appPath = remote.getGlobal('appPath');
    var xrxAcuantScan_Controller = require("../controllers/xrxAcuantScanController.js");
    var pathPdf = appPath+"/xrxAcuantScan/temp/pdfAll.pdf";
    var pathFrontImg = appPath+"/xrxAcuantScan/temp/imgFront.jpg";
    var pathBackImg = appPath+"/xrxAcuantScan/temp/imgBack.jpg";
    var fs = require('fs');
    var cmGlb = remote.getGlobal('cmGlb');

    if(!cmGlb.patId || !cmGlb.userId || !cmGlb.insType){
      alert("The parameters required by this program are not configured properly.");
      return;
    }

    function Dynamsoft_OnReady() {
        DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer'); // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
        if (DWObject) {
            var count = DWObject.SourceCount;
            for (var i = 0; i < count; i++){
              document.getElementById("source").options.add(new Option(DWObject.GetSourceNameItems(i), i));
            }
            DWObject.RegisterEvent('OnPostAllTransfers', ShowImageBase64Buffer);
        }

        try{
          fs.unlinkSync(pathPdf);
        }
        catch(e){
          console.log(e);
        }
        try{
          fs.unlinkSync(pathFrontImg);;
        }
        catch(e){
          console.log(e);
        }
        try{
          fs.unlinkSync(pathBackImg);
        }
        catch(e){
          console.log(e);
        }

        loadParam();
    }

    function loadParam(){

      console.log(xrxAcuantScan_Controller);
      console.log(pathPdf);

      xrxAcuantScan_Controller.xrxAcuantScan_LoadParam(function (data , success) {
          if(success){

            if(!data){
              return;
            }

            //start parser
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data.XMLTEXT.value,"text/xml");
            if(xmlDoc)
            {
              var ocr  = xmlDoc.getElementsByTagName('OCR')[0];
              for(var i = 0; i< ocr.childNodes.length; i++)
              {
                  var node = ocr.childNodes[i];
                  if(node.nodeType === 1)
                  {
                    var nodeName = node.nodeName.toUpperCase();
                    //console.log(nodeName);
                    if(node.childNodes[0])
                    {
                      if(nodeName == "SCANNERNAME")
                      {
                        //console.log(node.childNodes[0].nodeValue);
                        if (DWObject) {
                            var total = DWObject.SourceCount;
                            for (var i = 0; i < total; i++){
                              if(document.getElementById("source").options[i].text == node.childNodes[0].nodeValue){
                                document.getElementById("source").options[i].selected = true;
                              }
                            }
                        }
                      }
                    }
                  }
              }
            }//end xml parser

          }
          else{
            alert("Error. Details:"+data);
          }
      });
    };

    function saveParam(){

      var xmlDocString = "<OCR></OCR>";
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xmlDocString,"text/xml");
      var params = ["SCANNERNAME"];

      for(var i = 0; i < params.length; i++){
        var eleNew = xmlDoc.createElement(params[i]);

        var xmlValue = "";
        if(params[i] == "SCANNERNAME"){
          if (DWObject) {
              var total = DWObject.SourceCount;
              for (var i = 0; i < total; i++){
                if(document.getElementById("source").options[i].selected){
                  xmlValue = document.getElementById("source").options[i].text;
                }
              }
          }
        }

        var eleText= xmlDoc.createTextNode(xmlValue);
        eleNew.appendChild(eleText);
        xmlDoc.getElementsByTagName("OCR")[0].appendChild(eleNew);
      }
      var ocrXmlString =	new XMLSerializer().serializeToString(xmlDoc);
      var userId = cmGlb.userId;

      xrxAcuantScan_Controller.xrxAcuantScan_SaveParam(ocrXmlString, userId, function (data , success) {

        if(!success){
          alert(data);
        }
      });

    };

    function AcquireImage() {

        if (DWObject) {

            DWObject.SelectSourceByIndex(document.getElementById("source").selectedIndex);
            DWObject.CloseSource();
            DWObject.OpenSource();

            if (DWObject.Duplex != 0) {
                DWObject.IfDuplexEnabled = true;
                duplexScanner = true;
            }

            //DWObject.SetImageLayout(0.0, 0.0, 3.5, 2.2); // Set scanning size
            DWObject.PageSize = EnumDWT_CapSupportedSizes.TWSS_BUSINESSCARD;
            DWObject.PixelType = EnumDWT_PixelType.TWPT_RGB;

            //If show UI
            DWObject.IfShowUI = false;

            //Resolution
            DWObject.Resolution = parseInt("300");
            DWObject.AcquireImage();

            DWObject.IfShowFileDialog = false;
            DWObject.SaveAsJPEG(pathFrontImg, 0, function(){
              console.log('success save file');
            },function(errorCode, errorString) {
              console.log(errorCode);
              console.log(errorString);
            });
            DWObject.SaveAsJPEG(pathBackImg, 1, function(){
              console.log('success save file');
            },function(errorCode, errorString) {
              console.log(errorCode);
              console.log(errorString);
            });
            DWObject.SaveAllAsPDF(pathPdf, function(){
              window.location.href = '../views/process-ins.html';
            },function(errorCode, errorString) {
              console.log(errorCode);
              console.log(errorString);
            });


        }
    }

    function ShowImageBase64Buffer() {
        if (duplexScanner) {
            DWObject.SelectedImagesCount = 1;
            for (var i = 0; i < 2; i++) {
                DWObject.SetSelectedImageIndex(0, i);
                DWObject.GetSelectedImagesSize(EnumDWT_ImageType.IT_JPG);
                if (i == 0) {
                    frontImageBuffer = DWObject.SaveSelectedImagesToBase64Binary();
                    //document.getElementById('scanImage').innerHTML = "<img src= \"data:image/jpg;base64," + frontImageBuffer + "\"/>";
                }
                if (i == 1) {
                    backImageBuffer = DWObject.SaveSelectedImagesToBase64Binary();
                    //document.getElementById('scanBackImage').innerHTML = "<img src= \"data:image/jpg;base64," + backImageBuffer + "\"/>";
                }
            }
        }
        else {
            DWObject.SelectedImagesCount = 1;
            for (var i = 0; i < 1; i++) {
                DWObject.SetSelectedImageIndex(0, i);
                DWObject.GetSelectedImagesSize(EnumDWT_ImageType.IT_JPG);
                frontImageBuffer = DWObject.SaveSelectedImagesToBase64Binary();
                //document.getElementById('scanImage').innerHTML = "<img src= \"data:image/jpg;base64," + frontImageBuffer + "\"/>";
            }
        }
        DWObject.RemoveAllImages();
    }

    $("#btn-scan").click(function () {
        saveParam();
        AcquireImage();
    });

});
