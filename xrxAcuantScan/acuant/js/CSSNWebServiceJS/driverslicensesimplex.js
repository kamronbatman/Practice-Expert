$(document).ready(function () {

    Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', Dynamsoft_OnReady); // Register OnWebTwainReady event. This event fires as soon as Dynamic Web TWAIN is initialized and ready to be used

    var DWObject;
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
    }

    function ShowImageBase64Buffer() {

            DWObject.SelectedImagesCount = 1;
            for (var i = 0; i < 1; i++) {
                DWObject.SetSelectedImageIndex(0, i);
                DWObject.GetSelectedImagesSize(EnumDWT_ImageType.IT_JPG);
                frontImageBuffer = DWObject.SaveSelectedImagesToBase64Binary();
				
                document.getElementById('scanImage').innerHTML = "<img src= \"data:image/jpg;base64," + frontImageBuffer + "\"/>";
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
        document.getElementById("faceImage").style.display = "none";
        document.getElementById("signImage").style.display = "none";
        document.getElementById("extractedData").style.display = "none";
        $('#drivers-license-data').empty();
    };

    $("#btn-process-dlsimplex").click(function () {

			ResetControls();
        $('#errorDiv').html("");


        var imageToProcess;

        imageToProcess = dataURLtoBlob(frontImageBuffer);

		var selectedRegion = $("#region-select").val();

        //Accesing the web service
        $.ajax({
            type: "POST",
            url: "https://cssnwebservices.com/CSSNService/CardProcessor/ProcessDriversLicense/" + selectedRegion + "/true/-1/true/true/true/0/150/false/102",
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

                    //Display data returned by the web service
                    var data = AddDisplay("First Name", driversLicense.NameFirst);
                    data += AddDisplay("Middle Name", driversLicense.NameMiddle);
                    data += AddDisplay("Last Name", driversLicense.NameLast);
                    data += AddDisplay("License Number", driversLicense.license);
                    data += AddDisplay("Address", driversLicense.Address);
                    data += AddDisplay("City", driversLicense.City);
                    data += AddDisplay("State", driversLicense.State);
                    data += AddDisplay("Zip", driversLicense.Zip);
                    data += AddDisplay("Country", driversLicense.IdCountry);
                    data += AddDisplay("Expiration Date", driversLicense.ExpirationDate4);
                    data += AddDisplay("Issue Date", driversLicense.IssueDate4);
                    data += AddDisplay("Date Of Birth", driversLicense.DateOfBirth4);
                    data += AddDisplay("Sex", driversLicense.Sex);
                    data += AddDisplay("Eyes Color", driversLicense.Eyes);
                    data += AddDisplay("Hair Color", driversLicense.Hair);
                    data += AddDisplay("Height", driversLicense.Height);
                    data += AddDisplay("Weight", driversLicense.Weight);
                    data += AddDisplay("Class", driversLicense.Class);
                    data += AddDisplay("Restriction", driversLicense.Restriction);
                    data += AddDisplay("Endorsements", driversLicense.Endorsements);
                    data += AddDisplay("Address Verification", driversLicense.IsAddressVerified);
                    data += AddDisplay("ID Verification", driversLicense.IsIDVerified);

                    $(data).appendTo("#drivers-license-data");
                    document.getElementById("extractedData").style.display = "inline";

                    //Display face, sign and reformatted images on UI
                    var faceImage = driversLicense.FaceImage;
                    if (faceImage != null && faceImage != "") {
                        var base64FaceImage = goog.crypt.base64.encodeByteArray(faceImage);
                        document.getElementById("faceImage").style.display = "inline";
                        $("#face-image").attr("src", "data:image/jpg;base64," + base64FaceImage);
                    }

                    var signImage = driversLicense.SignImage;
                    if (signImage != null && signImage != "") {
                        var base64SignImage = goog.crypt.base64.encodeByteArray(signImage);
                        document.getElementById("signImage").style.display = "inline";
                        $("#signature-image").attr("src", "data:image/jpg;base64," + base64SignImage);
                    }

                    var reformattedImageFront = driversLicense.ReformattedImage;
                    if (reformattedImageFront != null && reformattedImageFront != "") {
                        var base64ReformattedImage = goog.crypt.base64.encodeByteArray(reformattedImageFront);
						document.getElementById('scanImage').innerHTML = "<img src= \"data:image/jpg;base64," + base64ReformattedImage + "\"/>";
                     //   document.getElementById("extractedData").style.display = "inline";
                        //$("#image").attr("src", "data:image/jpg;base64," + base64ReformattedImage);
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