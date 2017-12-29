var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var _xrxInv_controller = require(appPath + "/dc/xrxInventory/controllers/inventoryController.js");
var _xrxTrx_controller = require(appPath + "/dc/xrxInventory/xrxTransaction/controllers/transactionController.js");
//Other
var ipcRenderer = require('electron').ipcRenderer;
var cmGlb = remote.getGlobal('cmGlb');
var moment = require(nodeModulesPath + 'moment');
var bootbox = require(nodeModulesPath + 'bootbox');

var recno = "";
var row = null;

function extractGetParameterValue(key) {
    return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
};

function checkSqlEscapeCharater(sqlValue) {
    var escapeSqlValue = "";
    if(sqlValue){
        escapeSqlValue = sqlValue.replace(new RegExp("'", 'g'), "''");
    }
    return escapeSqlValue;
};

var _xrxInvErrorMessages = {
  Required: 'Required',
  Invalid: 'Is Invalid',
  Internal: 'Internal error',
  Exists: 'Already exists'
};

var _xrxInvStatus = {
  Available: 'Available',
  Rented: 'Rented',
  Transit: 'Transit',
  PTDirectInv: 'PT Direct Inv',
  Repair: 'Repair',
  Disposed: 'Disposed'
};

$(document).ready(function () {

    recno = extractGetParameterValue("recno");
    row = extractGetParameterValue("row");
    sessionStorage.xrxInv_ScrollToRow = row;
});

var InvEditor = React.createClass ({
	getDefaultProps: function() {
        return {
        	recno: "",
            data: 	{	dctId: "", fclId: "", partno: "", desc: "", cpt: "", serialno: "",
            			cost: 1, origservdate: moment(new Date()).format("YYYY-MM-DD"), status: _xrxInvStatus.Available, rma: "",
                        amortize: true, amortizePeriod: 0, amortizationEndDate : ""
            		},
            errMsg: {	dctId: _xrxInvErrorMessages.Required, fclId: "", partno: _xrxInvErrorMessages.Required, desc: _xrxInvErrorMessages.Required, cpt: _xrxInvErrorMessages.Required,
                        serialno: _xrxInvErrorMessages.Required, cost: _xrxInvErrorMessages.Required, origservdate: ""
                    },
            deleteButtonStyle: 	{
                        			display: "none"
                    	   		}
        };
    },
    getInitialState : function(){
        return {
        	recno: this.props.recno,
            data: this.props.data,
            errMsg: this.props.errMsg,
            deleteButtonStyle: this.props.deleteButtonStyle,
            parentWindowID : null,
            isComponent : false
        };
    },
    componentWillMount: function(){
    	if(this.state.recno)
    		this.setState({deleteButtonStyle: {display: "solid"}});
    },
    componentDidMount: function(){
      $(document.body).on('keydown', this._keyDown);
      var self = this;
      ipcRenderer.on('get-data', function (event, parentWindowID, data){
          if(data.recNo){
            self.state.recno = data.recNo;
            self.setState({parentWindowID : parentWindowID, recno: self.state.recno, deleteButtonStyle: {display: "block"}});
          }
          else{
            self.setState({parentWindowID : parentWindowID});
          }

        	if(self.state.recno){
        		_xrxInv_controller.xrxInventoryGetInvByRecno(self.state.recno, function (err, record) {
        			if(err){
        				alert("Error loading information.");
        			}
        			else{
        				if(record && record.length > 0){

        					self.state.data.dctId = record[0].DCTID.value;
        					self.state.data.fclId = record[0].FCLID.value;
        					self.state.data.partno = record[0].PARTNUMBER.value;
        					self.state.data.desc = record[0].DESCRIPTION.value;
        					self.state.data.cpt = record[0].CPTCODE.value;
        					self.state.data.serialno = record[0].SERIALNUMBER.value;
                  self.state.data.cost = record[0].COST.value;
                  self.state.data.origservdate = record[0].ORIGSERVICEDATE.value ? moment(record[0].ORIGSERVICEDATE.value).utcOffset(new Date().getTimezoneOffset()).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                  self.state.data.status = record[0].STATUS.value ? record[0].STATUS.value: _xrxInvStatus.Available;
                  self.state.data.rma = record[0].RMA.value;
                  self.state.data.amortize = record[0].AMORTIZE.value;
                  self.state.data.amortizePeriod = record[0].AMORTIZATIONPERIOD.value;
                  self.state.data.amortizationEndDate = record[0].AMORTIZATIONENDDATE.value;

        					self.setState({data : self.state.data});
                  self._loadData();
        				}
        			}
        		});
        	}
          else{
              self._loadData();
          }
      });
    },
    _loadData: function(){
    	this.refs.inputPartNumber.value = this.state.data.partno;
    	this.refs.inputDescription.value = this.state.data.desc;
    	this.refs.inputCptCode.value = this.state.data.cpt;
    	this.refs.inputSerialNo.value = this.state.data.serialno;
      this.refs.inputCost.value = this.state.data.cost;
      this.refs.inputOrigServiceDate.value = this.state.data.origservdate;
      this.refs.inputStatus.value = this.state.data.status;
      this.refs.inputRMA.value = this.state.data.rma;
      this.refs.inputAmortize.checked = this.state.data.amortize;
      this.refs.inputAmortizationPeriod.value = this.state.data.amortizePeriod;
      this.refs.inputAmortizeEndDate.value = this.state.data.amortizationEndDate;

      this._calcAmortizeDate();
    	this._validate(true);
    },
    _collectData: function(){
    	//dctId
    	//fclId

    	this.state.data.partno = checkSqlEscapeCharater(this.refs.inputPartNumber.value);
    	this.state.data.desc = checkSqlEscapeCharater(this.refs.inputDescription.value);
    	this.state.data.cpt = checkSqlEscapeCharater(this.refs.inputCptCode.value);
    	this.state.data.serialno = checkSqlEscapeCharater(this.refs.inputSerialNo.value);
      this.state.data.cost = this.refs.inputCost.value;
      this.state.data.origservdate = moment(this.refs.inputOrigServiceDate.value).isValid() ? moment(this.refs.inputOrigServiceDate.value).format("YYYY-MM-DD") : "";
      this.state.data.status = this.refs.inputStatus.value;
      this.state.data.rma = checkSqlEscapeCharater(this.refs.inputRMA.value);

      this.state.data.amortize = this.refs.inputAmortize.checked;
      this.state.data.amortizePeriod = this.refs.inputAmortizationPeriod.value;
      this.state.data.amortizationEndDate = this.refs.inputAmortizeEndDate.value ? moment(this.refs.inputAmortizeEndDate.value).format("YYYY-MM-DD") : "";

    	this.setState({data : this.state.data});
    },
    _updateDctId: function(selectedDctId, isValid){
    	this.state.data.dctId = selectedDctId;
    	if(!selectedDctId){
    		this.state.errMsg.dctId = _xrxInvErrorMessages.Required;
    	}
    	else if(!isValid){
    		this.state.errMsg.dctId = _xrxInvErrorMessages.Invalid;
    	}
    	else{
    		this.state.errMsg.dctId = "";
    	}
    	this.setState({data : this.state.data, errMsg: this.state.errMsg});
    },
    _updateFclId: function(selectedFclId, isValid){
    	this.state.data.fclId = selectedFclId;
    	if(!isValid){
    		this.state.errMsg.fclId = _xrxInvErrorMessages.Invalid;
    	}
    	else{
    		this.state.errMsg.fclId = "";
    	}
    	this.setState({data : this.state.data, errMsg: this.state.errMsg});
    },
    _save: function(){
      var self = this;
    	this._collectData();
    	this._validate(false);

    	if(this.state.errMsg.dctId ||  this.state.errMsg.fclId || this.state.errMsg.partno || this.state.errMsg.desc || this.state.errMsg.cpt
            || this.state.errMsg.serialno || this.state.errMsg.cost || this.state.errMsg.origservdate){
    		bootbox.alert("Please fix the errors.", function () {
            });
    	}
    	else{
    		//alert("Save data");
            var newCreatedDate = moment().format("YYYY-MM-DD");
            var newLastModifiedDate = moment().format("YYYY-MM-DD");
            var newLastModifiedBy = "Admin";
            var newActive = false;

            var recordInv = { "recno": this.state.recno, "partnumber": this.state.data.partno, "description": this.state.data.desc, "cptcode": this.state.data.cpt, "serialnumber":this.state.data.serialno,
                            "status":this.state.data.status, "cost":this.state.data.cost, "origservicedate":this.state.data.origservdate,  "rma":this.state.data.rma, "dctid": this.state.data.dctId, "fclid":this.state.data.fclId,
                            "amortize":this.state.data.amortize, "amortizePeriod":this.state.data.amortizePeriod, "amortizationenddate": this.state.data.amortizationEndDate,
                            "createddate":newCreatedDate, "lastmodifiedDate":newLastModifiedDate, "lastmodifiedby":newLastModifiedBy, "active":newActive  };

            _xrxInv_controller.xrxInventoryGetInvBySerialnumber(recordInv.recno, this.state.data.serialno, function (err_message, record) {
                if (err_message != null) {
                    bootbox.alert(err_message, function () {
                    });
                }
                else {
                    if(record.length >  0){
                        bootbox.alert("Please fix the errors", function () {
                        });
                    }
                    else if(record.length === 0){
                        _xrxInv_controller.xrxInventorySaveInv(recordInv, function (message, success) {
                            if (success) {
                              var parentWindowID = self.state.parentWindowID
                              if(parentWindowID){
                                console.log(parentWindowID)
                                const BrowserWindow = require('electron').remote.BrowserWindow;
                                const fromWindow = BrowserWindow.fromId(parentWindowID);
                                fromWindow.webContents.send('refresh-data');
                              }
                                window.close();
                            }
                            else {
                                bootbox.alert(message, function () {
                                });
                            }
                        });
                    }
                }
            });
    	}
    },
    _delete: function(){
        var self = this;
        var recordnumber = this.state.recno;
        if(recordnumber){
            bootbox.confirm("Confirm delete?", function (result) {
                if(result){
                    _xrxTrx_controller.xrxTransactionGetTrxByInvRecNo(recordnumber, function(err_message, record) {
                        if (err_message != null) {
                            alert(err_message);
                        }
                        else{
                            if(record.length > 0){
                                bootbox.alert("Cannot delete this inventory since it is active in atleast one transaction record.", function () {
                                });
                            }
                            else if(record.length === 0){
                                var deleteddate = moment().format("YYYY-MM-DD");
                                _xrxInv_controller.xrxInventoryDeleteInv(recordnumber, deleteddate, function (message, success) {
                                    if (success) {
                                      var parentWindowID = self.state.parentWindowID
                                      if(parentWindowID){
                                        console.log(parentWindowID)
                                        const BrowserWindow = require('electron').remote.BrowserWindow;
                                        const fromWindow = BrowserWindow.fromId(parentWindowID);
                                        fromWindow.webContents.send('refresh-data');
                                      }
                                        window.close();
                                    }
                                    else {
                                        bootbox.alert(message, function () {
                                        });
                                    }
                                });//End delete
                            }
                        }
                    });//Trx check
                }
            });//confirm box
        }
    },
    _setStatusType: function(type){
        this.state.data.status = type;
        this.refs.inputStatus.value = this.state.data.status;
        this.setState({data: this.state.data});
    },
    _changeAmortize: function(){
        this.state.data.amortize = !this.state.data.amortize;
        this.refs.inputAmortize.checked = this.state.data.amortize;
        this.setState({data: this.state.data});
    },
    _calcAmortizeDate: function(){
        var amortizationPeriod = this.refs.inputAmortizationPeriod.value;
        if(amortizationPeriod){

            if(amortizationPeriod == 0){
                this.state.data.amortizationEndDate = "";
            }
            else{
                var origServiceDate = this.refs.inputOrigServiceDate.value;
                if(moment(this.refs.inputOrigServiceDate.value).isValid()){
                    this.state.data.amortizationEndDate = moment(origServiceDate).add(amortizationPeriod, 'months').format("YYYY-MM-DD");
                }
                else{
                    this.state.data.amortizationEndDate = "";
                }
            }
            this.setState({data: this.state.data});
        }
    },
    _validate: function(checkSerialNo){
    	if(!this.state.data.partno)
    		this.state.errMsg.partno = _xrxInvErrorMessages.Required;
    	else
    		this.state.errMsg.partno = "";

    	if(!this.state.data.desc)
    		this.state.errMsg.desc = _xrxInvErrorMessages.Required;
    	else
    		this.state.errMsg.desc = "";

    	if(!this.state.data.cpt)
    		this.state.errMsg.cpt = _xrxInvErrorMessages.Required;
    	else
    		this.state.errMsg.cpt = "";

        if(!this.state.data.cost)
            this.state.errMsg.cost = _xrxInvErrorMessages.Required;
        else if(this.state.data.cost == 0)
            this.state.errMsg.cost = _xrxInvErrorMessages.Invalid;
        else
            this.state.errMsg.cost = "";

        if(!this.state.data.origservdate)
            this.state.errMsg.origservdate = _xrxInvErrorMessages.Required;
        else
            this.state.errMsg.origservdate = "";

    	if(!this.state.data.serialno){
            this.state.errMsg.serialno = _xrxInvErrorMessages.Required;
            this.setState({errMsg: this.state.errMsg});
        }
    	else if(checkSerialNo){
    		var self = this;
    		_xrxInv_controller.xrxInventoryGetInvBySerialnumber(self.state.recno, checkSqlEscapeCharater(self.state.data.serialno), function (err, record) {
    			if(err){
                    console.log(err);
    				self.state.errMsg.serialno = err;
    			}
    			else{
    				if(record && record.length > 0){
                        self.state.errMsg.serialno = _xrxInvErrorMessages.Exists;
    				}
                    else{
                        self.state.errMsg.serialno = "";
                    }
    			}
                self.setState({errMsg: self.state.errMsg});
    		});
    	}
        else if(this.state.errMsg.serialno === _xrxInvErrorMessages.Exists){
            this.setState({errMsg: this.state.errMsg});
        }
    	else{
    		this.state.errMsg.serialno = "";
    		this.setState({errMsg: this.state.errMsg});
    	}
    },
    _updateData: function(checkSerialNo){
    	this._collectData();
    	this._validate(checkSerialNo);
    },
    _close: function(){

        window.close();
    },
    render: function(){



        return(
        		<div className="formcontainer">
        			<div className="row form-group col-xs-24 btn-group" >
				        <button type="button" id="btnsave" className="btn btn-success btn-sm" onClick={this._save.bind(this, null)}>
				          <span className="fa fa-floppy-o" ></span>Save</button>
				        <button type="button" id="btnDelete" className="btn btn-danger btn-sm" onClick={this._delete.bind(this, null)}
				          style={this.state.deleteButtonStyle} >
				          <span className="fa fa-minus-circle" ></span>Delete</button>
                <button onClick={this._close} className="btn btn-warning btn-sm"><i className="fa fa-times"></i> Close</button>
			         </div>

                	<div className="panel panel-primary row form-group col-xs-24">
				        <div className="panel-heading">
			              	<h3 className="panel-title">
		                      	<strong>Assigned To</strong>
			              	</h3>
				        </div>
			          	<div className="panel-body">
			            	<div  className="row form-group"  id="divDoctor">
			              		<label className="col-xs-4 control-label"><span className="text-danger">*</span>Doctor:</label>
			              		<div className="col-xs-14">
			                		<DctSearch isRequired={true} dctId={this.state.data.dctId} onSelect={this._updateDctId}></DctSearch>
			              		</div>
			              		<div className="col-xs-6">
			                		<span id="errDct" className="text-danger">{this.state.errMsg.dctId}</span>
			              		</div>
			            	</div>

			            	<div  className="row form-group">
			              		<label className="col-xs-4 control-label">Facility:</label>
			              		<div className="col-xs-14">
			                		<FclSearch isRequired={false} fclId={this.state.data.fclId} onSelect={this._updateFclId}></FclSearch>
			              		</div>
			              		<div className="col-xs-6">
			                		<span id="errFcl" className="text-danger">{this.state.errMsg.fclId}</span>
			              		</div>
			            	</div>
			          	</div>
			      	</div>

	      	      	<div className="panel panel-primary row form-group col-xs-24">
			          	<div className="panel-heading">
			              	<h3 className="panel-title">
			                	<strong>Inventory Item</strong>
			              	</h3>
			          	</div>

		          		<div className="panel-body">
			            	<div  className="row form-group" id="divPartNumber">
				              		<label className="col-xs-4 control-label"><span className="text-danger">*</span>Part Number:</label>
				              	<div className="col-xs-10">
				                	<input id="inputPartNumber" ref="inputPartNumber" type="text" maxLength="50" className="form-control input-sm" onBlur={this._updateData.bind(this, false)}></input>
				              	</div>
				              	<div className="help-block with-errors col-xs-10">
				                	<span id="errPartNumber" className="text-danger">{this.state.errMsg.partno}</span>
				              	</div>
				            </div>

				            <div  className="row form-group" id="divDescription">
				              	<label className="col-xs-4 control-label"><span className="text-danger">*</span>Description:</label>
				              	<div className="col-xs-10">
				                	<input id="inputDescription" ref="inputDescription" type="text" maxLength="200" className="form-control input-sm" onBlur={this._updateData.bind(this, false)}></input>
				              	</div>
				              	<div className="help-block with-errors col-xs-10">
				                	<span id="errDescription" className="text-danger">{this.state.errMsg.desc}</span>
				              	</div>
				            </div>

				            <div  className="row form-group" id="divCptCode">
				              	<label className="col-xs-4 control-label"><span className="text-danger">*</span>Cpt Code:</label>
				              	<div className="col-xs-10">
				                	<input id="inputCptCode" ref="inputCptCode" type="text" maxLength="20" className="form-control input-sm" onBlur={this._updateData.bind(this, false)}></input>
				              	</div>
				              	<div className="help-block with-errors col-xs-10">
				                	<span id="errCptCode" className="text-danger">{this.state.errMsg.cpt}</span>
				              	</div>
				            </div>

				            <div  className="row form-group" id="divSerialNo">
				              	<label className="col-xs-4 control-label"><span className="text-danger">*</span>Serial Number:</label>
				              	<div className="col-xs-10">
				                	<input id="inputSerialNo" ref="inputSerialNo" type="text" maxLength="50" className="form-control input-sm" onBlur={this._updateData.bind(this, true)}></input>
				              	</div>
				              	<div className="help-block with-errors col-xs-10">
				                	<span id="errSerialNo" className="text-danger">{this.state.errMsg.serialno}</span>
				              	</div>
				            </div>

                            <div  className="row form-group" id="divCost">
                                <label className="col-xs-4 control-label"><span className="text-danger">*</span>Cost:</label>
                                <div className="col-xs-10">
                                    <input id="inputCost" ref="inputCost" type="number" maxLength="11" className="form-control input-sm" onBlur={this._updateData.bind(this, false)}
                                    min="1" step="0.0001"></input>
                                </div>
                                <div className="help-block with-errors col-xs-10">
                                    <span id="errCost" className="text-danger">{this.state.errMsg.cost}</span>
                                </div>
                            </div>

                            <div  className="row form-group" id="divOrigServiceDate">
                                <label className="col-xs-4 control-label"><span className="text-danger">*</span>Orig. Serv Date:</label>
                                <div className="col-xs-10">
                                    <input id="inputOrigServiceDate" ref="inputOrigServiceDate" type="date" className="form-control input-sm"
                                    onChange={this._calcAmortizeDate} onBlur={this._updateData.bind(this, false)} required></input>
                                </div>
                                <div className="help-block with-errors col-xs-10">
                                    <span id="errOrigServiceDate" className="text-danger">{this.state.errMsg.origservdate}</span>
                                </div>
                            </div>

                            <div  className="row form-group" id="divStatus">
                                <label className="col-xs-4 control-label"><span className="text-danger">*</span>Status:</label>
                                <div className="col-xs-10">
                                    <div className="input-group">
                                        <input id="inputStatus" ref="inputStatus" type="text" className="form-control input-sm" defaultValue={this.state.data.status} readOnly></input>
                                        <div className="input-group-btn dropup">
                                            <a className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
                                              <span className="glyphicon glyphicon-cog"> </span> <span className="caret"> </span>
                                            </a>
                                            <ul className="dropdown-menu pull-right">
                                                <li><a onClick={this._setStatusType.bind(this, _xrxInvStatus.Available)}>Available</a></li>
                                                <li><a onClick={this._setStatusType.bind(this, _xrxInvStatus.Rented)}>Rented</a></li>
                                                <li><a onClick={this._setStatusType.bind(this, _xrxInvStatus.Transit)}>Transit</a></li>
                                                <li><a onClick={this._setStatusType.bind(this, _xrxInvStatus.PTDirectInv)}>PT Direct Inv</a></li>
                                                <li><a onClick={this._setStatusType.bind(this, _xrxInvStatus.Repair)}>Repair</a></li>
                                                <li><a onClick={this._setStatusType.bind(this, _xrxInvStatus.Disposed)}>Disposed</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="help-block with-errors col-xs-10">
                                    <span id="errStatus" className="text-danger">{this.state.errMsg.status}</span>
                                </div>
                            </div>

                            <div  className="row form-group" id="divRMA">
                                <label className="col-xs-4 control-label">RMA:</label>
                                <div className="col-xs-10">
                                    <input id="inputRMA" ref="inputRMA" type="text" maxLength="50" className="form-control input-sm" onBlur={this._updateData.bind(this, false)}></input>
                                </div>
                                <div className="help-block with-errors col-xs-10">
                                    <span id="errRMA" className="text-danger"></span>
                                </div>
                            </div>

			          	</div>
				   	</div>

                    <div className="panel panel-primary row form-group col-xs-24">
                        <div className="panel-heading">
                            <h3 className="panel-title">
                                <strong>Amortization</strong>
                            </h3>
                        </div>
                        <div className="panel-body">
                            <div  className="row form-group" id="divAmortize">
                                <label className="col-xs-4 control-label">Amortize:</label>
                                <div className="col-xs-10">
                                    <input id="inputAmortize" ref="inputAmortize" type="checkbox" onChange={this._changeAmortize}></input>
                                </div>
                                <div className="help-block with-errors col-xs-10">
                                    <span id="errAmortize" className="text-danger"></span>
                                </div>
                            </div>

                            <div  className="row form-group">
                                <label className="col-xs-4 control-label">Amortization Period (months):</label>
                                <div className="col-xs-10">
                                    <input id="inputAmortizationPeriod" ref="inputAmortizationPeriod" type="number" maxLength="11" className="form-control input-sm" min="0" onChange={this._calcAmortizeDate}></input>
                                </div>
                                <div className="help-block with-errors col-xs-10">
                                    <span id="errAmortizationPeriod" className="text-danger"></span>
                                </div>
                            </div>

                            <div  className="row form-group">
                                <label className="col-xs-4 control-label">Amortization End Date:</label>
                                <div className="col-xs-10">
                                    <input id="inputAmortizeEndDate" ref="inputAmortizeEndDate" type="date" className="form-control input-sm" disabled value={this.state.data.amortizationEndDate}></input>
                                </div>
                                <div className="col-xs-10">
                                    <span id="errAmortizeEndDate" className="text-danger"></span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
        );
    }
});

var loadEditor = function(){
	ReactDOM.render(<InvEditor recno={recno}/>, document.getElementById('divEditor'));
};

loadEditor();
