var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var fs = require('fs');
var moment = require(nodeModulesPath + 'moment');
var Handlebars = require(nodeModulesPath + 'handlebars');
const path = require('path');

var refreshInterval = 30;
var filterVacantRooms = false;
var isOfficeManager = false;
var xrxAppRooms_Controller = require(appPath + "/xrxAppRooms/controllers/xrxAppRoomsController.js");
//Electron
var cmGlb = remote.getGlobal('cmGlb');

$(document).ready(function () {
    checkUsertype();
    loadApp_Rooms_Current();
    loadRoomsEditorModal();

    $('#roomList').collapse('toggle');
    $('#waitingRoomList').collapse('toggle');
    setRoomFilter();
});

$(document).on("hidden.bs.modal", "#modalRoomEditor", function (e) {

    loadApp_Rooms_Current();
});

function setRefreshTimer(time) {
    refreshInterval = time;
    document.getElementById("refreshrate_Span").innerHTML = time;
    clearInterval(refreshResult);
    refreshResult = setInterval(loadApp_Rooms_Current, refreshInterval*1000);
};

function setRoomFilter() {

    var filtertype = document.getElementById("btnRoomFilter").innerHTML;
    if(filtertype){
        if(filtertype === "Hide vacant"){
            filterVacantRooms = true;
            document.getElementById("btnRoomFilter").innerHTML = "Show all";
            loadApp_Rooms_Current();
        }
        else{
            filterVacantRooms = false;
            document.getElementById("btnRoomFilter").innerHTML = "Hide vacant";
            loadApp_Rooms_Current();
        }
    }
};

var refreshResult = setInterval(loadApp_Rooms_Current, refreshInterval*1000);

function loadApp_Rooms_Waiting(record_rooms){
    xrxAppRooms_Controller.xrxAppSch_Checkedin_Waiting(function (err_message, record) {

        if (err_message != null) {
            alert(err_message);
        }
        else {

              fs.readFile(appPath+'/xrxAppRooms/views/waitingRoomList.html', function (err, data) {

                    if (err) {
                        document.getElementById("waitingRoomList").innerHTML = err.toString();
                        return;
                    }

                    var template = Handlebars.compile(data.toString());
                    document.getElementById("waitingRoomList").innerHTML = template({ waitlist: record , rooms : record_rooms});
              });
        }
    });//end xrxAppSch_Checkedin_Waiting

    if(!isOfficeManager){
        $('#btnAddRoom').attr("style", "display: none");
    }
};

function loadApp_Rooms_Current(){
    //alert(refreshInterval);
    xrxAppRooms_Controller.xrxAppRoom(function (err_message, record) {
        if (err_message !== null) {
            alert(err_message);
        }
        else {
                loadApp_Rooms_Waiting(record);

                fs.readFile(appPath+'/xrxAppRooms/views/roomList.html', function (err, data) {

                    if (err) {
                        document.getElementById("roomList").innerHTML = err.toString();
                        return;
                    }

                    var template = Handlebars.compile(data.toString());
                    document.getElementById("roomList").innerHTML = template({ currentlist : record, rooms : record});
                });

                setStatus(record);
            }

    });//end xrxAppRoom
};

function checkUsertype(){
    xrxAppRooms_Controller.xrxAppRoom_CheckUserType(cmGlb.userId,function (err_message, record) {
        if (err_message !== null) {
            //alert(err_message);
        }
        else {
                console.log(record);
                if(record){
                    if(record[0]){
                        if(record[0].USERTYPE.value === "OFFICEMANAGER"){
                            isOfficeManager = true;
                        }
                    }
                }

            }

    });//end xrxAppRoom_CheckUserType
};

Handlebars.registerHelper('roomhelper_isOfficeManager', function() {
    return isOfficeManager ? '' : 'display:none;';
});

Handlebars.registerHelper('roomhelper_color', function(color) {
  //return new Handlebars.SafeString("<a href='" + Handlebars.Utils.escapeExpression(this.url) + "'>" + Handlebars.Utils.escapeExpression(this.body) + "</a>");
  return "#" + (color.value !== '' ? (color.value.toString(16)) : 'FFFFFF');
});

Handlebars.registerHelper('roomhelper_visibility', function(patid) {
    return (filterVacantRooms && !patid.value) ? 'none' : '';
});

Handlebars.registerHelper('roomhelper_hideRoomOption', function(roomPatId, currPatId) {
    return (roomPatId === currPatId) ? 'none' : '';
});

Handlebars.registerHelper('roomhelper_changeRoomButtonId', function(currRecNo, roomRecNo) {
    return currRecNo + "_" + roomRecNo + "_ChangeRoomButton";
});

Handlebars.registerHelper('roomhelper_checkOutButtonId', function(roomRecNo) {
    return roomRecNo + "_CheckoutButton";
});

Handlebars.registerHelper('roomhelper_datetimeFormat', function(datetimeData) {
    return (datetimeData !== '' ? moment(datetimeData).add(new Date().getTimezoneOffset(), 'minutes').format("MM-DD-YYYY, h:mm a") : "");
});

Handlebars.registerHelper('roomhelper_timeFormat', function(timeData) {
    return (timeData !== '' ? moment(timeData).add(new Date().getTimezoneOffset(), 'minutes').format("h:mm:ss a") : "");
});

Handlebars.registerHelper('roomhelper_timeHumanizeFormat', function(timeData) {
    return (timeData !== '' ? moment.duration(moment(new Date()).diff(moment(timeData).add(new Date().getTimezoneOffset(), 'minutes'))).humanize() : "");
});

Handlebars.registerHelper('roomhelper_selectedStatus', function(option, value) {
    if (option === value) {
        return ' selected';
    } else {
        return '';
    }
});

function checkoutRoom(sel) {
    if(sel){

        var roomRecNo = sel.split("_");
        if(roomRecNo && roomRecNo[0]){
                var currDateTime = moment(new Date()).format('YYYY-MM-DD hh:mm');
                var  recNo = roomRecNo[0];
                if(confirm("Are you sure you want to check out this patient?") == true){
                xrxAppRooms_Controller.xrxAppRoom_Checkout(recNo, currDateTime, function (message , IsDataSaved) {

                    document.getElementById("errorMessage").innerHTML = message;
                    if(IsDataSaved)
                    {
                        loadApp_Rooms_Current();
                    }
                    else
                    {
                        alert(message);
                    }

                });
            }

        }
    }
};

function setStatus(currentlist){
    // if(currentlist && currentlist.length > 0){
    //     for(i=0;i<currentlist.length; i++)
    //     {
    //         if(currentlist[i].PATID.value !== null){
    //             var statusSelect = document.getElementById(currentlist[i].RECNO.value);
    //             if(statusSelect){
    //               statusSelect.options[2].selected = "selected";//Default to Nurse
    //               if(currentlist[i].STATUS.value){
    //                   if(currentlist[i].STATUS.value === "Doctor")
    //                       statusSelect.options[0].selected = "selected";
    //                   else if(currentlist[i].STATUS.value === "Audiologist")
    //                       statusSelect.options[1].selected = "selected";
    //                   else if(currentlist[i].STATUS.value === "Nurse")
    //                       statusSelect.options[2].selected = "selected";
    //                   else if(currentlist[i].STATUS.value === "Phys. asst.")
    //                       statusSelect.options[3].selected = "selected";
    //                   else if(currentlist[i].STATUS.value === "Staff")
    //                       statusSelect.options[4].selected = "selected";
    //                   else if(currentlist[i].STATUS.value === "Technician")
    //                       statusSelect.options[5].selected = "selected";
    //               }
    //             }
    //         }
    //     }
    // }
};

function changeStatus(sel){
    console.log('called');
    var roomStatus = document.getElementById(sel.id).value;
    if(roomStatus)
    {
        var roomRecNo = sel.id;
        if (roomStatus == "PA"){
            roomStatus = "Phys. asst.";
        }

        xrxAppRooms_Controller.xrxAppRoom_UpdateStatus(roomRecNo, roomStatus, function (message , IsDataSaved) {

            document.getElementById("errorMessage").innerHTML = message;
            if(IsDataSaved)
            {
                loadApp_Rooms_Current();
            }
            else
            {
                alert(message);
            }

        });

    }
};

function changeWaitingToRoom(sel){
    var recNoList = sel.split("_");
    if(recNoList && recNoList[0] && recNoList[1]){
        var waitingRecNo = recNoList[0];
        var roomRecNo = recNoList[1];
        var currDateTime = moment(new Date()).format('YYYY-MM-DD hh:mm');

        xrxAppRooms_Controller.xrxAppRoom_WaitingToRoom(waitingRecNo, roomRecNo, currDateTime, function (message , IsDataSaved) {

            document.getElementById("errorMessage").innerHTML = message;
            if(IsDataSaved)
            {
                loadApp_Rooms_Current();
            }
            else
            {
                alert(message);
            }
        });

    }
};

function changeRoomToWaiting(sel){
    var recNoList = sel.split("_");
    console.log(recNoList);
    if(recNoList && recNoList[0]){
        var roomRecNo = recNoList[0];
        xrxAppRooms_Controller.xrxAppRoom_ChangeToWaiting(roomRecNo, function (message , IsDataSaved) {

            document.getElementById("errorMessage").innerHTML = message;
            if(IsDataSaved)
            {
                loadApp_Rooms_Current();
            }
            else
            {
                alert(message);
            }
        });

    }
};

function swapRoom(sel){
    var recNoList = sel.split("_");
    if(recNoList && recNoList[0] && recNoList[1]){
        var fromRecNo = recNoList[0];
        var toRecNo = recNoList[1];
        var currDateTime = moment(new Date()).format('YYYY-MM-DD hh:mm');
        xrxAppRooms_Controller.xrxAppRoom_ChangeRoom(fromRecNo, toRecNo, currDateTime, function (message , IsDataSaved) {

            document.getElementById("errorMessage").innerHTML = message;
            if(IsDataSaved)
            {
                loadApp_Rooms_Current();
            }
            else
            {
                alert(message);
            }
        });

    }
};

function loadRoomsEditorModal(){
    $('<div id="modalRoomMain"/>').appendTo('body');
    $("#modalRoomMain").load("../views/editrooms.html");
};

function showRoomEditModal(recno){
    if(recno){
        xrxAppRooms_Controller.xrxAppRoom_GetByRecNo(recno, function (err_message, record){
            if (err_message !== null) {
                alert(err_message);
            }
            else {
                    fs.readFile('xrxAppRooms/views/editrooms_body.html', function (err, data) {

                        if (err) {
                            document.getElementById("modalRoomEditorBody").innerHTML = err.toString();
                            return;
                        }

                        var template = Handlebars.compile(data.toString());
                        document.getElementById("modalRoomEditorBody").innerHTML = template({ room: record[0] });

                        $('#formRoom').validator();
                        var colorInt = record[0].APPCOLOR.value;
                        if(!colorInt){
                            colorInt = 16777215;
                        }
                        console.log(colorInt);
                        var colorHexa = "#" + colorInt.toString(16);
                        console.log(colorHexa);
                        $("#inputRoomColor").val(colorHexa);
                        $("#inputRoomId").css("background-color", colorHexa);
                        // var colorKendo = "#ffffff";
                        // try{
                        //     colorKendo = kendo.parseColor(colorHexa);
                        //     $("#inputRoomId").css("background-color", colorHexa);
                        // }
                        // catch(ex) {
                        //     console.log('Cannot parse color: "' + color + '"');
                        // }

                        // var colorpicker = $("#inputRoomColor").kendoColorPicker({
                        //     value: colorKendo,
                        //     buttons: false,
                        //     select: previewColor
                        // }).data("kendoColorPicker");
                    });

            }
        });
    }
    else{
        fs.readFile('xrxAppRooms/views/editrooms_body.html', function (err, data) {

            if (err) {
                document.getElementById("modalRoomEditorBody").innerHTML = err.toString();
                return;
            }

            var template = Handlebars.compile(data.toString());
            document.getElementById("modalRoomEditorBody").innerHTML = template({ room: { RECNO: '' } });

            $('#formRoom').validator();
            $("#inputRoomColor").val("#ffffff");
            // var colorInt = 16777215;
            // var colorHexa = "#" + colorInt.toString(16);
            // console.log(colorInt.toString(16));
            // var colorKendo = "#ffffff";
            // try{
            //     colorKendo = kendo.parseColor(colorHexa);
            //     $("#inputRoomId").css("background-color", colorHexa);
            // }
            // catch(ex) {
            //     console.log('Cannot parse color: "' + color + '"');
            // }

            // var colorpicker = $("#inputRoomColor").kendoColorPicker({
            //     value: colorKendo,
            //     buttons: false,
            //     select: previewColor
            // }).data("kendoColorPicker");
        });
    }

    $('#modalRoomEditor').modal('show');
};

// function previewColor(e) {
//     $("#inputRoomId").css("background-color", e.value);
// };

function clickColor(){
    var colorHexa = $("#inputRoomColor").val();
    $("#inputRoomId").css("background-color", colorHexa);
};

function alreadyExistsRoomId(){

    var newlyEnteredRoomId = checkSqlEscapeCharater($('#inputRoomId').val());
    var oldRoomId = $('#inputOldRoomId').val();
    var recno = $('#inputOldRecNo').val();

    if(newlyEnteredRoomId){
        $('#errRoomId').text("");
        $('#divRoomId').prop('class', 'has-error');
        $('#divRoomId').attr('class', 'row form-group');
        if(oldRoomId){
            if(oldRoomId === newlyEnteredRoomId)
                return;
        }

        xrxAppRooms_Controller.xrxAppRoom_GetByRoomId(newlyEnteredRoomId, function (err_message, record) {

            if (err_message != null) {
                alert(err_message);
            }
            else {
                if(record.length > 0){
                    $('#errRoomId').text("Already exists");
                    $('#divRoomId').attr('class', 'row form-group has-error');
                }
            }
        });
    }
};

function clickSave(){
    if($("#divRoomId").hasClass("has-error")){
        bootbox.alert("Please fix the errors", function () {
            });
    }
    else{
        $('#formRoom').validator('validate');
        if($("#divRoomId").hasClass("has-error")){
            bootbox.alert("Please fix the errors", function () {
            });
        }
        else{
            var newRoomId = checkSqlEscapeCharater($('#inputRoomId').val());
            var recno = $('#inputOldRecNo').val();
            var newRoomColor = "16777215";

            try{
                //var colorHexa = $("#inputRoomColor").data("kendoColorPicker").value();
                var colorHexa = $("#inputRoomColor").val();
                console.log(colorHexa);
                if(colorHexa){
                    colorHexa = colorHexa.replace("#", "");
                    newRoomColor = parseInt(colorHexa, 16);
                }
            }
            catch(ex) {
                console.log('Cannot parse color: "' + color + '"');
            }

            xrxAppRooms_Controller.xrxAppRoom_Save(recno, newRoomId, newRoomColor, function (message, success) {

                if (success) {
                    bootbox.alert(message, function () {
                        $('#modalRoomEditor').modal('hide');
                    });
                }
                else {
                    bootbox.alert(message, function () {
                    });
                }
            });
        }
    }
};

function clickDelete(recno){
    if(recno){

        bootbox.confirm("This room will be removed from the current list. Are you sure?", function (result) {

            if(result){
                xrxAppRooms_Controller.xrxAppRoom_Delete(recno, function (message, success) {

                    if (success) {
                        bootbox.alert(message, function () {
                            $('#modalRoomEditor').modal('hide');
                        });
                    }
                    else {
                        bootbox.alert(message, function () {
                        });
                    }
                });
            }
        });
    }
};

function checkSqlEscapeCharater(sqlValue) {
    var escapeSqlValue = "";
    if(sqlValue){
        escapeSqlValue = sqlValue.replace(new RegExp("'", 'g'), "''");
    }
    return escapeSqlValue;
};
