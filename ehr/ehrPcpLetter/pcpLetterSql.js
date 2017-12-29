var remote = require('electron').remote;
var dbhelper = remote.getGlobal('dbhelper');
var appPath = remote.getGlobal('appPath');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.getOptions = function(userId, visitType, callback) {

  sp = "xrxEhr_Options2_sp";

  parameters = [
    {parameter: 'UserId', type: 'VarChar', value: userId},
    {parameter: 'OptName', type: 'VarChar', value: 'PCP Letter'},
    {parameter: 'VisitType', type: 'VarChar', value: visitType}
  ];


  dbhelper.storeProcedure(sp, parameters, function (err, record) {

    // console.log("Error.....");
    // console.log(err);
    // console.log("Record.....");
    // console.log(record);

    callback(err, record);


  });




};

exports.saveOptions = function(userId, visitType,  data, callback) {


  var tempColStr = "";

  for (var key in data)
  {
    if (data.hasOwnProperty(key))
    {
      //console.log(key);
      tempColStr = tempColStr + ", ["+ key +"] = '"+ data[key] +"'  ";

    }
  }

  var colStr = tempColStr.slice(1);

  //console.log(colStr);

  var sql =   " UPDATE xrxEhr_options2 SET  "+ colStr +"  WHERE (UserId = '"+ userId +"') AND (OptName = 'PCP Letter') AND (isNull(VisitType, '') = '"+ visitType +"'); " ;

  //console.log(sql);

  dbhelper.query(sql,  function (err, record) {

      // console.log("Error.....");
      // console.log(err);
      // console.log("Record.....");
      // console.log(record);

      callback(err, record);

  });

};

exports.getPcpLetterTemplate = function (callback) {

  var sql = "select RecNo, FormHtml from xrxForms_List where FormName = 'PCP Letter'";

  dbhelper.query(sql,  function (err, record) {

    // console.log("Error.....");
    // console.log(err);
    // console.log("Record.....");
    // console.log(record);
    callback(err, record);

  });
};

exports.getPcpLetterData = function (patId, dateOfVisit, visitType, license, userId, rfdId, callback) {

  var sql = "select RecNo, FormSql from xrxForms_List where FormName = 'PCP Letter'";

  dbhelper.query(sql, function (err, record) {

      if(err)
      {
        callback(err, record);
      }
      else
      {
          if(record && record.length > 0)
          {
              if(record[0].FORMSQL.value)
              {
                  var sqlPcpLetter = record[0].FORMSQL.value;

                  d = new Date(dateOfVisit);
                  //If date is coming as utc.
                  offset = d.getTimezoneOffset()/60;
                  d.setHours(d.getHours() - offset);

                  parameters = [
                    {parameter: 'PatId', type: 'VarChar', value: patId},
                    {parameter: 'DateOfVisit', type: 'SmallDateTime', value: d},
                    {parameter: 'VisitType', type: 'VarChar', value: visitType},
                    {parameter: 'UserId', type: 'VarChar', value: userId},
                    {parameter: 'License', type: 'VarChar', value: license},
                    {parameter: 'rfdId', type: 'VarChar', value: rfdId}
                  ];

                  dbhelper.queryWithParams(sqlPcpLetter, parameters, function (err1, record1) {

                      callback(err1, record1);
                  });
              }
              else
              {
                  callback("Function : getPcpLetterData -> No SQL Value Found for PCP Letter in Record", null);
              }

          }
          else
          {
            callback("Function : getPcpLetterData -> No Record Found in xrxForms_List", null);
          }

      }

  });

}

exports.isLetterSaved = function(data, callback){

  var sql =  "select * from xrxImagesM where (ServDate = '"+data.servDate+"' AND  PatId = '"+data.patId+"'  AND ImgType = '"+data.imgType+"' AND ImgSubtype = '"+data.imgSubtype+"'  )";

  //console.log(sql);

  var config_I = {
      server: dbhelper.config.server,
      userName: dbhelper.config.userName,
      password: dbhelper.config.password,
      options: {
          instanceName: dbhelper.config.options.instanceName,
          database: data.database,
          rowCollectionOnRequestCompletion: true,
          useColumnNames : true,
          columnNameReplacer : function (columnName, index, columnMetaData) { return columnName.toUpperCase();},
          encrypt : cmGlb.isSqlAzure
      }
  }

    console.log(config_I);

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

  var  parameters = [
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
            columnNameReplacer : function (columnName, index, columnMetaData) { return columnName.toUpperCase(); },
            encrypt : cmGlb.isSqlAzure
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
