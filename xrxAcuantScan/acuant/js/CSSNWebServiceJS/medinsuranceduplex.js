$(document).ready(function () {

    Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

    var DWObject;
    var duplexScanner;
    var frontImageBuffer;
    var backImageBuffer;

    function Dynamsoft_OnReady() {
        DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer'); // Get the Dynamic Web TWAIN object that is embeded in the div with id 'dwtcontrolContainer'
        if (DWObject) {
            var count = DWObject.SourceCount;
            for (var i = 0; i < count; i++)
                document.getElementById("source").options.add(new Option(DWObject.GetSourceNameItems(i), i));
			DWObject.RegisterEvent('OnPostAllTransfers', ShowImageBase64Buffer);
        }
    }

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
            if (document.getElementById("ShowUI").checked)
                DWObject.IfShowUI = true;
            else
                DWObject.IfShowUI = false;

            if (document.getElementById("ShowUI").checked) {
                DWObject.IfDisableSourceAfterAcquire = true; // Only used with scanning UI
            }

            //Resolution
            DWObject.Resolution = parseInt("300");
            DWObject.AcquireImage();
        }
    }

    function SaveImagesToDisk() {
        DWObject.IfShowFileDialog = false;
        DWObject.SaveAsJPEG("C:\\test - Copy\\img1.jpg", 0);
        DWObject.SaveAsJPEG("C:\\test - Copy\\img2.jpg", 1);
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
        DWObject.RemoveAllImages();
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

    //Format data displayed to UI.
    function AddDisplay(fieldName, fieldValue) {

        if (fieldName == "Address Verification") {
            var string = "<div class=\"form-group\">";
            string += "<label class=\"col-md-4 control-label\">";
            string += fieldName;
            string += "</label>";
            string += "<div class=\"col-md-7\">";
            string += "<p class=\"form-control text-center\">";
            string += fieldValue;
            string += "</p>";
            string += "</div>";
            string += "</div>";
            return string;
        }
        else if (fieldValue) {
            var string = "<div class=\"form-group\">";
            string += "<label class=\"col-md-4 control-label\">";
            string += fieldName;
            string += "</label>";
            string += "<div class=\"col-md-7\">";
            string += "<p class=\"form-control text-center\">";
            string += fieldValue;
            string += "</p>";
            string += "</div>";
            string += "</div>";
            return string;
        }
        else
            return "";
    };

		    //Clears populated controls. Prepares UI for next processing.
    function ResetControls() {
        document.getElementById("extractedData").style.display = "none";
        $('#drivers-license-data').empty();
    };

    $("#btn-process-medduplex").click(function () {

	ResetControls();
        $('#errorDiv').html("");


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
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "LicenseKey " + authinfo);
                $('#loading').html("<img src='images/processing.gif'/>");
                $("#div-controls").hide();
            },
            success: function (data) {

                var medicalCard = JSON.stringify(data);
                medicalCard = jQuery.parseJSON(medicalCard);

                //Checking if there are errors returned.
                 if (medicalCard.ResponseCodeAuthorization < 0) {
                    $('#errorDiv').html("<p>CSSN Error Code: " + medicalCard.ResponseMessageAuthorization + "</p>");
                }
                else if (medicalCard.WebResponseCode < 1) {
                    $('#errorDiv').html("<p>CSSN Error Code: " + medicalCard.WebResponseDescription + "</p>");
                }
                else {

                    //Display data returned by the web service
                    var data = AddDisplay("MemberName", medicalCard.MemberName);
                    data += AddDisplay("NameSuffix", medicalCard.NameSuffix);
                    data += AddDisplay("NamePrefix", medicalCard.NamePrefix);
                    data += AddDisplay("FirstName", medicalCard.FirstName);
                    data += AddDisplay("MiddleName", medicalCard.MiddleName);
                    data += AddDisplay("LastName", medicalCard.LastName);
                    data += AddDisplay("MemberId", medicalCard.MemberId);
                    data += AddDisplay("GroupNumber", medicalCard.GroupNumber);
                    data += AddDisplay("ContractCode", medicalCard.ContractCode);
                    data += AddDisplay("CopayEr", medicalCard.CopayEr);
                    data += AddDisplay("CopayOv", medicalCard.CopayOv);
                    data += AddDisplay("CopaySp", medicalCard.CopaySp);
                    data += AddDisplay("CopayUc", medicalCard.CopayUc);
                    data += AddDisplay("Coverage", medicalCard.Coverage);
                    data += AddDisplay("DateOfBirth", medicalCard.DateOfBirth);
                    data += AddDisplay("Deductible", medicalCard.Deductible);
                    data += AddDisplay("EffectiveDate", medicalCard.EffectiveDate);
                    data += AddDisplay("Employer", medicalCard.Employer);
                    data += AddDisplay("ExpirationDate", medicalCard.ExpirationDate);
                    data += AddDisplay("GroupName", medicalCard.GroupName);
                    data += AddDisplay("IssuerNumber", medicalCard.IssuerNumber);
                    data += AddDisplay("Other", medicalCard.Other);
                    data += AddDisplay("PayerId", medicalCard.PayerId);
                    data += AddDisplay("PlanAdmin", medicalCard.PlanAdmin);
                    data += AddDisplay("PlanProvider", medicalCard.PlanProvider);
                    data += AddDisplay("PlanType", medicalCard.PlanType);
                    data += AddDisplay("RxBin", medicalCard.RxBin);
                    data += AddDisplay("RxGroup", medicalCard.RxGroup);
                    data += AddDisplay("RxId", medicalCard.RxId);
                    data += AddDisplay("RxPcn", medicalCard.RxPcn);

                    var addressCount = medicalCard.ListAddress.length;
                    if (addressCount > 0) {
                        for (var i = 0; i < addressCount; i++) {
                            data += AddDisplay("Full Address (" + (i + 1) + ") ", medicalCard.ListAddress[i].FullAddress);
                            data += AddDisplay("Street (" + (i + 1) + ")", medicalCard.ListAddress[i].Street);
                            data += AddDisplay("City (" + (i + 1) + ")", medicalCard.ListAddress[i].City);
                            data += AddDisplay("State (" + (i + 1) + ")", medicalCard.ListAddress[i].State);
                            data += AddDisplay("Zip (" + (i + 1) + ")", medicalCard.ListAddress[i].Zip);
                        }
                    }

                    var webCount = medicalCard.ListWeb.length;
                    if (webCount > 0) {
                        for (var i = 0; i < webCount; i++) {
                            data += AddDisplay("Web (" + (i + 1) + ")", medicalCard.ListWeb[i].Label == "" ? medicalCard.ListWeb[i].Value : medicalCard.ListWeb[i].Label + " - " + medicalCard.ListWeb[i].Value);
                        }
                    }

                    var emailCount = medicalCard.ListEmail.length;
                    if (emailCount > 0) {
                        for (var i = 0; i < emailCount; i++) {
                            data += AddDisplay("Email (" + (i + 1) + ")", medicalCard.ListEmail[i].Label == "" ? medicalCard.ListEmail[i].Value : medicalCard.ListEmail[i].Label + " - " + medicalCard.ListEmail[i].Value);
                        }
                    }

                    var telephoneCount = medicalCard.ListTelephone.length;
                    if (telephoneCount > 0) {
                        for (var i = 0; i < telephoneCount; i++) {
                            data += AddDisplay("Telephone (" + (i + 1) + ")", medicalCard.ListTelephone[i].Label == "" ? medicalCard.ListTelephone[i].Value : medicalCard.ListTelephone[i].Label + " - " + medicalCard.ListTelephone[i].Value);
                        }
                    }

                    var deductibleCount = medicalCard.ListDeductible.length;
                    if (deductibleCount > 0) {
                        for (var i = 0; i < deductibleCount; i++) {
                            data += AddDisplay("Deductible (" + (i + 1) + ")", medicalCard.ListDeductible[i].Label == "" ? medicalCard.ListDeductible[i].Value : medicalCard.ListDeductible[i].Label + " - " + medicalCard.ListDeductible[i].Value);
                        }
                    }

                    var planCodeCount = medicalCard.ListPlanCode.length;
                    if (planCodeCount > 0) {
                        for (var i = 0; i < planCodeCount; i++) {
                            data += AddDisplay("PlanCode (" + (i + 1) + ")", medicalCard.ListPlanCode[i].PlanCode);
                        }
                    }

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
                $("#div-controls").hide();
            },
            complete: function (e) {
                $('#loading').html("");
                $("#div-controls").hide();
            }
        });
    });

    $("#btn-scan").click(function () {
        AcquireImage();
    });

    $("#btn-show-image").click(function () {
        ShowImageBase64Buffer();
    });

    $("#btn-save-image").click(function () {
        SaveImagesToDisk();
    });
});
