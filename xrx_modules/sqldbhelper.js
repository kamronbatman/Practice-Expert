var Connection = require("tedious").Connection;
var Request = require("tedious").Request;
var TYPES = require('tedious').TYPES;
var connStrParser = require('./conn-parser');

//Development
var config = {
    server: "",
    userName: "",
    password: "",
    options: {
        instanceName: "",
        database: "",
        rowCollectionOnRequestCompletion: true,
        useColumnNames : true,
        //useUTC : false,
        columnNameReplacer : function (columnName, index, columnMetaData) { return columnName.toUpperCase(); },
        encrypt : false
    }
}

module.exports.config = config;

module.exports.query = function (sqlqry, callback) {

    var connection = new Connection(config);
    connection.on('connect', function (err) {
       if (err) {
            //console.log(err);
            callback(err, null);
        }
        else {
            executeStatement();
        }
    });

    connection.on('debug', function (text) {
        //console.log(text);
    });

    function executeStatement() {
        var request = new Request(sqlqry, function (err, rowCount, rows) {
            if (err) {
                //console.log(err);
                callback(err, null);

            } else {
                //console.log(+'rows Count: ' + rowCount);
                //console.log(rows);
                callback(err, rows);
            }
            connection.close();
        });
        connection.execSql(request);
     }
}

module.exports.queryWithParams = function (sqlqry, parameters, callback) {

    var connection = new Connection(config);
    connection.on('connect', function (err) {
       if (err) {
            //console.log(err);
            callback(err, null);
        }
        else {
            executeStatement();
        }
    });

    connection.on('debug', function (text) {
        //console.log(text);
    });

    function executeStatement() {
        var request = new Request(sqlqry, function (err, rowCount, rows) {
            if (err) {
                //console.log(err);
                callback(err, null);

            } else {
                //console.log(+'rows Count: ' + rowCount);
                //console.log(rows);
                callback(err, rows);
            }
            connection.close();
        });
        if(parameters){
            for (i=0; i<parameters.length; i++){
              if(parameters[i].type == TYPES.SmallDateTime.name){
                request.addParameter(parameters[i].parameter, TYPES[parameters[i].type], new Date(parameters[i].value));
              }
              else{
                console.log(parameters[i].type);
                request.addParameter(parameters[i].parameter, TYPES[parameters[i].type], parameters[i].value);
              }
            }
        }
        connection.execSql(request);
     }
}

module.exports.queryWithConfig = function (sqlqry, newConfig, callback) {
    var connection = new Connection(newConfig);
    connection.on('connect', function (err) {
        if (err) {
            //console.log(err);
            callback(err, null);
        }
        else {
            executeStatement();
        }
    });

    connection.on('debug', function (text) {
        //console.log(text);
    });

    function executeStatement() {
        request = new Request(sqlqry, function (err, rowCount, rows) {
            if (err) {
                //console.log(err);
                callback(err, null);
            } else {
                //console.log(+'rows Count: ' + rowCount);
                //console.log(rows);
                callback(err, rows);
            }
            connection.close();
        });

        connection.execSql(request);
     }
}

module.exports.queryWithConfigAndParams = function (sqlqry, newConfig, parameters, callback) {
    var connection = new Connection(newConfig);
    connection.on('connect', function (err) {
        if (err) {
            //console.log(err);
            callback(err, null);
        }
        else {
            executeStatement();
        }
    });

    connection.on('debug', function (text) {
        //console.log(text);
    });

    function executeStatement() {
        request = new Request(sqlqry, function (err, rowCount, rows) {
            if (err) {
                //console.log(err);
                callback(err, null);
            } else {
                //console.log(+'rows Count: ' + rowCount);
                //console.log(rows);
                callback(err, rows);
            }
            connection.close();
        });

        if(parameters){
            for (i=0; i<parameters.length; i++){
                if(parameters[i].type == TYPES.SmallDateTime.name){
                    request.addParameter(parameters[i].parameter, TYPES[parameters[i].type], new Date(parameters[i].value));
                }
                else{
                    console.log(parameters[i].type);
                    request.addParameter(parameters[i].parameter, TYPES[parameters[i].type], parameters[i].value);
                }
            }
        }

        connection.execSql(request);
    }
}


module.exports.queryClinicDb = function (sqlqry, clinicid, callback) {

   var sqlClinic = "SELECT * FROM xrxCompany WHERE RECNO = '"+clinicid+"' ";

    var result = this.query(sqlClinic, function (err, record) {
        if ((!err) || typeof err == 'undefined')
        {
            if(record)
            {
                if(record.length > 0)
                {

                    var dbString = record[0].DBCONNECTIONSTRING.value;
                    var dbConfig = connStrParser.parseConnectionString(dbString);
                    //console.log(dbConfig);

                    var clientConfig = {
                        server: dbConfig.DataSource,
                        userName: dbConfig.UserId,
                        password: dbConfig.Password,
                        options: {
                            database: dbConfig.InitialCatalog,
                            rowCollectionOnRequestCompletion: true,
                            useColumnNames : true,
                            columnNameReplacer : function (columnName, index, columnMetaData) { return columnName.toUpperCase(); }
                        }
                    };

                    var connection = new Connection(clientConfig);

                    connection.on('connect', function (err) {
                        if (err) {
                            console.log(err);
                            callback(err, null);
                        }
                        else {
                            executeStatement();
                        }
                    });

                    connection.on('debug', function (text) {

                        //console.log(text);
                    });

                    function executeStatement() {
                        var request = new Request(sqlqry, function (err, rowCount, rows) {
                            if (err) {
                                //console.log(err);
                                callback(err, null);
                            } else {
                                callback(err, rows);
                            }
                            connection.close();
                        });

                        connection.execSql(request);
                     }
                }
                else
                {
                    callback("Error: No CLINICID found.", null);
                }
            }
            else
            {
                callback("Error: No CLINICID found.", null);
            }
        }
        else
        {
            callback(err, null);
        }
    });
};

module.exports.queryClinicDb_Portal = function (sqlqry, clinicid, callback) {

   var sqlClinic = "SELECT * FROM xrxClinics WHERE CLINICID = '"+clinicid+"' ";

    var result = this.query(sqlClinic, function (err, record) {
        if ((!err) || typeof err == 'undefined')
        {
            if(record)
            {
                if(record.length > 0)
                {
                    var clientConfig = {
                        server: record[0].DATASOURCE.value,
                        userName: record[0].USERID.value,
                        password: record[0].PASSWORD.value,
                        options: {
                            database: record[0].INITIALCATALOG.value,
                            rowCollectionOnRequestCompletion: true,
                            useColumnNames : true,
                            columnNameReplacer : function (columnName, index, columnMetaData) { return columnName.toUpperCase(); }
                        }
                    };

                    var connection = new Connection(clientConfig);

                    connection.on('connect', function (err) {
                        if (err) {
                            //console.log(err);
                            callback(err, null);
                        }
                        else {
                            executeStatement();
                        }
                    });

                    connection.on('debug', function (text) {

                        //console.log(text);
                    });

                    function executeStatement() {
                        var request = new Request(sqlqry, function (err, rowCount, rows) {
                            if (err) {
                                //console.log(err);
                                callback(err, null);
                            } else {
                                callback(err, rows);
                            }
                            connection.close();
                        });

                        connection.execSql(request);
                     }
                }
                else
                {
                    callback("Error: No CLINICID found.", null);
                }
            }
            else
            {
                callback("Error: No CLINICID found.", null);
            }
        }
        else
        {
            callback(err, null);
        }
    });
};

module.exports.loadDataWithRowOffSet = function (sqlqry, startRow, endRow, callback){

    var connection = new Connection(config);

    connection.on('connect', function (err) {

        if (err) {

            //console.log(err);
            callback(err, null);

        }
        else {

            executeStatement();
        }
    });

    connection.on('debug', function (text) {

        //console.log(text);

    });

    function executeStatement() {


        var request = new Request(sqlqry, function (err, rowCount, rows) {

            if (err) {

                //console.log(err);
                callback(err, null);

            } else {

                //console.log(+'rows Count: ' + rowCount);
                //console.log(rows);

                callback(err, rows);

            }

            connection.close();
        });

        request.addParameter('startRow', TYPES.Int, startRow);
        request.addParameter('endRow', TYPES.Int, endRow);

        connection.execSql(request);

    }
}

module.exports.storeProcedure = function (sp, parameters, callback) {

    var connection = new Connection(config);

    connection.on('connect', function (err) {

        if (err) {

            //console.log(err);
            callback(err, null);

        }
        else {

           executeStatement();
        }

    });

    connection.on('debug', function (text) {

        //console.log(text);

    });

    function executeStatement() {


        request = new Request(sp, function (err, rowCount, rows) {

            if (err) {

               //console.log(err);
                callback(err, null);

            } else {

                //console.log('rows Count: ' + rowCount);
                //console.log(rows);
                callback(err, rows);

            }

            connection.close();
        });



        if(parameters)
        {
            for (i=0; i<parameters.length; i++)
            {
              if(parameters[i].type == TYPES.SmallDateTime.name)
              {
                request.addParameter(parameters[i].parameter, TYPES[parameters[i].type], new Date(parameters[i].value));
              }
              else
              {
                console.log(parameters[i].type);
                request.addParameter(parameters[i].parameter, TYPES[parameters[i].type], parameters[i].value);
              }
            }
        }

        connection.callProcedure(request);


     }

}
