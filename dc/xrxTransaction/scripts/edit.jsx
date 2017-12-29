var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var _xrxTrx_controller = require(appPath + "/dc/xrxTransaction/controllers/transactionController.js");
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

var _xrxTrxErrorMessages = {
  Required: 'Required',
  Invalid: 'Is Invalid',
  Internal: 'Internal error'
};

var _xrxTrxStatus = {
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
  sessionStorage.xrxTrx_ScrollToRow = row;
});

var TrxEditor = React.createClass ({
  getDefaultProps: function() {
        return {
          recno: "",
          data:   {
                    dctid: "", fclid: "", patid: "", invrecno:"", partno: "", desc: "", cpt: "", serialno: "",
                    status: _xrxTrxStatus.Available, transdate: moment(new Date()).format("YYYY-MM-DD"),
                    fromdate: moment(new Date()).format("YYYY-MM-DD"), todate: moment(new Date()).format("YYYY-MM-DD"), pickupdate: moment(new Date()).format("YYYY-MM-DD")
                  },
          errMsg: {
                    dctid: _xrxTrxErrorMessages.Required, fclid: _xrxTrxErrorMessages.Required, patid: _xrxTrxErrorMessages.Required, serialno: _xrxTrxErrorMessages.Required, transdate: _xrxTrxErrorMessages.Required, fromdate: "", todate: "", pickupdate: ""
                  },
          deleteButtonStyle:  {
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
        this.setState({deleteButtonStyle: {display: "block"}});
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
            _xrxTrx_controller.xrxTransactionGetTransByRecno(self.state.recno, function (err, record) {
              if(err){
                alert("Error loading information.");
              }
              else{
                console.log(record);
                if(record && record.length > 0){

                  self.state.data.dctid = record[0].DCTID.value;
                  self.state.data.fclid = record[0].FCLID.value;
                  self.state.data.patid = record[0].PATID.value;
                  self.state.data.partno = record[0].PARTNUMBER.value;
                  self.state.data.desc = record[0].DESCRIPTION.value;
                  self.state.data.cpt = record[0].CPTCODE.value;
                  self.state.data.serialno = record[0].SERIALNUMBER.value;
                  self.state.data.status = record[0].STATUS.value ? record[0].STATUS.value : _xrxTrxStatus.Available;
                  self.state.data.transdate = record[0].TRANSACTIONDATE.value ? moment(record[0].TRANSACTIONDATE.value).utcOffset(new Date().getTimezoneOffset()).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                  self.state.data.fromdate = record[0].FROMDATE.value ? moment(record[0].FROMDATE.value).utcOffset(new Date().getTimezoneOffset()).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                  self.state.data.todate = record[0].TODATE.value ? moment(record[0].TODATE.value).utcOffset(new Date().getTimezoneOffset()).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");
                  self.state.data.pickupdate = record[0].PICKUPDATE.value ? moment(record[0].PICKUPDATE.value).utcOffset(new Date().getTimezoneOffset()).format("YYYY-MM-DD") : moment(new Date()).format("YYYY-MM-DD");

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
      this.refs.inputTransactionDate.value = this.state.data.transdate;
      this.refs.inputFromDate.value = this.state.data.fromdate;
      this.refs.inputToDate.value = this.state.data.todate;
      this.refs.inputPickupDate.value = this.state.data.pickupdate;

      this._validate();
    },
    _collectData: function(){

      this.state.data.transdate = this.refs.inputTransactionDate.value ? (moment(this.refs.inputTransactionDate.value).isValid() ? moment(this.refs.inputTransactionDate.value).format("YYYY-MM-DD") : "") : "";
      this.state.data.fromdate = this.refs.inputFromDate.value ? (moment(this.refs.inputFromDate.value).isValid() ? moment(this.refs.inputFromDate.value).format("YYYY-MM-DD") : "") : "";
      this.state.data.todate = this.refs.inputToDate.value ? (moment(this.refs.inputToDate.value).isValid() ? moment(this.refs.inputToDate.value).format("YYYY-MM-DD") : "") : "";
      this.state.data.pickupdate = this.refs.inputPickupDate.value ? (moment(this.refs.inputPickupDate.value).isValid() ? moment(this.refs.inputPickupDate.value).format("YYYY-MM-DD") : "") : "";

      this.setState({data : this.state.data});
    },
    _updateDctId: function(selectedDctId, isValid){
      this.state.data.dctid = selectedDctId;
      if(!selectedDctId){
        this.state.errMsg.dctid = _xrxTrxErrorMessages.Required;
      }
      else if(!isValid){
        this.state.errMsg.dctid = _xrxTrxErrorMessages.Invalid;
      }
      else{
        this.state.errMsg.dctid = "";
      }
      this.setState({data : this.state.data, errMsg: this.state.errMsg});
    },
    _updateFclId: function(selectedFclId, isValid){
      this.state.data.fclid = selectedFclId;
      if(!isValid){
        this.state.errMsg.fclid = _xrxTrxErrorMessages.Invalid;
      }
      else{
        this.state.errMsg.fclid = "";
      }
      this.setState({data : this.state.data, errMsg: this.state.errMsg});
    },
    _updatePatId: function(selectedPattId, isValid){
      this.state.data.patid = selectedPattId;
      if(!isValid){
        this.state.errMsg.patid = _xrxTrxErrorMessages.Invalid;
      }
      else{
        this.state.errMsg.patid = "";
      }
      this.setState({data : this.state.data, errMsg: this.state.errMsg});
    },
    _updateInvData: function(selectedInvData, isValid){
      this.state.data.invrecno = selectedInvData.recno;
      this.state.data.partno = selectedInvData.partno;
      this.state.data.desc = selectedInvData.desc;
      this.state.data.cpt = selectedInvData.cpt;
      this.state.data.serialno = selectedInvData.serialno;

      if(!isValid){
        this.state.errMsg.serialno = _xrxTrxErrorMessages.Invalid;
      }
      else{
        this.state.errMsg.serialno = "";
      }
      this.setState({data : this.state.data, errMsg: this.state.errMsg});
    },
    _save: function(){
      var self = this;
      var recordnumber = this.state.recno;
      this._collectData();
      this._validate();

      console.log(this.state.errMsg);

      if(this.state.errMsg.dctid ||  this.state.errMsg.fclid || this.state.errMsg.patid || this.state.errMsg.serialno || this.state.errMsg.transdate
          || this.state.errMsg.fromdate || this.state.errMsg.todate || this.state.errMsg.pickupdate){
            bootbox.alert("Please fix the errors.", function () {
            });
      }
      else{

        var newCreatedDate = moment().format("YYYY-MM-DD");
        var newLastModifiedDate = moment().format("YYYY-MM-DD");
        var newLastModifiedBy = "Admin";
        var newActive = false;
        var newRental = false;
        if(this.state.data.status === "Rented")
            newRental = true;

        var record = { "recno": recordnumber, "invrecno": this.state.data.invrecno, "partnumber": this.state.data.partno, "description": this.state.data.desc, "cptcode": this.state.data.cpt, "serialnumber":this.state.data.serialno,
                        "status":this.state.data.status, "dctid": this.state.data.dctid, "fclid":this.state.data.fclid, "patid": this.state.data.patid, "transactiondate": this.state.data.transdate,
                        "fromdate": this.state.data.fromdate, "todate": this.state.data.todate, "pickupdate": this.state.data.pickupdate,
                        "createddate":newCreatedDate, "lastmodifieddate":newLastModifiedDate, "lastmodifiedby":newLastModifiedBy, "active":newActive, "rental": newRental };

         _xrxTrx_controller.xrxTransactionSaveTrx(record, function (message, success) {
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
    },
    _delete: function(){
      var self = this;
      var recordnumber = this.state.recno;
      if(recordnumber){
          bootbox.confirm("This transaction will be permanently deleted and cannot be recovered. Are you sure?", function (result) {
              if(result){
                  var deleteddate = moment().format("YYYY-MM-DD");
                  _xrxTrx_controller.xrxTransactionDeleteTrx(recordnumber, deleteddate, function (message, success) {
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
          });
      }
    },
    _setStatusType: function(type){
        this.state.data.status = type;
        this.refs.inputStatus.value = this.state.data.status;
        this.setState({data: this.state.data});
    },
    _validate: function(){
      if(!this.state.data.transdate)
        this.state.errMsg.transdate = _xrxTrxErrorMessages.Required;
      else
        this.state.errMsg.transdate = "";

      if(!this.state.data.fromdate && !moment(this.refs.inputFromDate.value).isValid())
        this.state.errMsg.fromdate = _xrxTrxErrorMessages.Invalid;
      else
        this.state.errMsg.fromdate = "";

      if(!this.state.data.todate && !moment(this.refs.inputToDate.value).isValid())
        this.state.errMsg.todate = _xrxTrxErrorMessages.Invalid;
      else
        this.state.errMsg.todate = "";

      if(!this.state.data.pickupdate && !moment(this.refs.inputPickupDate.value).isValid())
        this.state.errMsg.pickupdate = _xrxTrxErrorMessages.Invalid;
      else
        this.state.errMsg.pickupdate = "";

      this.setState({errMsg: this.state.errMsg});
    },
    _updateData: function(){
      this._collectData();
      this._validate();
    },
    _close: function(){

        window.close();
    },
    render: function(){

      var invObject = { recno:'', partno: this.state.data.partno, desc:'', cpt:'', serialno:this.state.data.serialno}

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
                          <DctSearch isRequired={true} dctId={this.state.data.dctid} onSelect={this._updateDctId}></DctSearch>
                        </div>
                        <div className="col-xs-6">
                          <span id="errDct" className="text-danger">{this.state.errMsg.dctid}</span>
                        </div>
                    </div>
                    <div  className="row form-group">
                        <label className="col-xs-4 control-label"><span className="text-danger">*</span>Facility:</label>
                        <div className="col-xs-14">
                          <FclSearch isRequired={true} fclId={this.state.data.fclid} onSelect={this._updateFclId}></FclSearch>
                        </div>
                        <div className="col-xs-6">
                          <span id="errFcl" className="text-danger">{this.state.errMsg.fclid}</span>
                        </div>
                    </div>
                    <div  className="row form-group">
                        <label className="col-xs-4 control-label"><span className="text-danger">*</span>Patient:</label>
                        <div className="col-xs-14">
                          <PtSearch width="100px" infoWidth="205px" isRequired={true} patId={this.state.data.patid} onSelect={this._updatePatId}></PtSearch>
                        </div>
                        <div className="col-xs-6">
                          <span id="errFcl" className="text-danger">{this.state.errMsg.patid}</span>
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
                      <div  className="row form-group">
                        <label className="col-xs-4 control-label"><span className="text-danger">*</span>Search Serial#:</label>
                        <div className="col-xs-14">
                          <InvSearch isRequired={true} invData={invObject} onSelect={this._updateInvData}></InvSearch>
                        </div>
                        <div className="col-xs-6">
                          <span id="errFcl" className="text-danger">{this.state.errMsg.serialno}</span>
                        </div>
                      </div>

                      <div  className="row form-group">
                        <label className="col-xs-4 control-label"><span className="text-danger">*</span>Description:</label>
                        <div className="col-xs-10">
                          <input type="text" className="form-control input-sm" value={this.state.data.desc} disabled></input>
                        </div>
                        <div className="col-xs-10">
                        </div>
                      </div>

                      <div  className="row form-group">
                        <label className="col-xs-4 control-label"><span className="text-danger">*</span>Part Number:</label>
                        <div className="col-xs-10">
                          <input type="text" className="form-control input-sm" value={this.state.data.partno} disabled></input>
                        </div>
                        <div className="col-xs-10">
                        </div>
                      </div>

                      <div  className="row form-group">
                        <label className="col-xs-4 control-label"><span className="text-danger">*</span>Cpt:</label>
                        <div className="col-xs-10">
                          <input type="text" className="form-control input-sm" value={this.state.data.cpt} disabled></input>
                        </div>
                        <div className="col-xs-10">
                        </div>
                      </div>

                      <div  className="row form-group" id="divTransactionDate">
                          <label className="col-xs-4 control-label"><span className="text-danger">*</span>Transaction Date:</label>
                          <div className="col-xs-10">
                              <input id="inputTransactionDate" ref="inputTransactionDate" type="date" className="form-control input-sm" onBlur={this._updateData} required></input>
                          </div>
                          <div className="help-block with-errors col-xs-5">
                              <span id="errTransactionDate" className="text-danger">{this.state.errMsg.transdate}</span>
                          </div>
                      </div>

                      <div  className="row form-group" id="divStatus">
                          <label className="col-xs-4 control-label"><span className="text-danger">*</span>Status:</label>
                          <div className="col-xs-10">
                              <div className="input-group">
                                  <input id="inputStatus" ref="inputStatus" type="text" className="form-control input-sm" defaultValue={this.state.data.status}></input>
                                  <div className="input-group-btn dropup">
                                      <a className="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown">
                                        <span className="glyphicon glyphicon-cog"> </span> <span className="caret"> </span>
                                      </a>
                                      <ul className="dropdown-menu pull-right">
                                          <li><a onClick={this._setStatusType.bind(this, _xrxTrxStatus.Available)}>Available</a></li>
                                          <li><a onClick={this._setStatusType.bind(this, _xrxTrxStatus.Rented)}>Rented</a></li>
                                          <li><a onClick={this._setStatusType.bind(this, _xrxTrxStatus.Transit)}>Transit</a></li>
                                          <li><a onClick={this._setStatusType.bind(this, _xrxTrxStatus.PTDirectInv)}>PT Direct Inv</a></li>
                                          <li><a onClick={this._setStatusType.bind(this, _xrxTrxStatus.Repair)}>Repair</a></li>
                                          <li><a onClick={this._setStatusType.bind(this, _xrxTrxStatus.Disposed)}>Disposed</a></li>
                                      </ul>
                                  </div>
                              </div>
                          </div>
                          <div className="help-block with-errors col-xs-5">
                              <span id="errStatus" className="text-danger"></span>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="panel panel-primary row form-group col-xs-24">
                  <div className="panel-heading">
                      <h3 className="panel-title">
                        <strong>Transaction Information</strong>
                      </h3>
                  </div>

                  <div className="panel-body">
                      <div  className="row form-group" id="divFromDate">
                          <label className="col-xs-4 control-label">From Date:</label>
                          <div className="col-xs-10">
                              <input id="inputFromDate" ref="inputFromDate" type="date" className="form-control input-sm" onBlur={this._updateData}></input>
                          </div>
                          <div className="help-block with-errors col-xs-5">
                              <span id="errFromDate" className="text-danger">{this.state.errMsg.fromdate}</span>
                          </div>
                      </div>

                      <div className="row form-group" id="divToDate">
                          <label className="col-xs-4 control-label">To Date:</label>
                          <div className="col-xs-10">
                              <input id="inputToDate" ref="inputToDate" type="date" className="form-control input-sm" onBlur={this._updateData}></input>
                          </div>
                          <div className="help-block with-errors col-xs-5">
                              <span id="errToDate" className="text-danger">{this.state.errMsg.todate}</span>
                          </div>
                      </div>

                      <div className="row form-group" id="divPickupDate">
                          <label className="col-xs-4 control-label">Pickup Date:</label>
                          <div className="col-xs-10">
                              <input id="inputPickupDate" ref="inputPickupDate" type="date" className="form-control input-sm" onBlur={this._updateData}></input>
                          </div>
                          <div className="help-block with-errors col-xs-5">
                              <span id="errPickupDate" className="text-danger">{this.state.errMsg.pickupdate}</span>
                          </div>
                      </div>
                  </div>
              </div>



            </div>
        );
    }
});

var loadEditor = function(){
  ReactDOM.render(<TrxEditor recno={recno}/>, document.getElementById('divEditor'));
};

loadEditor();
