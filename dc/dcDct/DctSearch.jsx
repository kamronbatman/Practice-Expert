var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var _xrxDct_SqlController = require(appPath + "/dc/dcDct/controller.js");

//React
var React = require(nodeModulesPath + "react");
var ReactDOM = require(nodeModulesPath + "react-dom");
//FixedDataTable
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

var _dctSearchTypes = {
  DCTID: 'DCTID',
  NAME: 'NAME'
};

var DctSearch = React.createClass ({
	getDefaultProps: function() {
        return {
            dctId: "",
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
            dctId: this.props.dctId,
            isRequired: this.props.isRequired,
            searchType: _dctSearchTypes.NAME,
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
        if(this.state.dctId){

            var self = this;
            _xrxDct_SqlController.xrxDctSearch_GetById(this.state.dctId, function (err, record) {
                if(err){
                    alert("Error loading information.");
                }
                else{
                    if(record && record.length > 0){
                        self._setSelectedRecord(record[0]);
                    }
                    else{
                        self.props.onSelect("", self.state.isValid);
                        self.setState({dctId: ""});
                    }
                }
            });

            var $inputBox = $(this.refs.xrxDctSrch_SearchInput);
            $inputBox.val(this.props.dctId);
        }
    },
	_setSearchType: function(type) {
        var $inputBox = $(this.refs.xrxDctSrch_SearchInput);
        $inputBox.val("");
        $inputBox.focus();
        this.props.onSelect("", this.state.isValid);
		this.setState({dctId: "", searchType: type, selectedInfo: ""});
    },
    _onKeyDown: function(event){
    	var key = event.which;

       if(key == '13' || key == '9' || key == '113'){
       		this._search();
       }
    },
    _search: function(){

    	var $inputBox = $(this.refs.xrxDctSrch_SearchInput);
    	var searchText = $inputBox.val();

    	if(searchText){
    		var self = this;
    		self._changeLoadingSign(true);
    		_xrxDct_SqlController.xrxDctSearch_GetById(searchText, function (err, singleRecord) {

    				if(!err && singleRecord && singleRecord.length > 0){
    					self._setSelectedRecord(singleRecord[0]);
    				}
    				else{
    					_xrxDct_SqlController.xrxDctSearch_GetList(searchText, self.state.searchType, function (err, record) {
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
    	var $inputBox = $(this.refs.xrxDctSrch_SearchInput);
	    var searchText = $inputBox.val();

        if(!searchText){
            this.props.onSelect("", true);
            this.setState({dctId: "", selectedInfo: "", isValid: true});
        }
	    else if(this.state.dctId !== searchText){
	    	this.props.onSelect("", false);
	    	this.setState({isValid: false});
	    }
    	else{
            this.props.onSelect(this.state.dctId, true);
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

    	this.refs.xrxDctSrch_SearchInput.value = record.DCTID;
    	this.props.onSelect(record.DCTID, true);

    	var selectedInfo = record.LASTNAME + " " + record.FIRSTNAME;
    	this.setState({dctId: record.DCTID, selectedInfo: selectedInfo, isValid: true});
    },
    componentWillReceiveProps: function(nextProps) {
        if(this.props.dctId !== nextProps.dctId){
            this.props.dctId = nextProps.dctId;
            this.state.dctId = nextProps.dctId;
            this._loadData();
        }
    },
    render: function(){

    	var hasErrorClass = "";
    	if((!this.state.isValid) || (this.state.isRequired && !this.state.dctId))
    		hasErrorClass = "form-group has-error";

     	return(
     			<div>
	     			<div className={hasErrorClass}>
		                <div className="row">
		                	<div className="col-xs-10">
		                        <div className="input-group">
		                      		<input id="xrxDctSrch_SearchInput" ref="xrxDctSrch_SearchInput" className="form-control"
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
	                                      	<li><a onClick={this._setSearchType.bind(this, _dctSearchTypes.DCTID)}>Id</a></li>
		                    				<li><a onClick={this._setSearchType.bind(this, _dctSearchTypes.NAME)}>Name</a></li>
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
	                          				<DctSearchTable results={this.state.results} onSelect={this._setSelectedRecord}></DctSearchTable>
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

var DctSearchTable = React.createClass ({
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
      //console.log(this.state.results);
    	return 	(
					<Table
				    rowHeight={40}
			      rowsCount={this.state.results.length}
				    width={500}
				    height={300}
				    headerHeight={50}
				    >
					    <Column columnKey="RECNO" header={<Cell></Cell>} cell={<SearchSelectButton onSelect={this._clickSelect} />} fixed={true} width={50}/>
              <Column columnKey="DCTID" header={<Cell>Id</Cell>} cell={this._renderSearchText} width={100} flex={1}/>
              <Column columnKey="LASTNAME" header={<Cell>Last Name</Cell>} cell={this._renderSearchText} width={200} flex={1}/>
              <Column columnKey="FIRSTNAME" header={<Cell>First Name</Cell>} cell={this._renderSearchText} width={150} flex={1}/>
			  		</Table>
    			);
    }

});
