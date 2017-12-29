var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var _xrxFcl_SqlController = require(appPath + "/dc/dcFcl/controller.js");

//React
var React = require(nodeModulesPath + 'react');
var ReactDOM = require(nodeModulesPath + "react-dom");
//FixedDataTable
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

var FclSearch = React.createClass ({

  propTypes: {
      width : React.PropTypes.string,
      infoWidth : React.PropTypes.string
  },
	getDefaultProps: function() {
        return {
            fclId: "",
            isRequired: false,
            isValid: true,
            isLoading: false,
            showSelectedInfoBox: false,
            error: '',
            fclSearchTypes : {
              FCLID: 'FCLID',
              FCLDESC: 'FCLDESC'
            },
            colName: ""
        };
    },
    getInitialState : function(){
        return {

            fclId: this.props.fclId,
            isRequired: this.props.isRequired,
            searchType: this.props.fclSearchTypes.FCLDESC,
            results: [],
            selectedInfo: "",
            isValid: this.props.isValid,
            isLoading: this.props.isLoading,
            showSelectedInfoBox: this.props.showSelectedInfoBox,
            error: this.props.error,
            colName: this.props.colName
        };
    },
    componentWillMount: function(){
    },
    componentDidMount: function(){
    	this._loadData();
    },
    _loadData: function(){
        if(this.state.fclId){

            var self = this;
            _xrxFcl_SqlController.xrxFclSearch_GetById(this.state.fclId, function (err, record) {
                if(err){
                    alert("Error loading information.");
                }
                else{
                    if(record && record.length > 0){
                        self._setSelectedRecord(record[0]);
                    }
                    else{
                        self.props.onSelect("", self.state.isValid);
                        self.setState({fclId: ""});
                    }
                }
            });

            var $inputBox = $(this.refs.xrxFclSrch_SearchInput);
            $inputBox.val(this.props.fclId);
        }
    },
	_setSearchType: function(type) {
        var $inputBox = $(this.refs.xrxFclSrch_SearchInput);
        $inputBox.val("");
        $inputBox.focus();
        this.props.onSelect("", this.state.isValid);
		    this.setState({fclId: "", searchType: type, selectedInfo: ""});
  },
  _onKeyDown: function(event){
    	var key = event.which;

       if(key == '13' || key == '9' || key == '113'){
       		this._search();
       }
  },
  _search: function(){

    	var $inputBox = $(this.refs.xrxFclSrch_SearchInput);
    	var searchText = $inputBox.val();

    	if(searchText){
    		var self = this;
    		self._changeLoadingSign(true);
    		_xrxFcl_SqlController.xrxFclSearch_GetById(searchText, function (err, singleRecord) {

    				if(!err && singleRecord && singleRecord.length > 0){
    					self._setSelectedRecord(singleRecord[0]);
    				}
    				else{
    					_xrxFcl_SqlController.xrxFclSearch_GetList(searchText, self.state.searchType, function (err, record) {
    						self._changeLoadingSign(false);
			    			if(err) {
			    				alert("Error loading the search list.");
			    			}
			    			else {
			    			  self._showResultModal(record);
			    			}
			    		});
    				}
    		});
    	}
  },
  _searchClick: function() {

    var $inputBox = $(this.refs.xrxFclSrch_SearchInput);
  	var searchText = $inputBox.val();
    var self = this;

    if(searchText)
    {
      _xrxFcl_SqlController.xrxFclSearch_GetList(searchText, self.state.searchType, function (err, record) {
        self._changeLoadingSign(false);
        if(err) {
          alert("Error loading the search list.");
        }
        else {
          self._showResultModal(record);
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
  	var $inputBox = $(this.refs.xrxFclSrch_SearchInput);
    var searchText = $inputBox.val();

      if(!searchText){
          this.props.onSelect("", true);
          this.setState({fclId: "", selectedInfo: "", isValid: true});
      }
    else if(this.state.fclId !== searchText){
    	this.props.onSelect("", false);
    	this.setState({isValid: false});
    }
  	else{
          this.props.onSelect(this.state.fclId, true);
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

    if($mdSearchResult.hasClass('in'))
    {
      $mdSearchResult.modal('hide');
      var $xrxFclSrch_SearchInput = $(this.refs.xrxFclSrch_SearchInput);
      $xrxFclSrch_SearchInput.focus();
    }

    this.refs.xrxFclSrch_SearchInput.value = record.FCLID;
  	this.props.onSelect(record.FCLID, true);

  	var selectedInfo = record.FCLDESC;
  	this.setState({fclId: record.FCLID, selectedInfo: selectedInfo, isValid: true});
  },
  _modalHide: function(){

    this._changeLoadingSign(false);

    var $mdSearchResult = $(this.refs.mdSearchList);
    $mdSearchResult.modal('hide');
    var $inputBox = $(this.refs.xrxFclSrch_SearchInput);
    $inputBox.focus();

  },
  componentWillReceiveProps: function(nextProps) {
      if(this.props.fclId !== nextProps.fclId){
          this.props.fclId = nextProps.fclId;
          this.state.fclId = nextProps.fclId;
          this._loadData();
      }
  },
  render: function(){

    var borderColor = '#A9A9A9';
    if((!this.state.isValid) || (this.state.isRequired && !this.state.fclId)){
         borderColor = '#a94442';
    }

    var infoBlock = null;

    if(this.state.showSelectedInfoBox)
    {
      infoBlock = <div style={{display: 'inline-block'}}>
                      <label className="text-muted small" style={{borderRadius: '2px 2px 2px 2px', border: '1px solid #A9A9A9', backgroundColor: 'lightgrey',  padding: '2px 5px', width: this.props.infoWidth}}  >&nbsp;{this.state.selectedInfo}</label>
                  </div>
    }

    return(
   			<div style={{display: 'inline-block'}}>
            <div className="text-danger small">{this.props.error}</div>
	     			<div>
              <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid', borderColor : borderColor}}>
              		<input ref="xrxFclSrch_SearchInput" name="xrxFclSrch_SearchInput" id="xrxFclSrch_SearchInput" onChange={this._onTextChange} onKeyDown={this._onKeyDown}
              			placeholder={this.state.searchType} style={{borderRadius: '2px 2px 2px 2px', borderStyle: 'none', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.width}} autoComplete="off" />
                  <button type='button' onClick={this._searchClick} style={{borderStyle: 'none', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}>&nbsp;<i className="fa fa-search"></i></button>

                  <div style={{display:'inline-block'}}>
                     <div className="dropdown">
                        <button type='button' tabIndex="-1" className="dropdown-toggle" data-toggle="dropdown" style={{borderStyle: 'none', borderLeft: '1px solid #A9A9A9', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}><i className="fa fa-cog"></i>&nbsp;<i className="caret"></i></button>
                      	<ul className="dropdown-menu" tabIndex="-1">
                      		<li><a>Search by:</a></li>
                      		<li><a className="divider"></a></li>
                          <li><a onClick={this._setSearchType.bind(this, this.props.fclSearchTypes.FCLID)}>Id</a></li>
          				        <li><a onClick={this._setSearchType.bind(this, this.props.fclSearchTypes.FCLDESC)}>Description</a></li>
                      	</ul>
                      </div>
                  </div>
              </div>
              {infoBlock}
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
                        				<FclSearchTable results={this.state.results} onSelect={this._setSelectedRecord}></FclSearchTable>
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

var FclSearchTable = React.createClass ({
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
          width={550}
          height={300}
          headerHeight={50}
          >
            <Column columnKey="RECNO" header={<Cell></Cell>} cell={<SearchSelectButton onSelect={this._clickSelect} />} fixed={true} width={50}/>
            <Column columnKey="FCLID" header={<Cell>Id</Cell>} cell={this._renderSearchText} width={150} flex={1}/>
            <Column columnKey="FCLDESC" header={<Cell>Last Name</Cell>} cell={this._renderSearchText} width={350} flex={1}/>
          </Table>
        );
  }

});
