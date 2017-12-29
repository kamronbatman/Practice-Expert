var remote = require('electron').remote;
var dbhelper1 = remote.getGlobal('dbhelper');

exports.xrxAppSch_Checkedin_Waiting = function (callback) {
    var sql =   "select Recno, PatName + ' (' + PatId + ')' as PatInfo, PatId, PatName, Room, ServDate, CheckedInTime from xrxAppSch_Checkedin "+
                "where DATEDIFF(day, GETDATE(), ServDate) = '0' AND Room IS NULL AND CheckedOutTime IS NULL "+
                "order by CheckedInTime ";
    dbhelper1.query(sql, function (err, record) {

        if ((!err) || typeof err == 'undefined') {

            var i;
            if (record.length != 0) {
                for (i = 0; i < record.length; i++) {

                    if (record[i].ROOM.value == null)
                        record[i].ROOM.value  = '';

                    if (record[i].CHECKEDINTIME.value == null)
                        record[i].CHECKEDINTIME.value = '';
                }
            }
            callback(null , record);
        }
        else {
            callback('Error: ' + err, record);
        }
    });
};

exports.xrxAppRoom = function (callback) {
    var sql =   "select RecNo, RoomId, AppTime, CheckedInTime, PatName, PatId, DctId, Status, AppColor from xrxAppRoom order by RoomId";
    dbhelper1.query(sql, function (err, record) {

        if ((!err) || typeof err == 'undefined') {

            var i;
            if (record.length != 0) {
                for (i = 0; i < record.length; i++) {

                    if (record[i].ROOMID.value == null)
                        record[i].ROOMID.value = '';

                    if (record[i].APPTIME.value == null)
                        record[i].APPTIME.value = '';

                    if (record[i].CHECKEDINTIME.value == null)
                        record[i].CHECKEDINTIME.value = '';

                    if (record[i].PATNAME.value == null)
                        record[i].PATNAME.value = '';

                    if (record[i].DCTID.value == null)
                        record[i].DCTID.value = '';

                    if (record[i].STATUS.value == null)
                        record[i].STATUS.value = '';

                    if (record[i].APPCOLOR.value === null)
                        record[i].APPCOLOR.value = '';
                    // else
                    //     record[i].APPCOLOR.value = '#'+record[i].APPCOLOR.value;

                }
            }
            callback(null , record);
        }
        else {
            callback('Error: ' + err, record);
        }
    });
};

exports.xrxAppRoom_WaitingToRoom = function (checkinRecno, roomRecNo, currentDateTime, callback) {

    var sqlWaitingToRoom =    " IF EXISTS(SELECT RECNO FROM xrxAppSch_Checkedin WHERE RECNO = '"+ checkinRecno +"' AND ROOM IS NULL) "+
                              " BEGIN"+
                              " BEGIN"+
                              " UPDATE xrxAppRoom SET"+
                              " PATID = (SELECT PatId FROM xrxAppSch_Checkedin WHERE RecNo = '"+ checkinRecno +"'),"+
                              " PATNAME = (SELECT (PATNAME + ' ('+PATID+')') FROM xrxAppSch_Checkedin WHERE RecNo = '"+ checkinRecno +"'),"+
                              " AppTime = (SELECT AppTime FROM xrxAppSch_Checkedin WHERE RecNo = '"+ checkinRecno +"'),"+
                              " CheckedInTime = (SELECT CheckedInTime FROM xrxAppSch_Checkedin WHERE RecNo = '"+ checkinRecno +"'),"+
                              " Status = 'Nurse',"+
                              " DCTID = (SELECT DctId FROM xrxAppSch_Checkedin WHERE RecNo = '"+ checkinRecno +"'),"+
                              " EntryDate = '"+ currentDateTime +"'"+
                              " WHERE RecNo = '"+ roomRecNo +"'"+
                              " END;"+

                              " BEGIN"+
                              " UPDATE xrxAppSch_Checkedin set Room = ( SELECT RoomId FROM xrxAppRoom WHERE RecNo = '"+ roomRecNo +"') "+
                              " WHERE RecNo = '"+ checkinRecno +"'"+
                              " END;"+
                              " END;"+
                              "";
   console.log(sqlWaitingToRoom);
                              //callback(sqlWaitingToRoom, true);

    dbhelper1.query(sqlWaitingToRoom, function (errWaitingToRoom, recordRoom) {
            if ((!errWaitingToRoom) || typeof errWaitingToRoom == 'undefined') {
                    callback("Changed room status successfully.", true);
                }
                else{
                    callback('Error: ' + errWaitingToRoom, false);//Error in sqlWaitingToRoom
                }
    });
};

exports.xrxAppRoom_UpdateStatus = function (roomRecno, roomStatus, callback) {
    var sqlUpdate =   "update xrxAppRoom set Status = '"+ roomStatus +"' where RecNo = '"+ roomRecno +"'";
    dbhelper1.query(sqlUpdate, function (errRoom, recordRoom) {
            if ((!errRoom) || typeof errRoom == 'undefined') {
                    callback("Changed room status successfully.", true);
                }
                else{
                    callback('Error: ' + errRoom, false);//Error in sqlUpdateCheckin
                }
    });
};

exports.xrxAppRoom_Checkout = function (roomRecno, currentDateTime, callback) {
    var sqlUpdateCheckin =      " BEGIN "+
                                " update xrxAppSch_Checkedin set Room = NULL, CheckedOutTime = '"+ currentDateTime +"' where "+
                                " PatId = ( select PatId from xrxAppRoom where RecNo = '"+ roomRecno +"') AND "+
                                " CheckedInTime = ( select CheckedInTime from xrxAppRoom where RecNo = '"+ roomRecno +"') "+
                                " END; "+

                                " BEGIN "+
                                " update a SET a.Status = 'CHECKOUT' from  xrxAppSch a JOIN xrxAppSch_Checkedin c on c.RecNo = a.Recno"+
                                " where a.PatId = (select PatId from xrxAppRoom where RecNo = '"+ roomRecno +"') and "+
                                " c.CheckedInTime = (select CheckedInTime from xrxAppRoom where RecNo = '"+ roomRecno +"') "+
                                " END; "+

                                " BEGIN "+
                                " update xrxAppRoom SET AppTime = NULL, PatId = NULL, PatName = NULL, DctId = NULL, CheckedInTime = NULL, Status = NULL "+
                                " where RecNo = '"+ roomRecno +"' "+
                                " END; ";
                                //callback(sqlUpdateCheckin, true);

    dbhelper1.query(sqlUpdateCheckin, function (errRoom, recordRoom) {
        if ((!errRoom) || typeof errRoom == 'undefined') {
            callback("Changed room status successfully.", true);
        }
        else{
            callback('Error: ' + errRoom, false);//Error in sqlUpdateCheckin
        }
    });
};

exports.xrxAppRoom_ChangeRoom = function (fromRoomRecno, toRoomRecno, currentDateTime, callback) {
    var sqlUpdateChangeRoom =     " DECLARE @TO_ROOM uniqueidentifier; "+
                                  " DECLARE @FROM_ROOM uniqueidentifier; "+
                                  " SET @TO_ROOM = '"+toRoomRecno+"'; "+
                                  " SET @FROM_ROOM = '"+fromRoomRecno+"'; "+

                                  " DECLARE @PAT_ID varchar(25); "+
                                  " SELECT @PAT_ID = PatId from xrxAppRoom where RecNo = @TO_ROOM; "+

                                  " IF(@PAT_ID IS NULL) "+  //MOVE
                                  " BEGIN "+
                                  " UPDATE xrxAppRoom SET  "+
                                  " PatId = (SELECT PatId FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " PatName = (SELECT PatName FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " AppTime = (SELECT AppTime FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " CheckedInTime = (SELECT CheckedInTime FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " Status = (SELECT Status FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " DctId = (SELECT DctId FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " EntryDate = '"+ currentDateTime +"' "+
                                  "  WHERE RecNo = @TO_ROOM; "+

                                  " UPDATE xrxAppRoom SET  "+
                                  " PatId = NULL, "+
                                  " PatName = NULL, "+
                                  " AppTime = NULL, "+
                                  " CheckedInTime = NULL, "+
                                  " Status = NULL, "+
                                  " DctId = NULL, "+
                                  " EntryDate = NULL "+
                                  " WHERE RecNo = @FROM_ROOM; "+
                                  " END; "+

                                  " ELSE "+  //SWAP
                                  " BEGIN "+

                                  " DECLARE @PAT_ID_TO varchar(25); "+
                                  " DECLARE @PAT_NAME_TO varchar(150); "+
                                  " DECLARE @APP_TIME_TO smalldatetime; "+
                                  " DECLARE @CHECKEDIN_TIME_TO smalldatetime; "+
                                  " DECLARE @STATUS_TO varchar(25); "+
                                  " DECLARE @DCT_ID_TO varchar(25); "+

                                  " SELECT @PAT_ID_TO = PatId from xrxAppRoom where RecNo = @TO_ROOM; "+
                                  " SELECT @PAT_NAME_TO = PatName from xrxAppRoom where RecNo = @TO_ROOM; "+
                                  " SELECT @APP_TIME_TO = AppTime from xrxAppRoom where RecNo = @TO_ROOM; "+
                                  " SELECT @CHECKEDIN_TIME_TO = CheckedInTime from xrxAppRoom where RecNo = @TO_ROOM; "+
                                  " SELECT @STATUS_TO = Status from xrxAppRoom where RecNo = @TO_ROOM; "+
                                  " SELECT @DCT_ID_TO = DctId from xrxAppRoom where RecNo = @TO_ROOM; "+

                                  " UPDATE xrxAppRoom SET  "+
                                  " PatId = (SELECT PatId FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " PatName = (SELECT PatName FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " AppTime = (SELECT AppTime FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " CheckedInTime = (SELECT CheckedInTime FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " Status = (SELECT Status FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " DctId = (SELECT DctId FROM xrxAppRoom WHERE RecNo = @FROM_ROOM), "+
                                  " EntryDate = '"+ currentDateTime +"' "+
                                  " WHERE RecNo = @TO_ROOM; "+

                                  " UPDATE xrxAppRoom SET  "+
                                  " PatId = @PAT_ID_TO, "+
                                  " PatName = @PAT_NAME_TO, "+
                                  " AppTime = @APP_TIME_TO, "+
                                  " CheckedInTime = @CHECKEDIN_TIME_TO, "+
                                  " Status = @STATUS_TO, "+
                                  " DctId = @DCT_ID_TO, "+
                                  " EntryDate = '"+ currentDateTime +"' "+
                                  " WHERE RecNo = @FROM_ROOM; "+
                                  " END;";
                                //callback(sqlUpdateChangeRoom, true);

    dbhelper1.query(sqlUpdateChangeRoom, function (errRoom, recordRoom) {
        if ((!errRoom) || typeof errRoom == 'undefined') {
            callback("Changed room successfully.", true);
        }
        else{
            callback('Error: ' + errRoom, false);//Error in sqlUpdateChangeRoom
        }
    });
};

exports.xrxAppRoom_ChangeToWaiting = function (roomRecno, callback) {
    var sqlRoomToWaiting =     " DECLARE @ROOM_RECNO uniqueidentifier; "+
                               " DECLARE @PATID varchar(25); "+
                               " DECLARE @CHECKEDIN_TIME smalldatetime; "+
                               " SET @ROOM_RECNO = '"+ roomRecno +"' "+
                               " SELECT @PATID = PatId from xrxAppRoom where RecNo = @ROOM_RECNO; "+
                               " SELECT @CHECKEDIN_TIME = CheckedInTime from xrxAppRoom where RecNo = @ROOM_RECNO; "+

                               " BEGIN "+
                               " UPDATE xrxAppSch_Checkedin SET "+
                               " Room = NULL "+
                               " WHERE PatId = @PATID AND CheckedInTime = @CHECKEDIN_TIME; "+

                               " UPDATE xrxAppRoom SET "+
                               " PatId = NULL, "+
                               " PatName = NULL, "+
                               " AppTime = NULL, "+
                               " CheckedInTime = NULL, "+
                               " Status = NULL, "+
                               " DctId = NULL, "+
                               " EntryDate = NULL "+
                               " WHERE RecNo = @ROOM_RECNO; "+
                               " END; ";

    //callback(sqlRoomToWaiting, true);
    console.log(sqlRoomToWaiting);

    dbhelper1.query(sqlRoomToWaiting, function (errRoom, recordRoom) {
        if ((!errRoom) || typeof errRoom == 'undefined') {
            callback("Moved to waiting room successfully.", true);
        }
        else{
            callback('Error: ' + errRoom, false);//Error in sqlRoomToWaiting
        }
    });
};

exports.xrxAppRoom_GetByRoomId = function(roomId, callback){
  var sql =   "select RecNo, RoomId, AppTime, CheckedInTime, PatName, PatId, DctId, Status, AppColor from xrxAppRoom where ROOMID = '" + roomId + "' ";
    dbhelper1.query(sql, function (err, record) {

        if ((!err) || typeof err == 'undefined') {

            var i;
            if (record.length != 0) {
                for (i = 0; i < record.length; i++) {

                    if (record[i].ROOMID.value == null)
                        record[i].ROOMID.value = '';

                    if (record[i].APPTIME.value == null)
                        record[i].APPTIME.value = '';

                    if (record[i].CHECKEDINTIME.value == null)
                        record[i].CHECKEDINTIME.value = '';

                    if (record[i].PATNAME.value == null)
                        record[i].PATNAME.value = '';

                    if (record[i].DCTID.value == null)
                        record[i].DCTID.value = '';

                    if (record[i].STATUS.value == null)
                        record[i].STATUS.value = '';

                    if (record[i].APPCOLOR.value === null)
                        record[i].APPCOLOR.value = '';
                    // else
                    //     record[i].APPCOLOR.value = '#'+record[i].APPCOLOR.value;

                }
            }
            callback(null , record);
        }
        else {
            callback('Error: ' + err, record);
        }
    });
};

exports.xrxAppRoom_GetByRecNo = function(recno, callback){
  var sql =   "select RecNo, RoomId, AppTime, CheckedInTime, PatName, PatId, DctId, Status, AppColor from xrxAppRoom where RECNO = '" + recno + "' ";
    dbhelper1.query(sql, function (err, record) {

        if ((!err) || typeof err == 'undefined') {

            var i;
            if (record.length != 0) {
                for (i = 0; i < record.length; i++) {

                    if (record[i].ROOMID.value == null)
                        record[i].ROOMID.value = '';

                    if (record[i].APPTIME.value == null)
                        record[i].APPTIME.value = '';

                    if (record[i].CHECKEDINTIME.value == null)
                        record[i].CHECKEDINTIME.value = '';

                    if (record[i].PATNAME.value == null)
                        record[i].PATNAME.value = '';

                    if (record[i].DCTID.value == null)
                        record[i].DCTID.value = '';

                    if (record[i].STATUS.value == null)
                        record[i].STATUS.value = '';

                    if (record[i].APPCOLOR.value === null)
                        record[i].APPCOLOR.value = '';
                    // else
                    //     record[i].APPCOLOR.value = '#'+record[i].APPCOLOR.value;

                }
            }
            callback(null , record);
        }
        else {
            callback('Error: ' + err, record);
        }
    });
};

exports.xrxAppRoom_Save = function(roomRecno, roomId, roomColor, callback){

  var sql = "";
  if(roomRecno){
    sql = " UPDATE xrxAppRoom SET "+
          " ROOMID = '"+ roomId +"',"+
          " APPCOLOR = '"+ roomColor +"'"+
          " WHERE RECNO = '" + roomRecno + "' ";
  }
  else{
    sql = " INSERT INTO xrxAppRoom (RECNO, ROOMID, APPCOLOR) VALUES(NEWID(), '"+ roomId +"','"+ roomColor +"')";
  }
  console.log(sql);

  dbhelper1.query(sql, function (errRoom, recordRoom) {
      if ((!errRoom) || typeof errRoom == 'undefined') {
          callback("Room data saved successfully.", true);
      }
      else{
          callback('Error: ' + errRoom, false);//Error in sql
      }
  });
};

exports.xrxAppRoom_Delete = function(roomRecno, callback){

  var sql =   "select RecNo, RoomId, AppTime, CheckedInTime, PatName, PatId, DctId, Status, AppColor from xrxAppRoom where RECNO = '" + roomRecno + "' ";
    dbhelper1.query(sql, function (err, record) {

        if ((!err) || typeof err == 'undefined') {

            var i;
            if (record.length > 0) {
              if(record[0].PATID.value === null || record[0].PATID.value === ''){
                  var sqlDelete = " DELETE FROM xrxAppRoom where RECNO = '" + roomRecno + "' ";
                  dbhelper1.query(sqlDelete, function (errRoom, recordRoom) {
                      if ((!errRoom) || typeof errRoom == 'undefined') {
                          callback("Room deleted successfully.", true);
                      }
                      else{
                          callback('Error: ' + errRoom, false);//Error in sqlDelete
                      }
                  });
              }
              else{
                callback('Cannot delete room. This room is currently being occupied.', false);
                return;
              }

            }
            else{
              callback('Error: No such record found', false);
              return;
            }
        }
        else {
            callback('Error: ' + err, false);//Error in sql
            return;
        }
    });
};

exports.xrxAppRoom_CheckUserType = function(userId, callback){
  var sql =   "select USERTYPE from xrxPsw where USERID = '" + userId + "' ";
    dbhelper1.query(sql, function (err, record) {

        if ((!err) || typeof err == 'undefined') {

            var i;
            if (record.length != 0) {

                if(record[0].USERTYPE.value === null)
                  record[0].USERTYPE.value = '';
            }
            callback(null , record);
        }
        else {
            callback('Error: ' + err, record);
        }
    });
};
