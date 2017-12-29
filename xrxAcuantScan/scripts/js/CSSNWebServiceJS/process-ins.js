

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
    var pathPdf = appPath+"/xrxAcuantScan/temp/pdfAll.pdf";
    var pathFrontImg = appPath+"/xrxAcuantScan/temp/imgFront.jpg";
    var pathBackImg = appPath+"/xrxAcuantScan/temp/imgBack.jpg";
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
                fs.access(pathBackImg,  (err) => {
                  if(!err){
                    //alert('all good');
                    process();
                  }
                  else{
                    alert("Please scan again. The back-image was not created properly after scanning.");
                    window.location.href = '../views/scan-ins.html';
                  }
                });
              }
              else{
                alert("Please scan again. The front-image was not created properly after scanning.");
                window.location.href = '../views/scan-ins.html';
              }
            });
          }
          else{
            alert("Please scan again. The pdf was not created properly after scanning.");
            window.location.href = '../views/scan-ins.html';
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

    function getInsType(insType) {
        //console.log(insType);
        if(insType){
          if(insType == 1 || insType == "1")
            return "PRIMARY";
          if(insType == 2 || insType == "2")
            return "SECONDARY";
          if(insType == 3 || insType == "3")
            return "TERTIARY";
        }
        return "PRIMARY";
    };

    //Format data displayed to UI.
    function AddDisplay(fieldName, fieldValue, maxLength, forceShow) {

      if (fieldName == "Address Verification") {
          var string = "<div>";
          string += "<label style='display:inline-block; text-align : right; width: 250px;'>";
          string += fieldName;
          string += "&nbsp;&nbsp;</label>";
          string += "<INPUT TYPE=TEXT name=\"input"+fieldName+"\" id=\"input"+fieldName+"\" value="+fieldValue+"\" maxlength="+maxLength+" style='text-transform: uppercase; border-radius: 2px 2px 2px 2px; border: 1px solid #A9A9A9; background-color: #FCF5D8; width: 450px; padding: 2px 5px; border-color : #A9A9A9;' />";
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
        $('#med-insurance-data').empty();
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

      //Accesing the web service
      $.ajax({
          type: "POST",
          url: "https://cssnwebservices.com/CSSNService/CardProcessor/ProcessMedInsuranceCard/true/0/150/false",
          data: imageToProcess,
          cache: false,
          contentType: 'application/octet-stream; charset=utf-8;',
          dataType: "json",
          processData: false,
          timeout: 180000,
          beforeSend: function (xhr) {
              xhr.setRequestHeader("Authorization", "LicenseKey " + authinfo);
              $('#loading').html("<img src='../acuant/images/processing.gif'/>");
              $("#div-controls").hide();
          },
          success: function (data) {

              $('#btn-save-medduplex').prop('disabled', false);

              var medicalCard = JSON.stringify(data);
              medicalCard = jQuery.parseJSON(medicalCard);

              //console.log(medicalCard);

              //Checking if there are errors returned.
              if (medicalCard.ResponseCodeAuthorization < 0) {
                  $('#errorDiv').html("<p>CSSN Error Code: " + medicalCard.ResponseMessageAuthorization + "</p>");
              }
              else if (medicalCard.WebResponseCode < 1) {
                  $('#errorDiv').html("<p>CSSN Error Code: " + medicalCard.WebResponseDescription + "</p>");
              }
              else {

                  cardData = medicalCard;
                  //Display data returned by the web service
                  var data = AddDisplay("MemberName", medicalCard.MemberName, 100, false);
                  data += AddDisplay("FirstName", medicalCard.FirstName, 25, true);
                  data += AddDisplay("LastName", medicalCard.LastName, 35, true);
                  data += AddDisplay("PrimaryId", medicalCard.MemberId, 25, true);
                  data += AddDisplay("InsName", medicalCard.PlanProvider, 50, true);
                  data += AddDisplay("PayerId", medicalCard.PayerId, 15, false);
                  data += AddDisplay("GroupPolicyNumber", medicalCard.GroupNumber, 25, false);
                  data += AddDisplay("Deduction", medicalCard.Deductible, 10, false);
                  data += AddDisplay("Coverage", medicalCard.Coverage, 25);

                  if(medicalCard.DateOfBirth && isDate(medicalCard.DateOfBirth)){
                    data += AddDisplay("DateOfBirth", medicalCard.DateOfBirth, 10, false);
                  }
                  if(medicalCard.EffectiveDate && isDate(medicalCard.EffectiveDate)){
                    data += AddDisplay("EffectiveDate", medicalCard.EffectiveDate, 10, false);
                  }
                  if(medicalCard.ExpirationDate && isDate(medicalCard.ExpirationDate)){
                    data += AddDisplay("ExpirationDate", medicalCard.ExpirationDate, 10, false);
                  }

                  data += AddDisplay("GroupPlanName", medicalCard.GroupName, 25, false);
                  data += AddDisplay("CoverageType", medicalCard.PlanType, 25, false);

                  var addressCount = medicalCard.ListAddress.length;
                  if (addressCount > 0) {
                      for (var i = 0; i < addressCount; i++) {
                          data += AddDisplay("Full-Address" + (i + 1) + "", medicalCard.ListAddress[i].FullAddress, 55, false);
                          data += AddDisplay("Street" + (i + 1) + "", medicalCard.ListAddress[i].Street, 55, false);
                          data += AddDisplay("City" + (i + 1) + "", medicalCard.ListAddress[i].City, 25, false);
                          data += AddDisplay("State" + (i + 1) + "", medicalCard.ListAddress[i].State, 2, false);
                          data += AddDisplay("Zip" + (i + 1) + "", medicalCard.ListAddress[i].Zip, 10, false);
                      }
                  }

                  var webCount = medicalCard.ListWeb.length;
                  if (webCount > 0) {
                      for (var i = 0; i < webCount; i++) {
                          data += AddDisplay("Web" + (i + 1) + "", medicalCard.ListWeb[i].Label == "" ? medicalCard.ListWeb[i].Value : medicalCard.ListWeb[i].Label + " - " + medicalCard.ListWeb[i].Value, 50, false);
                      }
                  }

                  // var emailCount = medicalCard.ListEmail.length;
                  // if (emailCount > 0) {
                  //     for (var i = 0; i < emailCount; i++) {
                  //         data += AddDisplay("Email" + (i + 1) + "", medicalCard.ListEmail[i].Label == "" ? medicalCard.ListEmail[i].Value : medicalCard.ListEmail[i].Label + " - " + medicalCard.ListEmail[i].Value, );
                  //     }
                  // }

                  var telephoneCount = medicalCard.ListTelephone.length;
                  if (telephoneCount > 0) {
                      for (var i = 0; i < telephoneCount; i++) {
                          var tele = medicalCard.ListTelephone[i].Label == "" ? medicalCard.ListTelephone[i].Value : medicalCard.ListTelephone[i].Label + " - " + medicalCard.ListTelephone[i].Value;
                          var number = tele.match(/\d/g);
                          number = number.join("");
                          if(!isNaN(number)){


                            if(number.length > 10 && number.length == 11 && number.charAt(0) == '1')
                            {
                              //console.log("Number : " + number);
                              number = number.slice(1);
                            }

                            number = number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
                            data += AddDisplay("Telephone" + (i + 1) + "", number, 12, false);
                          }
                      }
                  }

                  // var deductibleCount = medicalCard.ListDeductible.length;
                  // if (deductibleCount > 0) {
                  //     for (var i = 0; i < deductibleCount; i++) {
                  //         data += AddDisplay("Deductible" + (i + 1) + "", medicalCard.ListDeductible[i].Label == "" ? medicalCard.ListDeductible[i].Value : medicalCard.ListDeductible[i].Label + " - " + medicalCard.ListDeductible[i].Value);
                  //     }
                  // }
                  //
                  // var planCodeCount = medicalCard.ListPlanCode.length;
                  // if (planCodeCount > 0) {
                  //     for (var i = 0; i < planCodeCount; i++) {
                  //         data += AddDisplay("PlanCode" + (i + 1) + "", medicalCard.ListPlanCode[i].PlanCode);
                  //     }
                  // }
                  //console.log(data);
                  $(data).appendTo("#med-insurance-data");
                  document.getElementById("extractedData").style.display = "inline";

                  var reformattedImageFront = medicalCard.ReformattedImage;
                  if (reformattedImageFront != null && reformattedImageFront != "") {
                      var base64ReformattedImage = goog.crypt.base64.encodeByteArray(reformattedImageFront);
                      document.getElementById('scanImage').innerHTML = "<img src= \"data:image/jpg;base64," + base64ReformattedImage + "\"/>";
                      // document.getElementById("scanImage").style.display = "inline";
                      //$("#image").attr("src", "data:image/jpg;base64," + base64ReformattedImage);
                  }

                  var reformattedImageBack = medicalCard.ReformattedImageTwo;
                  if (reformattedImageBack != null && reformattedImageBack != "") {
                      var base64ReformattedBackImage = goog.crypt.base64.encodeByteArray(reformattedImageBack);
                      document.getElementById('scanBackImage').innerHTML = "<img src= \"data:image/jpg;base64," + base64ReformattedBackImage + "\"/>";
                      //  document.getElementById("scanBackImage").style.display = "inline";
                      // $("#backimage").attr("src", "data:image/jpg;base64," + base64ReformattedBackImage);
                  }
              }
          },
          error: function (xhr, err) {
              $('#loading').html("");
              $("#div-controls").hide();
              //console.log("Error error**********");
              // console.log(err);
              // console.log(xhr);

              if(err)
              {
                alert("Error: While processing Insurance (Calling API). Please rescan again.");
              }
          },
          complete: function (e) {
              $('#loading').html("");
              $("#div-controls").hide();
              // console.log("Error Complete**********");
              // console.log(e);
          }
      });
    };

    $("#btn-save-medduplex").click(function () {

      $("#saveWaitSign").css("display", "inline");


      if(!$('#inputFirstName').length){
        alert("Please waiting while the image is being processed.");
        return;
      }

      var validationMsg = "";
      if(!$('#inputFirstName').val().trim()){
        validationMsg += "First name is a required field. \n";
      }
      if(!$('#inputLastName').val().trim()){
        validationMsg += "Last name is a required field. \n";
      }
      if(!$('#inputPrimaryId').val().trim()){
        validationMsg += "PrimaryId is a required field. \n";
      }
      if(!$('#inputInsName').val().trim()){
        validationMsg += "Ins Name is a required field. \n";
      }
      if($('#inputDateOfBirth').length && $('#inputDateOfBirth').val().trim() && !isDate($('#inputDateOfBirth').val().trim())){
        validationMsg += "DateOfBirth has incorrect format. Use mm/dd/yyyy. \n";
      }
      if($('#inputEffectiveDate').length && $('#inputEffectiveDate').val().trim() && !isDate($('#inputEffectiveDate').val().trim())){
        validationMsg += "EffectiveDate has incorrect format. Use mm/dd/yyyy. \n";
      }
      if($('#inputExpirationDate').length && $('#inputExpirationDate').val().trim() && !isDate($('#inputExpirationDate').val().trim())){
        validationMsg += "ExpirationDate has incorrect format. Use mm/dd/yyyy. \n";
      }
      if($('#inputState1').length && $('#inputState1').val().trim() && $('#inputState1').val().trim().length != 2){
        validationMsg += "State must be 2 characters. \n";
      }
      if($('#inputZip1').length && $('#inputZip1').val().trim() && !isValidUSZip($('#inputZip1').val().trim())){
        validationMsg += "Zip1 has incorrect format. Use digits (xxxxx or xxxxx-xxxx).\n";
      }

      if(validationMsg){
        $("#saveWaitSign").css("display", "none");
        alert(validationMsg);
      }
      else{
        var json = {
          FIRSTNAME: $('#inputFirstName').val().trim(),
          LASTNAME: $('#inputLastName').val().trim(),
          PRIMARYID: $('#inputPrimaryId').val().trim(),
          INSNAME: $('#inputInsName').val().trim(),
          PAYORID: $('#inputPayerId').length ? $('#inputPayerId').val().trim() : "",
          GROUPPOLICYNO: $('#inputGroupPolicyNumber').length ? $('#inputGroupPolicyNumber').val().trim() : "",
          DEDUCTION: $('#inputDeduction').length ? $('#inputDeduction').val().trim() : "",
          COVERAGE: $('#inputCoverage').length ? $('#inputCoverage').val().trim() : "",
          COVERAGETYPE: $('#inputCoverageType').length ? $('#inputCoverageType').val().trim() : "",
          GROUPPLANNAME: $('#inputGroupPlanNamee').length ? $('#inputGroupPlanNamee').val().trim() : "",
          COVERAGETYPE: $('#inputCoverageType').length ? $('#inputCoverageType').val().trim() : "",
          DATEOFBIRTH: $('#inputDateOfBirth').length ? $('#inputDateOfBirth').val().trim() : "",
          EFFECTIVEDATE: $('#inputEffectiveDate').length ? $('#inputEffectiveDate').val().trim() : "",
          EXPIRATIONDATE: $('#inputExpirationDate').length ? $('#inputExpirationDate').val().trim() : "",
          ADDR1: $('#inputFull-Address1').length ? $('#inputFull-Address1').val().trim() : "",
          ADDR2: $('#inputStreet1').length ? $('#inputStreet1').val().trim() : "",
          CITY: $('#inputCity1').length ? $('#inputCity1').val().trim() : "",
          STATE: $('#inputState1').length ? $('#inputState1').val().trim() : "",
          ZIP: $('#inputZip1').length ? $('#inputZip1').val().trim() : "",
          WEB: $('#inputWeb1').length ? $('#inputWeb1').val().trim() : "",
          PHONE: $('#inputTelephone1').length ? $('#inputTelephone1').val().trim() : "",
          INSTYPE: cmGlb.insType ? cmGlb.insType : 1,
          INSTYPENAME: getInsType(cmGlb.insType),
          PATID: cmGlb.patId,
          USERID: cmGlb.userId
        };


        xrxAcuantScan_Controller.xrxAcuantScan_CheckForArchiveInsurance(json, function(err, record){

            $("#saveWaitSign").css("display", "none");

            if(err)
            {
              console.error(err);
              alert('Error: ' + 'There was an error checking insurance information.');
            }
            else
            {
              var isArchive = false;
              if(record && record.length > 0)
              {
                var retVal = confirm("Would you like to archive exsisting insurance information?");
                if(retVal)
                {
                  isArchive = true;
                }
              }

              //console.log(json);
              var bufferPdf = fs.readFileSync(pathPdf);
              xrxAcuantScan_Controller.xrxAcuantScan_SaveInsurance(json, bufferPdf, isArchive, function (message , IsDataSaved) {
                  //console.log(IsDataSaved);
                  //console.log(message);
                  if(IsDataSaved){
                    alert("The insurance data was saved successfully.");
                    window.close();
                  }
                  else{
                    alert("Error. Details:"+message);
                  }
              });



            }

        });



      }
    });

    $("#btn-process-medduplex").click(function () {
      process();
    });

    $("#btn-rescan-medduplex").click(function () {
        window.location.href = '../views/scan-ins.html';
    });
});
