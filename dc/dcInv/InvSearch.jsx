var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var _xrxInv_SqlController = require(appPath + "/dc/dcInv/controller.js");
var moment = require(nodeModulesPath + 'moment');
//React
var React = require(nodeModulesPath + 'react');
var ReactDOM = require(nodeModulesPath + "react-dom");
//FixedDataTable
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

var _invSearchTypes = {
  PARTNUMBER: 'PARTNUMBER',
  DESCRIPTION: 'DESCRIPTION',
  SERIALNUMBER: 'SERIALNUMBER'
};

var _invData = { recno:'', partno:'', desc:'', cpt:'', serialno:''};

var InvSearch = React.createClass ({
	getDefaultProps: function() {
        return {
            invData: _invData,
            isRequired: false,
            isValid: true,
            isLoading: false,
            inputBoxStyle: {
                        	fontSize: "x-small"
                    	   }
        };
    },
    getInitialState : function(){
        return {
            invData: this.props.invData,
            isRequired: this.props.isRequired,
            searchType: _invSearchTypes.SERIALNUMBER,
            results: [],
            selectedInfo: "",
            isValid: this.props.isValid,
            isLoading: this.props.isLoading
        };
    },
    componentWillMount: function(){
    },
    componentDidMount: function(){
    	this._loadData();
    },
    _loadData: function(){
        if(this.state.invData.serialno){

            var self = this;
            _xrxInv_SqlController.xrxInvSearch_GetBySerialNo(this.state.invData.serialno, function (err, record) {
                if(err){
                    alert("Error loading information.");
                }
                else{
                    if(record && record.length > 0){
                        self._setSelectedRecord(record[0]);
                    }
                    else{
                        self.props.onSelect(_invData, self.state.isValid);
                        self.setState({invData: _invData});
                    }
                }
            });

            var $inputBox = $(this.refs.xrxInvSrch_SearchInput);
            $inputBox.val(this.props.invData.serialno);
        }
    },
	_setSearchType: function(type) {
        var $inputBox = $(this.refs.xrxInvSrch_SearchInput);
        $inputBox.val("");
        $inputBox.focus();
        this.props.onSelect(_invData, this.state.isValid);
		this.setState({invData: _invData, searchType: type, selectedInfo: ""});
    },
    _onKeyDown: function(event){
    	var key = event.which;

       if(key == '13' || key == '9' || key == '113'){
       		this._search();
       }
    },
    _search: function(){

    	var $inputBox = $(this.refs.xrxInvSrch_SearchInput);
    	var searchText = $inputBox.val();

    	if(searchText){
    		var self = this;
    		this._changeLoadingSign(true);
            _xrxInv_SqlController.xrxInvSearch_GetList(searchText, this.state.searchType, function (err, record) {
                self._changeLoadingSign(false);
                if(err){
                    alert("Error loading the search list.");
                }
                else{
                    if(record && record.length > 0){
                        self._showResultModal(record);
                    }
                    else{
                        alert("There are no results for this search criteria.");
                    }
                }
            });
    	}
    },
    _changeLoadingSign: function(show){
    	if(show)
    		this.setState({selectedInfo: "Loading..."});
    	else
    		this.setState({selectedInfo: ""});
    },
    _onTextChange: function(){
    	var $inputBox = $(this.refs.xrxInvSrch_SearchInput);
	    var searchText = $inputBox.val();

        if(!searchText){
            this.props.onSelect(_invData, true);
            this.setState({invData: _invData, selectedInfo: "", isValid: true});
        }
	    else if(this.state.invData.serialno !== searchText){
	    	this.props.onSelect(_invData, false);
	    	this.setState({isValid: false});
	    }
    	else{
            this.props.onSelect(this.state.invData, true);
    		this.setState({isValid: true});
    	}
    },
    _showResultModal: function(recordList){
    	var $mdSearchResult = $(this.refs.mdSearchList);
    	$mdSearchResult.modal('show');
    	this.setState({results: recordList});
    },
    _setSelectedRecord: function(record){
    	var $mdSearchResult = $(this.refs.mdSearchList);
    	$mdSearchResult.modal('hide');

        var selectedInvData = _invData;
        selectedInvData.recno = record.RECNO;
        selectedInvData.partno = record.PARTNUMBER;
        selectedInvData.desc = record.DESCRIPTION;
        selectedInvData.cpt = record.CPTCODE;
        selectedInvData.serialno = record.SERIALNUMBER;

    	this.refs.xrxInvSrch_SearchInput.value = record.SERIALNUMBER;

    	this.props.onSelect(selectedInvData, true);


    	var selectedInfo = "Part#:"+record.PARTNUMBER + " (" + record.DESCRIPTION + ")";
    	this.setState({invData: selectedInvData, selectedInfo: selectedInfo, isValid: true});
    },
    componentWillReceiveProps: function(nextProps) {
        if(nextProps.invData && (this.props.invData.serialno !== nextProps.invData.serialno)){
            this.props.invData.serialno = nextProps.invData.serialno;
            this.state.invData.serialno = nextProps.invData.serialno;
            this._loadData();
        }
    },
    render: function(){

    	var hasErrorClass = "";
    	if((!this.state.isValid) || (this.state.isRequired && !this.state.invData.serialno))
    		hasErrorClass = "form-group has-error";

     	return(
     			<div>
	     			<div className={hasErrorClass}>
		                <div className="row">
		                	<div className="col-xs-10">
		                        <div className="input-group">
		                      		<input id="xrxInvSrch_SearchInput" ref="xrxInvSrch_SearchInput" className="form-control"
		                      			placeholder={this.state.searchType} style={this.props.inputBoxStyle}
		                      			onChange={this._onTextChange} onKeyDown={this._onKeyDown}>
		                      		</input>
		                      		<div className="input-group-btn">
									    <a className="btn btn-default" type="button" onClick={this._search}><span className="glyphicon glyphicon-search"></span>:</a>
									</div>
				                    <div className="input-group-btn">
	                                  	<a className="btn btn-default dropdown-toggle" data-toggle="dropdown">
	                                      <span className="glyphicon glyphicon-cog"> </span> <span className="caret"> </span>
	                                  	</a>
	                                  	<ul className="dropdown-menu pull-right">
	                                  		<li><a>Search by:</a></li>
	                                  		<li><a className="divider"></a></li>
                                            <li><a onClick={this._setSearchType.bind(this, _invSearchTypes.SERIALNUMBER)}>Serial Number</a></li>
		                    				<li><a onClick={this._setSearchType.bind(this, _invSearchTypes.DESCRIPTION)}>Description</a></li>
                                            <li><a onClick={this._setSearchType.bind(this, _invSearchTypes.PARTNUMBER)}>Part Number</a></li>
	                                  	</ul>
		                            </div>
		                        </div>
		                    </div>
				            <div className="col-xs-14">
				                <input className="form-control" value={this.state.selectedInfo} disabled style={this.props.inputBoxStyle} title={this.state.selectedInfo}></input>
			                </div>
				       	</div>
			       	</div>

	              	<div className="modal" id="mdSearchList" ref="mdSearchList">
	                  	<div className="modal-dialog modal-lg">
	                      	<div className="modal-content">
	                      		<div className="modal-header">
						        	<button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
						        	<h4 className="modal-title">Search results:</h4>
						      	</div>
	                          	<div id="mdSearchListBody" className="modal-body">
	                          		<div className="row">
	                          			<div className="col-xs-24">
	                          				<InvSearchTable results={this.state.results} onSelect={this._setSelectedRecord}></InvSearchTable>
	                          			</div>
	                          		</div>
	                          	</div>
	                          	<div className="modal-footer">
						        	<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						      	</div>
	                      	</div>
	                  	</div>
	              	</div>
	          </div>
    	)
    }
});

var InvSearchTable = React.createClass ({
	getDefaultProps: function() {
        return {
            results: []
        };
    },
    getInitialState : function(){
        return {
            results: this.props.results
        };
    },
    _clickSelect: function(rowIndex){
        if(this.state.results[rowIndex]){
            //console.log("_clickSelect:"+rowIndex);
            this.props.onSelect(this.state.results[rowIndex]);
        }
    },
    _renderSearchText: function(props){
        return <Cell>{this.state.results[props.rowIndex][props.columnKey]}</Cell>;
    },
    componentWillReceiveProps: function(nextProps) {
  		//this.props.results = nextProps.results;
  		this.state.results = nextProps.results;
    },
    render: function(){
    	return 	(
					<Table
				    rowHeight={40}
			      rowsCount={this.state.results.length}
				    width={600}
				    height={300}
				    headerHeight={50}
				    >
					    <Column columnKey="RECNO" header={<Cell></Cell>} cell={<SearchSelectButton onSelect={this._clickSelect} />} fixed={true} width={50}/>
              <Column columnKey="PARTNUMBER" header={<Cell>Part Number</Cell>} cell={this._renderSearchText} width={100} flex={1}/>
              <Column columnKey="DESCRIPTION" header={<Cell>Description</Cell>} cell={this._renderSearchText} width={100} flex={1}/>
              <Column columnKey="SERIALNUMBER" header={<Cell>Serail Number</Cell>} cell={this._renderSearchText} width={100} flex={1}/>
              <Column columnKey="CPTCODE" header={<Cell>Cpt</Cell>} cell={this._renderSearchText} width={100} flex={1}/>
			  		</Table>
    			);
    }

});
