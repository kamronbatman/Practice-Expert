var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var moment = require(nodeModulesPath + 'moment');
var xrxTransaction_dbhelper = remote.getGlobal('dbhelper');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.xrxTransactionGetList = function (sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback){

  if(!sqlWhereClause){
    sqlWhereClause = "";
  }
  else{
    //sqlWhereClause = xrxStr.strClean(sqlWhereClause);
  }

  var tableName = "xrxSerializedTrx"
  var sqlJoin = " ";
  var selectColumns = "*";

  var sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY "+ sortBy +" "+ sortType +" ) AS rownumber FROM " + tableName + sqlJoin + sqlWhereClause + ") AS MyDerivedTable "+
              "WHERE rownumber >= '" + rowStart + "' AND rownumber <= '"+ rowEnd +"'";
    console.log(sql);
    xrxTransaction_dbhelper.query(sql, function (err, record) {
      if ((!err) || typeof err === 'undefined'){
            if (record) {
              callback(null, record);
            }
            else{
                callback(null, null);
            }
      }
      else{
            callback(err, null);
      }
    });
};

exports.xrxTransactionGetTransByRecno = function (recno, callback){

    var tableName = "xrxSerializedTrx";
    var selectColumns = "xrxPat.LASTNAME, xrxPat.FIRSTNAME,"+tableName+".RECNO,"+tableName+".TRANSACTIONDATE,"+tableName+".PATID,"+tableName+".PARTNUMBER,"+tableName+".SERIALNUMBER,"+tableName+".DESCRIPTION," +
                        tableName+".BLLPRVID,"+tableName+".CPTCODE,"+tableName+".ACTIVE,"+tableName+".STATUS,"+tableName+".CREATEDDATE,"+tableName+".CREATEDBY,"+tableName+".LASTMODIFIEDDATE,"+tableName+".LASTMODIFIEDBY,"
                        +tableName+".DELETEDDATE,"+tableName+".DELETEDBY,"+tableName+".RMA,"+tableName+".DCTID,"+tableName+".FCLID,"+tableName+".FROMDATE,"+tableName+".TODATE,"
                        +tableName+".PICKUPDATE,"+tableName+".INVRECNO";//,"+tableName+".LASTMODIFIEDBY,"+tableName+".LASTMODIFIEDBY,"+tableName+".LASTMODIFIEDBY,"+tableName+".LASTMODIFIEDBY,"+tableName+".LASTMODIFIEDBY";

	var sql = "select "+ selectColumns +" from "+tableName+" JOIN xrxPat ON "+tableName+".PATID=xrxPat.PATID where "+tableName+".RECNO='" + recno + "'";

    xrxTransaction_dbhelper.query(sql, function (err, record) {

        if ((!err) || typeof err === 'undefined') {

            var i;
            if (record.length !== 0) {
                for (i = 0; i < record.length; i++) {

                    if (record[i].TRANSACTIONDATE.value === null)
                        record[i].TRANSACTIONDATE.value = '';

                    if (record[i].PATID.value === null)
                        record[i].PATID.value = '';

                    if (record[i].PARTNUMBER.value === null)
                        record[i].PARTNUMBER.value = '';

                    if (record[i].SERIALNUMBER.value === null)
                        record[i].SERIALNUMBER.value = '';

                    if (record[i].DESCRIPTION.value === null)
                        record[i].DESCRIPTION.value = '';

                    if (record[i].BLLPRVID.value === null)
                        record[i].BLLPRVID.value = '';

                    if (record[i].CPTCODE.value === null)
                        record[i].CPTCODE.value = '';

                    if (record[i].ACTIVE.value === null)
                        record[i].ACTIVE.value = '';

                    if (record[i].STATUS.value === null)
                        record[i].STATUS.value = '';

                    if (record[i].CREATEDDATE.value === null)
                        record[i].CREATEDDATE.value = '';

                    if (record[i].CREATEDBY.value === null)
                        record[i].CREATEDBY.value = '';

                    if (record[i].LASTMODIFIEDDATE.value === null)
                        record[i].LASTMODIFIEDDATE.value = '';

                    if (record[i].LASTMODIFIEDBY.value === null)
                        record[i].LASTMODIFIEDBY.value = '';

                    if (record[i].DELETEDDATE.value === null)
                        record[i].DELETEDDATE.value = '';

                    if (record[i].DELETEDBY.value === null)
                        record[i].DELETEDBY.value = '';

                    if (record[i].RMA.value === null)
                        record[i].RMA.value = '';

                    if (record[i].DCTID.value === null)
                        record[i].DCTID.value = '';

                    if (record[i].FCLID.value === null)
                        record[i].FCLID.value = '';

                    if (record[i].FROMDATE.value === null)
                        record[i].FROMDATE.value = '';

                    if (record[i].TODATE.value === null)
                        record[i].TODATE.value = '';

                    if (record[i].PICKUPDATE.value === null)
                        record[i].PICKUPDATE.value = '';

                    if (record[i].LASTNAME.value === null)
                        record[i].LASTNAME.value = '';

                    if (record[i].FIRSTNAME.value === null)
                        record[i].FIRSTNAME.value = '';
                }
            }

            callback(null , record);
        }
        else {

            callback('Error: ' + err, record);

        }
    });
};

exports.xrxTransactionGetSQL = function (tableName, orderByColumnName, showDeleted, searchByColumn, searchValue) {


    var sql = "";
    var colsStr = "";
    var sqlJoin = " JOIN xrxPat on "+tableName+".PATID=xrxPat.PATID ";
    var selectColumns = "xrxPat.LASTNAME, xrxPat.FIRSTNAME,"+tableName+".RECNO,"+tableName+".TRANSACTIONDATE,"+tableName+".PATID,"+tableName+".PARTNUMBER,"+tableName+".SERIALNUMBER,"+tableName+".DESCRIPTION," +
                        tableName+".BLLPRVID,"+tableName+".CPTCODE,"+tableName+".ACTIVE,"+tableName+".STATUS,"+tableName+".CREATEDDATE,"+tableName+".CREATEDBY,"+tableName+".LASTMODIFIEDDATE,"+tableName+".LASTMODIFIEDBY,"
                        +tableName+".DELETEDDATE,"+tableName+".DELETEDBY,"+tableName+".RMA,"+tableName+".DCTID,"+tableName+".FCLID,"+tableName+".FROMDATE,"+tableName+".TODATE,"
                        +tableName+".PICKUPDATE,"+tableName+".INVRECNO";//,"+tableName+".LASTMODIFIEDBY,"+tableName+".LASTMODIFIEDBY,"+tableName+".LASTMODIFIEDBY,"+tableName+".LASTMODIFIEDBY,"+tableName+".LASTMODIFIEDBY";

    if (arguments.length > 5) {//Not used for this project

        var i;
        for (i = 5; i < (arguments.length) ; i++) {

            if (i == 5) {
                colsStr = colsStr + "  [" + arguments[i] + "] ";
            }
            else {
                colsStr = colsStr + ",  [" + arguments[i] + "] ";
            }
        }

        if (searchValue) {

            if(showDeleted === true)
                sql = "SELECT " + colsStr + " FROM (SELECT " + colsStr + ", ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + " WHERE (" + searchByColumn + " LIKE " + "'%" + searchValue + "%') ) AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
            else
                sql = "SELECT " + colsStr + " FROM (SELECT " + colsStr + ", ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + " WHERE (" + searchByColumn + " LIKE " + "'%" + searchValue + "%') AND DELETEDDATE IS NULL ) AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";

        }
        else {
            if(showDeleted === true)
                sql = "SELECT " + colsStr + " FROM (SELECT " + colsStr + ", ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + ") AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
            else
                sql = "SELECT " + colsStr + " FROM (SELECT " + colsStr + ", ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + " WHERE DELETEDDATE IS NULL) AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
        }

    }
    else if (arguments.length == 5) {


        if (searchValue) {

            if(showDeleted === true)
                sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + sqlJoin +" WHERE (" + searchByColumn + " LIKE " + "'%" + searchValue + "%' ) ) AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
            else
                sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + sqlJoin +" WHERE (" + searchByColumn + " LIKE " + "'%" + searchValue + "%' AND DELETEDDATE IS NULL) ) AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
        }
        else {
            if(showDeleted === true)
                sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + sqlJoin +") AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
            else
                sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + sqlJoin +" WHERE DELETEDDATE IS NULL) AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
        }
    }

    return sql;
};

exports.xrxTransactionDeleteTrx = function (recordnumber, deleteddate, callback){

    var sql = "UPDATE xrxSerializedTrx SET DELETEDDATE = '"+ deleteddate +"' WHERE RECNO ='"+ recordnumber +"'";

    //console.log(sql);

    xrxTransaction_dbhelper.query(sql, function (errSql, record) {
            if ((!errSql) || typeof errSql == 'undefined') {
                    callback("Deleted record successfully.", true);
                }
                else{
                    callback('Error deleting selected record. Details: ' + errSql, false);//Error in sql
                }
    });
};

exports.xrxTransactionSaveTrx = function (record, callback){

    var sql = "";
    if(record.recno){
        sql = "UPDATE xrxSerializedTrx SET INVRECNO = '"+ record.invrecno +"', "+
                                    "PARTNUMBER = '"+ record.partnumber +"', "+
                                    "DESCRIPTION = '"+ record.description +"', "+
                                    "CPTCODE = NULLIF('"+ record.cptcode +"',''), "+
                                    "SERIALNUMBER = '"+ record.serialnumber +"', "+
                                    "STATUS = '"+ record.status +"', "+
                                    "PATID = '"+ record.patid +"', "+
                                    "DCTID = '"+ record.dctid +"', "+
                                    "FCLID = NULLIF('"+ record.fclid +"',''), "+
                                    "ACTIVE = '"+ record.active +"', "+
                                    "RENTAL = '"+ record.rental +"', "+
                                    "TRANSACTIONDATE = '"+ record.transactiondate +"', "+
                                    //"CREATEDDATE = '"+ record.createddate +"', "+
                                    "LASTMODIFIEDDATE = '"+ record.lastmodifieddate +"', "+
                                    "LASTMODIFIEDBY = '"+ record.lastmodifiedby +"', "+
                                    "FROMDATE = NULLIF('"+ record.fromdate +"',''), "+
                                    "TODATE = NULLIF('"+ record.todate +"',''), "+
                                    "PICKUPDATE = NULLIF('"+ record.pickupdate +"','') "+
                                    "WHERE RECNO = '"+ record.recno +"'";
    }
    else{
        sql =   "INSERT INTO xrxSerializedTrx (RECNO, INVRECNO, PARTNUMBER, DESCRIPTION, CPTCODE, SERIALNUMBER, STATUS, PATID, TRANSACTIONDATE, LASTMODIFIEDDATE, LASTMODIFIEDBY, CREATEDDATE, DCTID, FCLID, FROMDATE, TODATE, PICKUPDATE) "+
                "VALUES (NEWID(), '"+ record.invrecno +"', '"+ record.partnumber +"','"+ record.description +"', NULLIF('"+ record.cptcode +"',''),'"+ record.serialnumber +"','"+ record.status +"','"+ record.patid +"','"+ record.transactiondate +"',"+
                " '"+ record.lastmodifieddate +"', '"+ record.lastmodifiedby +"', '"+ record.createddate +"', "+
                " '"+ record.dctid +"', '"+ record.fclid +"', NULLIF('"+ record.fromdate +"',''), NULLIF('"+ record.todate +"',''), NULLIF('"+ record.pickupdate +"',''))";
    }

    console.log(sql);

    xrxTransaction_dbhelper.query(sql, function (errSql, record) {
            if ((!errSql) || typeof errSql == 'undefined') {
                    callback("Saved record successfully.", true);
                }
                else{
                    callback('Error: ' + errSql, false);//Error in sql
                }
    });
};

exports.xrxTransactionGetTrxByInvRecNo = function (invrecno, callback){

    var sql = "select * from xrxSerializedTrx where INVRECNO='" + invrecno + "' AND DELETEDDATE IS NULL";

    xrxTransaction_dbhelper.query(sql, function (err, record) {

        if ((!err) || typeof err === 'undefined') {

            callback(null , record);
        }
        else {

            callback('Error: ' + err, record);

        }
    });
};

//React
exports.xrxTransactionGetCount = function (sqlWhereClause, callback){
    var sql = "SELECT COUNT(*) AS COUNT FROM xrxSerializedTrx " + sqlWhereClause;
    //console.log(sql);
    xrxTransaction_dbhelper.query(sql, function (err, record) {

        if ((!err) || typeof err === 'undefined') {
            if (record) {
                callback(null , record[0].COUNT.value);
            }
            else
            {
                callback(null , 0);
            }
        }
        else {
            callback('Error: ' + err, 0);

        }
    });
};

exports.xrxTransactionGetRow = function (sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback){
    var tableName = "xrxSerializedTrx"
    var sqlJoin = " JOIN xrxPat on "+tableName+".PATID=xrxPat.PATID ";
    var selectColumns = "xrxPat.LASTNAME, xrxPat.FIRSTNAME, (xrxPat.LASTNAME + ', ' + xrxPat.FIRSTNAME) AS PATNAME, "+tableName+".RECNO,"+tableName+".TRANSACTIONDATE,"+tableName+".PATID,"+tableName+".PARTNUMBER,"+tableName+".SERIALNUMBER,"+tableName+".DESCRIPTION," +
                        tableName+".BLLPRVID,"+tableName+".CPTCODE,"+tableName+".ACTIVE,"+tableName+".STATUS,"+tableName+".CREATEDDATE,"+tableName+".CREATEDBY,"+tableName+".LASTMODIFIEDDATE,"+tableName+".LASTMODIFIEDBY,"
                        +tableName+".DELETEDDATE,"+tableName+".DELETEDBY,"+tableName+".RMA,"+tableName+".DCTID,"+tableName+".FCLID,"+tableName+".FROMDATE,"+tableName+".TODATE,"
                        +tableName+".PICKUPDATE,"+tableName+".INVRECNO";

    var sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY "+ sortBy +" "+ sortType +" ) AS rownumber FROM " + tableName + sqlJoin + sqlWhereClause + ") AS MyDerivedTable "+
                "WHERE rownumber >= '" + rowStart + "' AND rownumber <= '"+ rowEnd +"'";

    //var sql = "SELECT * FROM (SELECT ROW_NUMBER() OVER (ORDER BY PARTNUMBER ASC) AS rownumber,*  FROM xrxSerializedInv "+ sqlWhereClause +") AS TEMP WHERE rownumber = '" + rowNumber + "'";
    //console.log(sql);
    xrxTransaction_dbhelper.query(sql, function (err, record) {

        if ((!err) || typeof err === 'undefined') {
            if (record && record.length > 0) {
                    var recordSimpleArray = [];

                    for(var i = 0; i < record.length; i++){
                    if (record[i].TRANSACTIONDATE.value === null)
                        record[i].TRANSACTIONDATE.value = '';

                    if (record[i].PATID.value === null)
                        record[i].PATID.value = '';

                    if (record[i].PARTNUMBER.value === null)
                        record[i].PARTNUMBER.value = '';

                    if (record[i].SERIALNUMBER.value === null)
                        record[i].SERIALNUMBER.value = '';

                    if (record[i].DESCRIPTION.value === null)
                        record[i].DESCRIPTION.value = '';

                    if (record[i].BLLPRVID.value === null)
                        record[i].BLLPRVID.value = '';

                    if (record[i].CPTCODE.value === null)
                        record[i].CPTCODE.value = '';

                    if (record[i].ACTIVE.value === null)
                        record[i].ACTIVE.value = '';

                    if (record[i].STATUS.value === null)
                        record[i].STATUS.value = '';

                    if (record[i].CREATEDDATE.value === null)
                        record[i].CREATEDDATE.value = '';

                    if (record[i].CREATEDBY.value === null)
                        record[i].CREATEDBY.value = '';

                    if (record[i].LASTMODIFIEDDATE.value === null)
                        record[i].LASTMODIFIEDDATE.value = '';

                    if (record[i].LASTMODIFIEDBY.value === null)
                        record[i].LASTMODIFIEDBY.value = '';

                    if (record[i].DELETEDDATE.value === null)
                        record[i].DELETEDDATE.value = '';

                    if (record[i].DELETEDBY.value === null)
                        record[i].DELETEDBY.value = '';

                    if (record[i].RMA.value === null)
                        record[i].RMA.value = '';

                    if (record[i].DCTID.value === null)
                        record[i].DCTID.value = '';

                    if (record[i].FCLID.value === null)
                        record[i].FCLID.value = '';

                    if (record[i].FROMDATE.value === null)
                        record[i].FROMDATE.value = '';

                    if (record[i].TODATE.value === null)
                        record[i].TODATE.value = '';

                    if (record[i].PICKUPDATE.value === null)
                        record[i].PICKUPDATE.value = '';

                    if (record[i].LASTNAME.value === null)
                        record[i].LASTNAME.value = '';

                    if (record[i].FIRSTNAME.value === null)
                        record[i].FIRSTNAME.value = '';

                    if (record[i].PATNAME.value === null)
                        record[i].PATNAME.value = '';


                    var recordSimple = convertToSimpleJson(record[i]);
                    recordSimpleArray.push(recordSimple);
                    }

                callback(null , recordSimpleArray);
            }
            else
            {
                callback('Error: No record.' , null);
            }
        }
        else {
            callback('Error: ' + err, null);

        }
    });
};

function formatDateTime(datetime){
    if(datetime){
        return moment(datetime).utcOffset(new Date().getTimezoneOffset()).format("MM/DD/YYYY");
    }
    else{
        return "";
    }
};

function convertToSimpleJson(recordTedious){

    var record = {
                    RECNO:'', TRANSACTIONDATE:'', PATID:'', PARTNUMBER:'', SERIALNUMBER:'', DESCRIPTION:'', BLLPRVID:'',
                    CPTCODE:'', ACTIVE:'', STATUS:'', CREATEDDATE:'', CREATEDBY:'', LASTMODIFIEDDATE:'',
                    LASTMODIFIEDBY:'', DELETEDDATE:'', DELETEDBY:'', RMA:'', DCTID:'', FCLID:'', FROMDATE:'', TODATE:'', PICKUPDATE:'',
                    LASTNAME:'', FIRSTNAME:'', PATNAME:''
                };
    if(recordTedious){
        record.RECNO = recordTedious.RECNO.value;
        record.TRANSACTIONDATE = formatDateTime(recordTedious.TRANSACTIONDATE.value);
        record.PATID = recordTedious.PATID.value;
        record.PARTNUMBER = recordTedious.PARTNUMBER.value;
        record.SERIALNUMBER = recordTedious.SERIALNUMBER.value;
        record.DESCRIPTION = recordTedious.DESCRIPTION.value;
        record.BLLPRVID = recordTedious.BLLPRVID.value;
        record.CPTCODE = recordTedious.CPTCODE.value;
        record.ACTIVE = recordTedious.ACTIVE.value;
        record.STATUS = recordTedious.STATUS.value;
        record.CREATEDDATE = formatDateTime(recordTedious.CREATEDDATE.value);
        record.CREATEDBY = recordTedious.CREATEDBY.value;
        record.LASTMODIFIEDDATE = formatDateTime(recordTedious.LASTMODIFIEDDATE.value);
        record.LASTMODIFIEDBY = recordTedious.LASTMODIFIEDBY.value;
        record.DELETEDDATE = formatDateTime(recordTedious.DELETEDDATE.value);
        record.DELETEDBY = recordTedious.DELETEDBY.value;
        record.RMA = recordTedious.RMA.value;
        record.DCTID = recordTedious.DCTID.value;
        record.FCLID = recordTedious.FCLID.value;
        record.FROMDATE = formatDateTime(recordTedious.FROMDATE.value);
        record.TODATE = formatDateTime(recordTedious.TODATE.value);
        record.PICKUPDATE = formatDateTime(recordTedious.PICKUPDATE.value);
        record.LASTNAME = recordTedious.LASTNAME.value;
        record.FIRSTNAME = recordTedious.FIRSTNAME.value;
        record.PATNAME = recordTedious.PATNAME.value;
    }
    return record;
};
