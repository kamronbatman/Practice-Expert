

$(document).ready(function () {

    Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

    var DWObject;
    var duplexScanner;
    var frontImageBuffer;
    var backImageBuffer;
    var cardData;
    var xrxAcuantScan_Controller = require("../controllers/xrxAcuantScanController.js");
    var remote = require('electron').remote;
    var appPath = remote.getGlobal('appPath');
    var pathPdf = appPath+"/xrxAcuantScan/temp/pdfAll_dl.pdf";
    var pathFrontImg = appPath+"/xrxAcuantScan/temp/imgFront_dl.jpg";
    var pathBackImg = appPath+"/xrxAcuantScan/temp/imgBack_dl.jpg";
    var fs = require('fs');
    var cmGlb = remote.getGlobal('cmGlb');

    function Dynamsoft_OnReady() {
        // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
        DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');

        //Check if all files were created while scanning.
        fs.access(pathPdf,  (err) => {
          if(!err){
            fs.access(pathFrontImg,  (err) => {
              if(!err){
                fs.access(pathFrontImg,  (err) => {
                  if(!err){
                    process();
                  }
                  else{
                    alert("Please scan again. The back-image was not created properly after scanning.");
                    window.location.href = '../views/scan-dl.html';
                  }
                });
              }
              else{
                alert("Please scan again. The front-image was not created properly after scanning.");
                window.location.href = '../views/scan-dl.html';
              }
            });
          }
          else{
            alert("Please scan again. The pdf was not created properly after scanning.");
            window.location.href = '../views/scan-dl.html';
          }
        });
    }

    function ShowImageBase64Buffer() {
        if (duplexScanner) {
            DWObject.SelectedImagesCount = 1;
            for (var i = 0; i < 2; i++) {
                DWObject.SetSelectedImageIndex(0, i);
                DWObject.GetSelectedImagesSize(EnumDWT_ImageType.IT_JPG);
                if (i == 0) {
                    frontImageBuffer = DWObject.SaveSelectedImagesToBase64Binary();
                    document.getElementById('scanImage').innerHTML = "<img src= \"data:image/jpg;base64," + frontImageBuffer + "\"/>";
                }
                if (i == 1) {
                    backImageBuffer = DWObject.SaveSelectedImagesToBase64Binary();
                    document.getElementById('scanBackImage').innerHTML = "<img src= \"data:image/jpg;base64," + backImageBuffer + "\"/>";
                }
            }
        }
        else {
            DWObject.SelectedImagesCount = 1;
            for (var i = 0; i < 1; i++) {
                DWObject.SetSelectedImageIndex(0, i);
                DWObject.GetSelectedImagesSize(EnumDWT_ImageType.IT_JPG);
                frontImageBuffer = DWObject.SaveSelectedImagesToBase64Binary();
                document.getElementById('scanImage').innerHTML = "<img src= \"data:image/jpg;base64," + frontImageBuffer + "\"/>";
            }
        }
        //DWObject.RemoveAllImages();
    }

    function dataURLtoBlob(buffer) {

        var binary = atob(buffer);
        // Create 8-bit unsigned array
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        // Return Blob object
        return new Blob([new Uint8Array(array)], { type: 'image/png' });
    }

    function isDate(val) {

        return (new Date(val) !== "Invalid Date" && !isNaN(new Date(val)) ) ? true : false;
    };

    function isValidUSZip(sZip) {

        return /(^\d{5}$)|(^\d{5}-\d{4}$)|(^\d{9}$)/.test(sZip);
    };

    //Format data displayed to UI.
    function AddDisplay(fieldName, fieldValue, maxLength, forceShow) {

      if (fieldName == "Address Verification") {
          var string = "<div>";
          string += "<label style='display:inline-block; text-align : right; width: 250px;'>";
          string += fieldName;
          string += "&nbsp;&nbsp;</label>";
          string += "<INPUT  TYPE=TEXT name=\"input"+fieldName+"\" id=\"input"+fieldName+"\" value="+fieldValue+"\" maxlength="+maxLength+" style='text-transform: uppercase; border-radius: 2px 2px 2px 2px; border: 1px solid #A9A9A9; background-color: #FCF5D8; width: 450px; padding: 2px 5px; border-color : #A9A9A9;' />";
          string += "</div>";
          return string;
      }
      else if (fieldValue || forceShow) {
            var string = "<div>";
            string += "<label style='display:inline-block; text-align : right; width: 250px;'>";
            string += fieldName + (forceShow ? "*" : "");
            string += "&nbsp;&nbsp;</label>";
            string += "<INPUT TYPE=TEXT name=\"input"+fieldName+"\" id=\"input"+fieldName+"\" value=\""+fieldValue+"\" maxlength="+maxLength+" style='text-transform: uppercase; border-radius: 2px 2px 2px 2px; border: 1px solid #A9A9A9; background-color: #FCF5D8; width: 450px; padding: 2px 5px; border-color : #A9A9A9;' />";
            string += "</div>";
            return string;
        }
        else
            return "";
    };

		//Clears populated controls. Prepares UI for next processing.
    function ResetControls(isProcessing) {
        console.log(isProcessing);
        document.getElementById("extractedData").style.display = "none";
        cardData = null;
        $('#dl-data').empty();
        $('#errorDiv').html("");
        if(isProcessing){
            console.log("ResetControls-isProcessing");
        }
        else{
          console.log("ResetControls");
          document.getElementById('scanImage').innerHTML = "";
          document.getElementById('scanBackImage').innerHTML = "";
          frontImageBuffer = null;
          backImageBuffer = null;
        }
    };

    function process(){
      ResetControls(true);
      $('#errorDiv').html("");

      DWObject.RemoveAllImages();
      DWObject.IfShowFileDialog = false;
      DWObject.LoadImage(pathFrontImg);
      DWObject.SelectedImagesCount = 1;
      DWObject.SetSelectedImageIndex(0, 0);
      DWObject.GetSelectedImagesSize(EnumDWT_ImageType.IT_JPG);
      frontImageBuffer = DWObject.SaveSelectedImagesToBase64Binary();
      DWObject.RemoveAllImages();
      DWObject.LoadImage(pathBackImg);
      DWObject.SelectedImagesCount = 1;
      DWObject.SetSelectedImageIndex(0, 0);
      DWObject.GetSelectedImagesSize(EnumDWT_ImageType.IT_JPG);
      backImageBuffer = DWObject.SaveSelectedImagesToBase64Binary();
      DWObject.RemoveAllImages();

      var imageToProcess;
      imageToProcess = new FormData();
      imageToProcess.append("frontImage", dataURLtoBlob(frontImageBuffer));
      imageToProcess.append("backImage", dataURLtoBlob(backImageBuffer));

      var selectedRegion = "0";//USA
      //Accesing the web service
      $.ajax({
          type: "POST",
          url: "https://cssnwebservices.com/CSSNService/CardProcessor/ProcessDLDuplex/" + selectedRegion + "/true/-1/true/true/true/0/150/102",
          data: imageToProcess,
          cache: false,
          contentType: 'application/octet-stream; charset=utf-8;',
          dataType: "json",
          processData: false,
          timeout: 60000,
          beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "LicenseKey " + authinfo);
              $('#loading').html("<img src='../acuant/images/processing.gif'/>");
              $("#div-controls").hide();
          },
          success: function (data) {

              $('#btn-save-dlduplex').prop('disabled', false);

              var driversLicense = JSON.stringify(data);
              driversLicense = jQuery.parseJSON(driversLicense);

              //Checking if there are errors returned.
              if (driversLicense.ResponseCodeAuthorization < 0) {
                  $('#errorDiv').html("<p>CSSN Error Code: " + driversLicense.ResponseMessageAuthorization + "</p>");
              }
              else if (driversLicense.ResponseCodeAutoDetectState < 0) {
                  $('#errorDiv').html("<p>CSSN Error Code: " + driversLicense.ResponseCodeAutoDetectStateDesc + "</p>");
              }
              else if (driversLicense.ResponseCodeProcState < 0) {
                  $('#errorDiv').html("<p>CSSN Error Code: " + driversLicense.ResponseCodeProcStateDesc + "</p>");
              }
              else if (driversLicense.WebResponseCode < 1) {
                  $('#errorDiv').html("<p>CSSN Error Code: " + driversLicense.WebResponseDescription + "</p>");
              }
              else {

                  cardData = driversLicense;
                  //Display data returned by the web service
                  var data = AddDisplay("FirstName", driversLicense.NameFirst, 35, true);
                  data += AddDisplay("MiddleName", driversLicense.NameMiddle, 35, false);
                  data += AddDisplay("LastName", driversLicense.NameLast, 35, true);
                  data += AddDisplay("LicenseNumber", driversLicense.license, 16, true);
                  data += AddDisplay("Sex", driversLicense.Sex, 1, true);
                  if(driversLicense.DateOfBirth4 && isDate(driversLicense.DateOfBirth4)){
                    data += AddDisplay("DateOfBirth", driversLicense.DateOfBirth4, 10, true);
                  }
                  // if(driversLicense.ExpirationDate4 && isDate(driversLicense.ExpirationDate4)){
                  //   data += AddDisplay("ExpirationDate", driversLicense.ExpirationDate4, 10, false);
                  // }
                  // if(driversLicense.IssueDate4 && isDate(driversLicense.IssueDate4)){
                  //   data += AddDisplay("IssueDate", driversLicense.IssueDate4, 10, false);
                  // }
                  data += AddDisplay("Address", driversLicense.Address, 55, true);
                  data += AddDisplay("City", driversLicense.City, 25, true);
                  data += AddDisplay("State", driversLicense.State, 2, true);
                  data += AddDisplay("Zip", driversLicense.Zip, 10, true);
                  //data += AddDisplay("Eyes Color", driversLicense.Eyes);
                  //data += AddDisplay("Hair Color", driversLicense.Hair);
                  //data += AddDisplay("Height", driversLicense.Height);
                  //data += AddDisplay("Weight", driversLicense.Weight);

                  //console.log(data);
                  $(data).appendTo("#dl-data");
                  document.getElementById("extractedData").style.display = "inline";

                  var reformattedImageFront = driversLicense.ReformattedImage;
                  if (reformattedImageFront != null && reformattedImageFront != "") {
                      var base64ReformattedImage = goog.crypt.base64.encodeByteArray(reformattedImageFront);
                  document.getElementById('scanImage').innerHTML = "<img src= \"data:image/jpg;base64," + base64ReformattedImage + "\"/>";
                      // document.getElementById("scanImage").style.display = "inline";
                      //$("#image").attr("src", "data:image/jpg;base64," + base64ReformattedImage);
                  }

                  var reformattedImageBack = driversLicense.ReformattedImageTwo;
                  if (reformattedImageBack != null && reformattedImageBack != "") {
                      var base64ReformattedBackImage = goog.crypt.base64.encodeByteArray(reformattedImageBack);
                  document.getElementById('scanBackImage').innerHTML = "<img src= \"data:image/jpg;base64," + base64ReformattedBackImage + "\"/>";
                      //  document.getElementById("scanBackImage").style.display = "inline";
                      // $("#backimage").attr("src", "data:image/jpg;base64," + base64ReformattedBackImage);
                  }
              }
          },
          error: function (xhr, err) {
              $("#div-controls").hide();
              if(err)
              {
                alert("Error: While processing Driving-License (Calling API). Please rescan again.");
              }
          },
          complete: function (e) {
              $('#loading').html("");
              $("#div-controls").hide();
          }
      });
    };

    $("#btn-save-dlduplex").click(function () {

      $("#saveWaitSign").css("display", "inline");

      if(!$('#inputFirstName').length){
        alert("Please waiting while the image is being processed.");
        return;
      }

      // var data = AddDisplay("FirstName", driversLicense.NameFirst, 35, true);
      // data += AddDisplay("MiddleName", driversLicense.NameMiddle, 35, false);
      // data += AddDisplay("LastName", driversLicense.NameLast, 35, true);
      // data += AddDisplay("LicenseNumber", driversLicense.license, 16, true);
      // data += AddDisplay("Address", driversLicense.Address, 55, false);
      // data += AddDisplay("City", driversLicense.City, 25, false);
      // data += AddDisplay("State", driversLicense.State, 2, false);
      // data += AddDisplay("Zip", driversLicense.Zip, 10, false);
      // data += AddDisplay("Sex", driversLicense.Sex, 1, true);

      var validationMsg = "";
      if(!$('#inputFirstName').val().trim()){
        validationMsg += "First name is a required field. \n";
      }
      if(!$('#inputLastName').val().trim()){
        validationMsg += "Last name is a required field. \n";
      }
      if(!$('#inputLicenseNumber').val().trim()){
        validationMsg += "License number is a required field. \n";
      }
      if(!$('#inputSex').val().trim()){
        validationMsg += "Sex is a required field. Use (M/F/U). \n";
      }
      else if($('#inputSex').val().trim().toUpperCase() != "M" && $('#inputSex').val().trim().toUpperCase() != "F" && $('#inputSex').val().trim().toUpperCase() != "U"){
        validationMsg += "Sex has incorrect value. Use (M/F/U). \n";
      }
      if(!$('#inputDateOfBirth').val().trim()){
        validationMsg += "DateOfBirth is a required field.  Use mm/dd/yyyy. \n";
      }
      else if($('#inputDateOfBirth').length && $('#inputDateOfBirth').val().trim() && !isDate($('#inputDateOfBirth').val().trim())){
        validationMsg += "DateOfBirth has incorrect format. Use mm/dd/yyyy. \n";
      }
      if(!$('#inputAddress').val().trim()){
        validationMsg += "Address is a required field. \n";
      }
      if(!$('#inputCity').val().trim()){
        validationMsg += "City is a required field. \n";
      }
      if(!$('#inputState').val().trim()){
        validationMsg += "State is a required field. \n";
      }
      else if($('#inputState').length && $('#inputState').val().trim() && $('#inputState').val().trim().length != 2){
        validationMsg += "State must be 2 characters. \n";
      }
      if(!$('#inputZip').val().trim()){
        validationMsg += "Zip is a required field. \n";
      }
      else if($('#inputZip').length && $('#inputZip').val().trim() && !isValidUSZip($('#inputZip').val().trim())){
        validationMsg += "Zip has incorrect format. Use digits (xxxxx or xxxxx-xxxx).\n";
      }

      if(validationMsg){
        $("#saveWaitSign").css("display", "none");
        alert(validationMsg);
      }
      else{
        var json = {
          FIRSTNAME: $('#inputFirstName').val().trim(),
          MIDDLENAME: $('#inputMiddleName').length ? $('#inputMiddleName').val().trim() : "",
          LASTNAME: $('#inputLastName').val().trim(),
          LICENSENUMBER: $('#inputLicenseNumber').val().trim(),
          SEX: $('#inputSex').val().trim(),
          DATEOFBIRTH: $('#inputDateOfBirth').length ? $('#inputDateOfBirth').val().trim() : "",
          ADDR: $('#inputAddress').length ? $('#inputAddress').val().trim() : "",
          CITY: $('#inputCity').length ? $('#inputCity').val().trim() : "",
          STATE: $('#inputState').length ? $('#inputState').val().trim() : "",
          ZIP: $('#inputZip').length ? $('#inputZip').val().trim() : "",
          PATID: cmGlb.patId,
          USERID: cmGlb.userId
        };
        //console.log(json);
        var bufferPdf = fs.readFileSync(pathPdf);
        xrxAcuantScan_Controller.xrxAcuantScan_SaveDL(json, bufferPdf, function (message , IsDataSaved) {

            $("#saveWaitSign").css("display", "none");

            console.log(IsDataSaved);
            console.log(message);

            if(IsDataSaved){
              alert("The driver's license data was saved successfully.");
              window.close();
            }
            else{
              alert("Error. Details:"+message);
            }
        });
      }
    });

    $("#btn-process-dlduplex").click(function () {

      process();
    });

    $("#btn-rescan-dlduplex").click(function () {

        window.location.href = '../views/scan-dl.html';
    });
});
