var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.getCatList = function (callback) {
    var sql =  "select * from xrxForms_CatList;";
    dbhelper.query(sql, function (err, record) {
        if (err) {
            callback('Error: ' + err, null);
        }
        else {
              callback(null , record);
        }
    });
};

exports.getList = function (recNo, callback) {
    var sql =  "select * from xrxForms_List where CatRecno = '"+recNo+"'";
    dbhelper.query(sql, function (err, record) {
        if (err) {
            callback('Error: ' + err, null);
        }
        else {
              callback(null , record);
        }
    });
};

exports.getLetter = function(recNo, callback) {
  var sql =  "select * from xrxForms_List where RecNo = '"+recNo+"'";
  dbhelper.query(sql, function (err, record) {
      if (err) {
          callback('Error: ' + err, null);
      }
      else {

        if(record && record.length > 0) {
          callback(null , record);
        }
        else {
          callback('No letter found!', null);
        }

      }
  });
};

exports.getLetterData = function(patId, dateOfVisit, license, recNo, callback) {

  var sql =  "select * from xrxForms_List where RecNo = '"+recNo+"'";
  dbhelper.query(sql, function (err, record) {
      if (err) {
          callback('Error: ' + err, null);
      }
      else {

          if(record && record.length > 0) {

            if(record[0].FORMSQL.value) {

                var sqlLetter = record[0].FORMSQL.value;

                d = new Date(dateOfVisit);

                //If date is coming as utc.
                offset = d.getTimezoneOffset()/60;
                d.setHours(d.getHours() - offset);

                var parameters = [
                    {parameter: 'PatId', type: 'VarChar', value: patId},
                    {parameter: 'DateOfVisit', type: 'SmallDateTime', value: d},
                    {parameter: 'License', type: 'VarChar', value: license}
                ];

                dbhelper.queryWithParams(sqlLetter, parameters, function (err, record1) {

                  if (err) {
                      callback('Error: ' + err, null);
                  }
                  else {
                      callback(null , record1);
                  }

                });
            }
            else {
              callback('No letter sql found!', null);
            }

          }
      }
  });

};

exports.isLetterSaved = function(data, callback){

  var sql =  "select * from xrxImagesM where (ServDate = '"+data.servDate+"' AND  PatId = '"+data.patId+"'  AND ImgType = '"+data.imgType+"' AND ImgSubtype = '"+data.imgSubtype+"'  )";

  console.log(sql);

  var config_I = {
      server: dbhelper.config.server,
      userName: dbhelper.config.userName,
      password: dbhelper.config.password,
      options: {
          instanceName: dbhelper.config.options.instanceName,
          database: data.database,
          rowCollectionOnRequestCompletion: true,
          useColumnNames : true,
          columnNameReplacer : function (columnName, index, columnMetaData) { return columnName.toUpperCase(); }
      }
  }

  dbhelper.queryWithConfig(sql, config_I, function (err, record) {

    if (err) {
        callback('Error: ' + err, null);
    }
    else {

      if(record && record.length > 0) {
        callback(null , record);
      }
      else {
        callback(null, record);
      }

    }

  });

};

exports.saveLetter = function(data, callback) {

  var sql =  "  DECLARE @Guid uniqueidentifier; \
                SET @Guid = NEWID(); \
                insert into xrxImagesM (RecNo, ImgType, ImgSubtype, ServDate, PatId, DctId, UserId, ScanDate, InsId, ImgName, PatName) \
                values (@Guid, '"+data.imgType+"', '"+data.imgSubtype+"', '"+data.servDate+"', '"+data.patId+"', '"+data.dctId+"', '"+data.userId+"', GETDATE(), null, null, null) \
                insert into xrxImagesD (ImgId, Img, Comment, SDate, OrderNo, UserId, ServDate) \
                values (@Guid, @img, null, GETDATE(), 1, '"+data.userId+"', '"+data.servDate+"') ";

  var parameters = [
    {parameter: 'img', type: 'VarBinary', value: data.img}
  ];

  var config_I = {
      server: dbhelper.config.server,
      userName: dbhelper.config.userName,
      password: dbhelper.config.password,
      options: {
          instanceName: dbhelper.config.options.instanceName,
          database: data.database,
          rowCollectionOnRequestCompletion: true,
          useColumnNames : true,
          columnNameReplacer : function (columnName, index, columnMetaData) { return columnName.toUpperCase(); }
      }
  }

  dbhelper.queryWithConfigAndParams(sql, config_I, parameters, function (err, record) {

      if (err)
      {
        callback(err, null);
      }
      else
      {
        callback(null , record);
      }

  });

};
