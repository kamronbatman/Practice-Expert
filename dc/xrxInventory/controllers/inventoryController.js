var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var moment = require(nodeModulesPath + 'moment');
var xrxInventory_dbhelper = remote.getGlobal('dbhelper');
var xrxStr = require(appPath + "/xrx_modules/xrx-str");

exports.xrxInventoryGetList = function (sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback){

  if(!sqlWhereClause){
    sqlWhereClause = "";
  }
  else{
    //sqlWhereClause = xrxStr.strClean(sqlWhereClause);
  }

  var tableName = "xrxSerializedInv"
  var sqlJoin = " ";
  var selectColumns = "*";

  var sql = "SELECT  *  FROM (SELECT "+selectColumns+", ROW_NUMBER() OVER (ORDER BY "+ sortBy +" "+ sortType +" ) AS rownumber FROM " + tableName + sqlJoin + sqlWhereClause + ") AS MyDerivedTable "+
              "WHERE rownumber >= '" + rowStart + "' AND rownumber <= '"+ rowEnd +"'";
    console.log(sql);
    xrxInventory_dbhelper.query(sql, function (err, record) {
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

exports.xrxInventoryGetInvByRecno = function (recno, callback){

	var sql = "select * from xrxSerializedInv where RECNO='" + recno + "'";

    xrxInventory_dbhelper.query(sql, function (err, record) {

        if ((!err) || typeof err === 'undefined') {

            var i;
            if (record.length !== 0) {
                for (i = 0; i < record.length; i++) {

                    if (record[i].DESCRIPTION.value === null)
                        record[i].DESCRIPTION.value = '';

                    if (record[i].PARTNUMBER.value === null)
                        record[i].PARTNUMBER.value = '';

                    if (record[i].SERIALNUMBER.value === null)
                        record[i].SERIALNUMBER.value = '';

                    if (record[i].BLLPRVID.value === null)
                        record[i].BLLPRVID.value = '';

                    if (record[i].CPTCODE.value === null)
                        record[i].CPTCODE.value = '';

                    if (record[i].ORIGSERVICEDATE.value === null)
                        record[i].ORIGSERVICEDATE.value = '';

                    if (record[i].ACTIVE.value === null)
                        record[i].ACTIVE.value = '';

                    if (record[i].COST.value === null)
                        record[i].COST.value = '';

                    if (record[i].STATUS.value === null)
                        record[i].STATUS.value = '';

                    if (record[i].AMORTIZE.value === null)
                        record[i].AMORTIZE.value = '';

                    if (record[i].AMORTIZATIONPERIOD.value === null)
                        record[i].AMORTIZATIONPERIOD.value = '';

                    if (record[i].AMORTIZATIONENDDATE.value === null)
                        record[i].AMORTIZATIONPERIOD.value = '';

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
                }
            }

            callback(null , record);
        }
        else {

            callback('Error: ' + err, record);

        }
    });
};

exports.xrxInventoryGetSQL = function (tableName, orderByColumnName, showDeleted, searchByColumn, searchValue) {


    var sql = "";
    var colsStr = "";
    //console.log(showDeleted);

    if (arguments.length > 5) {

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
                sql = "SELECT  *  FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + " WHERE (" + searchByColumn + " LIKE " + "'%" + searchValue + "%' ) ) AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
            else
                sql = "SELECT  *  FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + " WHERE (" + searchByColumn + " LIKE " + "'%" + searchValue + "%' AND DELETEDDATE IS NULL) ) AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
        }
        else {
            if(showDeleted === true)
                sql = "SELECT  *  FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + ") AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
            else
                sql = "SELECT  *  FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY " + orderByColumnName + ") AS RowNum FROM " + tableName + " WHERE DELETEDDATE IS NULL) AS MyDerivedTable WHERE (MyDerivedTable.RowNum BETWEEN @startRow AND @endRow) ";
        }
    }
    return sql;
}

exports.xrxInventorySaveInv = function (record, callback){

	var sql = "";//Also check for Duplicate serial number
	if(record.recno){
		sql = "UPDATE xrxSerializedInv SET PARTNUMBER = '"+ record.partnumber +"', "+
				"DESCRIPTION = '"+ record.description +"', "+
				"CPTCODE = NULLIF('"+ record.cptcode +"',''), "+
				"SERIALNUMBER = '"+ record.serialnumber +"', "+
				"STATUS = '"+ record.status +"', "+
				"COST = '"+ record.cost +"', "+
				"ORIGSERVICEDATE = '"+ record.origservicedate +"', "+
				"RMA = NULLIF('"+ record.rma +"',''), "+
				"DCTID = '"+ record.dctid +"', "+
				"FCLID = NULLIF('"+ record.fclid +"',''), "+
				"ACTIVE = '"+ record.active +"', "+
				//"CREATEDDATE = '"+ record.createddate +"', "+
				"LASTMODIFIEDDATE = '"+ record.lastmodifiedDate +"', "+
				"LASTMODIFIEDBY = '"+ record.newLastModifiedBy +"', "+
				"AMORTIZE = '"+ record.amortize +"', "+
				"AMORTIZATIONPERIOD = NULLIF('"+ record.amortizePeriod +"',''), "+
				"AMORTIZATIONENDDATE = NULLIF('"+ record.amortizationenddate +"','') "+
				"WHERE RECNO = '"+ record.recno +"';"+

                " UPDATE xrxSerializedTrx SET PARTNUMBER = '"+ record.partnumber +"', "+
                "DESCRIPTION = '"+ record.description +"', "+
                "CPTCODE = NULLIF('"+ record.cptcode +"',''), "+
                "SERIALNUMBER = '"+ record.serialnumber +"' "+
                "WHERE INVRECNO = '"+ record.recno +"' AND DELETEDDATE IS NULL;";

	}
	else{
		sql = 	"INSERT INTO xrxSerializedInv (RECNO, PARTNUMBER, DESCRIPTION, CPTCODE, SERIALNUMBER, STATUS, COST, ORIGSERVICEDATE, LASTMODIFIEDDATE, LASTMODIFIEDBY, RMA, DCTID, FCLID, CREATEDDATE, AMORTIZE, AMORTIZATIONPERIOD, AMORTIZATIONENDDATE) "+
				"VALUES (NEWID(), '"+ record.partnumber +"','"+ record.description +"', NULLIF('"+ record.cptcode +"',''),'"+ record.serialnumber +"','"+ record.status +"','"+ record.cost +"','"+ record.origservicedate +"',"+
				" '"+ record.lastmodifiedDate +"', '"+ record.newLastModifiedBy +"',"+
				" NULLIF('"+ record.rma +"',''),'"+ record.dctid +"', NULLIF('"+ record.fclid +"',''),'"+ record.createddate +"' ,'"+ record.amortize +"', NULLIF('"+ record.amortizePeriod +"',''), NULLIF('"+ record.amortizationenddate +"',''))";
	}

	console.log(sql);

	xrxInventory_dbhelper.query(sql, function (errSql, record) {
            if ((!errSql) || typeof errSql == 'undefined') {
                    callback("Saved record successfully.", true);
                }
                else{
                    callback('Error: ' + errSql, false);//Error in sql
                }
    });
};

exports.xrxInventoryDeleteInv = function (recordnumber, deleteddate, callback){

    var sqlCheck = " SELECT * FROM xrxSerializedTrx WHERE INVRECNO = '"+ recordnumber +"' ";
    xrxInventory_dbhelper.query(sqlCheck, function (errCheck, record) {

        if ((!errCheck) || typeof errCheck === 'undefined') {

            var i;
            if (record.length !== 0) {
                callback('Cannot delete item. Details: This item is currently being used in Serialized Transaction.', false);
                return;
            }
        }
        else {
            callback('Error: ' + errCheck, false);
            return;
        }
    });

	var sql = "UPDATE xrxSerializedInv SET DELETEDDATE = '"+ deleteddate +"' WHERE RECNO ='"+ recordnumber +"'";
	//console.log(sql);

	xrxInventory_dbhelper.query(sql, function (errSql, record) {
        if ((!errSql) || typeof errSql == 'undefined') {
            callback("Deleted record successfully.", true);
        }
        else{
            callback('Error deleting selected record. Details: ' + errSql, false);//Error in sql
        }
    });
};

exports.xrxInventoryGetInvBySerialnumber = function (recno, serialnumber, callback){

    var sql = "select RECNO, SERIALNUMBER from xrxSerializedInv where SERIALNUMBER='" + serialnumber + "' AND DELETEDDATE IS NULL";

    if(recno){
        sql += " AND RECNO <> '" + recno + "'";
    }
    console.log(sql);
    xrxInventory_dbhelper.query(sql, function (err, record) {

        if ((!err) || typeof err === 'undefined') {

            var i;
            if (record.length !== 0) {
                for (i = 0; i < record.length; i++) {

                    if (record[i].SERIALNUMBER.value === null)
                        record[i].SERIALNUMBER.value = '';
                }
            }

            callback(null , record);
        }
        else {

            callback('Error: ' + err, record);

        }
    });
};

//Inventory Item
exports.xrxInventoryGetInvItemByPartnumber = function (partnumber, callback){

	var sql = "select * from xrxSerializedItm where PARTNUMBER='" + partnumber + "' AND DELETEDDATE IS NULL ";

    xrxInventory_dbhelper.query(sql, function (err, record) {

        if ((!err) || typeof err === 'undefined') {

            var i;
            if (record.length !== 0) {
                for (i = 0; i < record.length; i++) {

                    if (record[i].DESCRIPTION.value === null)
                        record[i].DESCRIPTION.value = '';

                    if (record[i].PARTNUMBER.value === null)
                        record[i].PARTNUMBER.value = '';

                    if (record[i].CPTCODE.value === null)
                        record[i].CPTCODE.value = '';
                }
            }

            callback(null , record);
        }
        else {

            callback('Error: ' + err, record);

        }
    });
};

exports.xrxInventoryGetInvItemByDescription = function (description, callback){

    var sql = "select * from xrxSerializedItm where DESCRIPTION='" + description + "'";

    xrxInventory_dbhelper.query(sql, function (err, record) {

        if ((!err) || typeof err === 'undefined') {

            var i;
            if (record.length !== 0) {
                for (i = 0; i < record.length; i++) {

                    if (record[i].DESCRIPTION.value === null)
                        record[i].DESCRIPTION.value = '';

                    if (record[i].PARTNUMBER.value === null)
                        record[i].PARTNUMBER.value = '';

                    if (record[i].CPTCODE.value === null)
                        record[i].CPTCODE.value = '';
                }
            }

            callback(null , record);
        }
        else {

            callback('Error: ' + err, record);

        }
    });
};

exports.xrxInventoryAddInvItem = function (recordItem, callback){

	var sql = 	"INSERT INTO xrxSerializedItm (RECNO ,PARTNUMBER ,DESCRIPTION ,CPTCODE) "+
				"VALUES ( NEWID() , '"+ recordItem.partnumber +"', '"+ recordItem.description +"', '"+ recordItem.cptcode +"') ";

    console.log(sql);

	xrxInventory_dbhelper.query(sql, function (errInsert, record) {
            if ((!errInsert) || typeof errInsert == 'undefined') {
                    callback("Saved record successfully.", true);
                }
                else{
                    callback('Error: ' + errInsert, false);//Error in sql
                }
    });
};

exports.xrxInventoryUpdateInvItemByPartnumber = function (partnumber, recordItem, callback){

	var sql = 	" IF EXISTS(SELECT * FROM xrxSerializedItm WHERE PARTNUMBER = '"+ partnumber +"') "+
                " BEGIN "+
                " UPDATE xrxSerializedItm SET PARTNUMBER = '"+ recordItem.partnumber +"', "+
											" DESCRIPTION = '"+ recordItem.description +"', "+
											" CPTCODE = '"+ recordItem.cptcode +"' "+
				" WHERE PARTNUMBER = '"+ partnumber +"' "+
                " END "+
                " ELSE "+
                " BEGIN "+
                " INSERT INTO xrxSerializedItm (RECNO ,PARTNUMBER ,DESCRIPTION ,CPTCODE) "+
                " VALUES ( NEWID() , '"+ recordItem.partnumber +"', '"+ recordItem.description +"', '"+ recordItem.cptcode +"') "+
                " END";

    console.log(sql);

	xrxInventory_dbhelper.query(sql, function (errUpdate, record) {
            if ((!errUpdate) || typeof errUpdate == 'undefined') {
                    callback("Saved record successfully.", true);
                }
                else{
                    callback('Error: ' + errUpdate, false);//Error in sql
                }
    });
};

exports.xrxInventoryDeleteInvItemByPartNumber = function (partnumber, callback){

    var sqlCheck = " SELECT * FROM xrxSerializedInv WHERE PARTNUMBER = '"+ partnumber +"' ";
    xrxInventory_dbhelper.query(sqlCheck, function (errCheck, record) {

        if ((!errCheck) || typeof errCheck === 'undefined') {

            var i;
            if (record.length !== 0) {
                callback('Cannot delete item. Details: This item is currently being used in Serialized Inventory.', false);
                return;
            }
        }
        else {
            callback('Error: ' + errCheck, false);
            return;
        }
    });

	var sql = 	"DELETE FROM xrxSerializedItm WHERE RECNO = '"+ partnumber +"' ";
	xrxInventory_dbhelper.query(sql, function (errDelete, record) {
            if ((!errDelete) || typeof errDelete == 'undefined') {
                    callback("Deleted record successfully.", true);
                }
                else{
                    callback('Error: ' + errDelete, false);//Error in sql
                }
    });
};

//React
exports.xrxInventoryGetCount = function (sqlWhereClause, callback){
    var sql = "SELECT COUNT(*) AS COUNT FROM xrxSerializedInv " + sqlWhereClause;
    console.log(sql);
    xrxInventory_dbhelper.query(sql, function (err, record) {

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

exports.xrxInventoryGetRow = function (sqlWhereClause, rowStart, rowEnd, sortBy, sortType, callback){
    var sql =   "SELECT * FROM (SELECT ROW_NUMBER() OVER (ORDER BY "+ sortBy +" "+ sortType +" ) AS rownumber,*  FROM xrxSerializedInv "+ sqlWhereClause +") AS TEMP "+
                "WHERE rownumber >= '" + rowStart + "' AND rownumber <= '"+ rowEnd +"'";
    console.log(sql);
    xrxInventory_dbhelper.query(sql, function (err, record) {

        if ((!err) || typeof err === 'undefined') {
            if (record && record.length > 0) {

                var recordSimpleArray = [];

                    for(var i = 0; i < record.length; i++){

                    if (record[i].DESCRIPTION.value === null)
                        record[i].DESCRIPTION.value = '';

                    if (record[i].PARTNUMBER.value === null)
                        record[i].PARTNUMBER.value = '';

                    if (record[i].SERIALNUMBER.value === null)
                        record[i].SERIALNUMBER.value = '';

                    if (record[i].BLLPRVID.value === null)
                        record[i].BLLPRVID.value = '';

                    if (record[i].CPTCODE.value === null)
                        record[i].CPTCODE.value = '';

                    if (record[i].ORIGSERVICEDATE.value === null)
                        record[i].ORIGSERVICEDATE.value = '';

                    if (record[i].ACTIVE.value === null)
                        record[i].ACTIVE.value = '';

                    if (record[i].COST.value === null)
                        record[i].COST.value = '';

                    if (record[i].STATUS.value === null)
                        record[i].STATUS.value = '';

                    if (record[i].AMORTIZE.value === null)
                        record[i].AMORTIZE.value = '';

                    if (record[i].AMORTIZATIONPERIOD.value === null)
                        record[i].AMORTIZATIONPERIOD.value = '';

                    if (record[i].AMORTIZATIONENDDATE.value === null)
                        record[i].AMORTIZATIONPERIOD.value = '';

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

                    var recordSimple = convertToSimpleJson(record[i]);
                    recordSimpleArray.push(recordSimple);
                    }
                    console.log(recordSimpleArray);
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
                    RECNO:'', DESCRIPTION:'', PARTNUMBER:'', SERIALNUMBER:'', BLLPRVID:'', CPTCODE:'', ORIGSERVICEDATE:'',
                    ACTIVE:'', COST:'', STATUS:'', AMORTIZE:'', AMORTIZATIONPERIOD:'', AMORTIZATIONENDDATE:'',
                    CREATEDDATE:'', CREATEDBY:'', LASTMODIFIEDDATE:'', LASTMODIFIEDBY:'', DELETEDDATE:'', DELETEDBY:'', RMA:'', DCTID:'', FCLID:''
                };
    if(recordTedious){
        record.RECNO = recordTedious.RECNO.value;
        record.DESCRIPTION = recordTedious.DESCRIPTION.value;
        record.PARTNUMBER = recordTedious.PARTNUMBER.value;
        record.SERIALNUMBER = recordTedious.SERIALNUMBER.value;
        record.BLLPRVID = recordTedious.BLLPRVID.value;
        record.CPTCODE = recordTedious.CPTCODE.value;
        record.ORIGSERVICEDATE = formatDateTime(recordTedious.ORIGSERVICEDATE.value);
        record.ACTIVE = recordTedious.ACTIVE.value;
        record.COST = recordTedious.COST.value;
        record.STATUS = recordTedious.STATUS.value;
        record.AMORTIZE = recordTedious.AMORTIZE.value;
        record.AMORTIZATIONPERIOD = recordTedious.AMORTIZATIONPERIOD.value;
        record.AMORTIZATIONENDDATE = formatDateTime(recordTedious.AMORTIZATIONENDDATE.value);
        record.CREATEDDATE = formatDateTime(recordTedious.CREATEDDATE.value);
        record.CREATEDBY = recordTedious.CREATEDBY.value;
        record.LASTMODIFIEDDATE = formatDateTime(recordTedious.LASTMODIFIEDDATE.value);
        record.LASTMODIFIEDBY = recordTedious.LASTMODIFIEDBY.value;
        record.DELETEDDATE = formatDateTime(recordTedious.DELETEDDATE.value);
        record.DELETEDBY = recordTedious.DELETEDBY.value;
        record.RMA = recordTedious.RMA.value;
        record.DCTID = recordTedious.DCTID.value;
        record.FCLID = recordTedious.FCLID.value;
    }
    return record;
};
