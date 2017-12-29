var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var _xrxPat_SqlController = require(appPath + "/pt/ptSearch/controller.js");
var moment = require(nodeModulesPath + 'moment');
var bootbox = require(nodeModulesPath + 'bootbox');
//React
var React = require(nodeModulesPath + 'react');
var ReactDOM = require(nodeModulesPath + "react-dom");
//FixedDataTable
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

var _patSearchTypes = {
  PATID: 'PATID',
  PATNAME: 'PATNAME',
  RSPNAME: 'RSPNAME',
  ALIAS: 'ALIAS',
  SSN: 'SSN',
  PRIMARYID: 'PRIMARYID',
  PHONE: 'PHONE',
  BIRTHDATE: 'BIRTHDATE',
  CHARTNO: 'CHARTNO'

};

var PtSearch = React.createClass ({

    propTypes: {
      width : React.PropTypes.string,
      infoWidth : React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            patId: "",
            isRequired: false,
            isValid: true,
            isLoading: false,
            isDisabled: false
          };
    },
    getInitialState : function(){
        return {
            patId: this.props.patId,
            isRequired: this.props.isRequired,
            searchType: _patSearchTypes.PATNAME,
            results: [],
            selectedInfo: "",
            isValid: this.props.isValid,
            isLoading: this.props.isLoading,
            isDisabled: this.props.isDisabled
        };
    },
    componentWillMount: function(){
    },
    componentDidMount: function(){
    	this._loadData();
    },
    _loadData: function(){
        if(this.state.patId){

            var self = this;
            _xrxPat_SqlController.xrxPatSearch_GetById(this.state.patId, function (err, record) {
                if(err){
                    alert("Error loading information.");
                }
                else{
                    if(record && record.length > 0){
                        self._setSelectedRecord(record[0]);
                    }
                    else{
                        self.props.onSelect("", self.state.isValid);
                        self.setState({patId: ""});
                    }
                }
            });

            var $inputBox = $(this.refs.xrxPatSrch_SearchInput);
            $inputBox.val(this.props.patId);
        }
    },
	  _setSearchType: function(type) {
        var $inputBox = $(this.refs.xrxPatSrch_SearchInput);
        $inputBox.val("");
        $inputBox.focus();
        this.props.onSelect("", this.state.isValid);
		    this.setState({patId: "", searchType: type, selectedInfo: ""});
    },
    _onKeyDown: function(event){
      var key = event.which;
      if(key == '13' || key == '9' || key == '113') {

          this._search();
      
      }
    },
    _search: function(){

    	var $inputBox = $(this.refs.xrxPatSrch_SearchInput);
    	var searchText = $inputBox.val();

    	if(searchText){
    		var self = this;
    		self._changeLoadingSign(true);
    		_xrxPat_SqlController.xrxPatSearch_GetById(searchText, function (err, singleRecord) {

    				if(!err && singleRecord && singleRecord.length > 0){



    					self._setSelectedRecord(singleRecord[0]);
    				}
    				else{
    					_xrxPat_SqlController.xrxPatSearch_GetList(searchText, self.state.searchType, function (err, record) {
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
      else {
          bootbox.confirm("Please type one or more character", function (result) {});
      }
    },
    _changeLoadingSign: function(show){
    	if(show)
    		this.setState({selectedInfo: "Loading..."});
    	else
    		this.setState({selectedInfo: ""});
    },
    _onTextChange: function(){
    	var $inputBox = $(this.refs.xrxPatSrch_SearchInput);
	    var searchText = $inputBox.val();

        if(!searchText){
            this.props.onSelect("", true);
            this.setState({patId: "", selectedInfo: "", isValid: true});
        }
        else if(this.state.patId !== searchText){
    	    	this.props.onSelect("", false);
    	    	this.setState({isValid: false});
	      }
    	  else{
            this.props.onSelect(this.state.patId, true);
    		    this.setState({isValid: true});
    	  }
    },
    _showResultModal: function(recordList){
    	var $mdSearchResult = $(this.refs.mdSearchList);
    	$mdSearchResult.modal('show');
    	this.setState({results: recordList});
    },
    _setSelectedRecord: function(record) {

      var $mdSearchResult = $(this.refs.mdSearchList);
    	if($mdSearchResult.hasClass('in'))
      {
        $mdSearchResult.modal('hide');
        var $xrxPatSrch_SearchInput = $(this.refs.xrxPatSrch_SearchInput);
        $xrxPatSrch_SearchInput.focus();
      }

      this.refs.xrxPatSrch_SearchInput.value = record.PATID;
    	this.props.onSelect(record.PATID, true);

    	var selectedInfo = record.PATNAME;
    	this.setState({patId: record.PATID, selectedInfo: selectedInfo, isValid: true});
    },
    componentWillReceiveProps: function(nextProps) {
        if(this.props.patId !== nextProps.patId){
            this.props.patId = nextProps.patId;
            this.state.patId = nextProps.patId;
            this._loadData();
        }
    },
    _modalHide: function(){

      var $mdSearchResult = $(this.refs.mdSearchList);
      $mdSearchResult.modal('hide');
      var $inputBox = $(this.refs.xrxPatSrch_SearchInput);
      $inputBox.focus();
    },
    render: function(){

      var borderColor = '#A9A9A9';
      if((!this.state.isValid) || (this.state.isRequired && !this.state.patId)) {
           borderColor = '#a94442';
      }

      return (

          <div style={{display: 'inline-block'}}>
	     			  <div>
	                <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid', borderColor : borderColor}}>
                      <input type="text" id="xrxPatSrch_SearchInput" ref="xrxPatSrch_SearchInput"
                  			placeholder={this.state.searchType} onChange={this._onTextChange} onKeyDown={this._onKeyDown} style={{borderRadius: '2px 2px 2px 2px', borderStyle: 'none', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.width}}
                  			 disabled={this.props.isDisabled} autoComplete="off"  />
                      <button type='button' onClick={this._search} style={{borderStyle: 'none', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}>&nbsp;<i className="fa fa-search"></i></button>
                      <div style={{display: 'inline-block'}}>
                        <div className="dropdown">
                          <button type='button' tabIndex="-1" className="dropdown-toggle" data-toggle="dropdown" style={{borderStyle: 'none', borderLeft: '1px solid #A9A9A9', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}>
                            <i className="fa fa-cog"></i>&nbsp;<i className="caret"></i>
                          </button>
                          <ul className="dropdown-menu" tabIndex="-1">
                        		<li><a>Search by:</a></li>
                        		<li><a className="divider"></a></li>
                            <li><a onClick={this._setSearchType.bind(this, _patSearchTypes.PATID)}>Pat Id</a></li>
                            <li><a onClick={this._setSearchType.bind(this, _patSearchTypes.PATNAME)}>Pat Name</a></li>
                            <li><a onClick={this._setSearchType.bind(this, _patSearchTypes.RSPNAME)}>Responsible Name</a></li>
                            <li><a onClick={this._setSearchType.bind(this, _patSearchTypes.ALIAS)}>Alias</a></li>
                            <li><a onClick={this._setSearchType.bind(this, _patSearchTypes.SSN)}>SSN</a></li>
                            <li><a onClick={this._setSearchType.bind(this, _patSearchTypes.PRIMARYID)}>Subscriber Primary Id</a></li>
                            <li><a onClick={this._setSearchType.bind(this, _patSearchTypes.PHONE)}>Phone No</a></li>
                            <li><a onClick={this._setSearchType.bind(this, _patSearchTypes.BIRTHDATE)}>Birthdate</a></li>
                            <li><a onClick={this._setSearchType.bind(this, _patSearchTypes.CHARTNO)}>Chart No</a></li>
                        	</ul>
                        </div>
                      </div>
                  </div>
			            <div style={{display: 'inline-block'}}>
			                <label className="small" style={{borderRadius: '2px 2px 2px 2px', border: '1px solid #A9A9A9', backgroundColor: 'lightgrey',  padding: '2px 5px', width: this.props.infoWidth}}>&nbsp;{this.state.selectedInfo}</label>
		              </div>
              </div>
              <div className="modal" id="mdSearchList" ref="mdSearchList">
                	<div className="modal-dialog modal-lg">
                    	<div className="modal-content">
                    		<div className="modal-header">
				        	           <button type="button" className="close" onClick={this._modalHide}>×</button>
				        	           <h4 className="modal-title">Search results:</h4>
				      	        </div>
                        <div id="mdSearchListBody" className="modal-body">
                        		<div className="row">
                        			<div className="col-xs-24">
                        				<PatSearchTable results={this.state.results} onSelect={this._setSelectedRecord}></PatSearchTable>
                        			</div>
                        		</div>
                        </div>
                        <div className="modal-footer">
				        	           <button type="button" className="btn btn-default" onClick={this._modalHide}>Close</button>
				      	        </div>
                    	</div>
                	</div>
            	</div>
	        </div>
    	)
    }
});

var PatSearchTable = React.createClass ({
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
    _renderSearchDate: function(props){
        if(this.state.results[props.rowIndex][props.columnKey]){
          var dateVal = moment(this.state.results[props.rowIndex][props.columnKey]);
          dateVal.utc();
          var displayVal = dateVal.format('L');
          return <Cell>{displayVal}</Cell>;
        }
        else{
          <Cell></Cell>;
        }
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
				    width={580}
				    height={300}
				    headerHeight={50} >
              <Column columnKey="RECNO" header={<Cell></Cell>} cell={<SearchSelectButton onSelect={this._clickSelect} />} fixed={true} width={50}/>
              <Column columnKey="PATID" header={<Cell>Id</Cell>} cell={this._renderSearchText} width={100} flex={1}/>
              <Column columnKey="EXT" header={<Cell>Ext</Cell>} cell={this._renderSearchText} width={50} flex={1}/>
              <Column columnKey="PATNAME" header={<Cell>Name</Cell>} cell={this._renderSearchText} width={200} flex={1}/>
              <Column columnKey="COVERAGE" header={<Cell>Coverage</Cell>} cell={this._renderSearchText} width={150} flex={1}/>
              <Column columnKey="PRIMARYID" header={<Cell>Primary Id</Cell>} cell={this._renderSearchText} width={150} flex={1}/>
              <Column columnKey="BIRTHDATE" header={<Cell>Birth Date</Cell>} cell={this._renderSearchDate} width={100} flex={1}/>
              <Column columnKey="PHONE" header={<Cell>Phone</Cell>} cell={this._renderSearchText} width={100} flex={1}/>
              <Column columnKey="RSPNAME" header={<Cell>Responsible Name</Cell>} cell={this._renderSearchText} width={200} flex={1}/>
			  	</Table>
    		);
    }

});
