var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var _xrxSnomed_SqlController = require(appPath + "/dc/dcSnomed/snomedSql.js");
var moment = require(nodeModulesPath + 'moment');
var bootbox = require(nodeModulesPath + 'bootbox');

//FixedDataTable
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

var _snomedSearchTypes = {
	SNOMEDCODE: 'SNOMEDCODE',
	SNOMEDDESC: 'SNOMEDDESC'
};

var SnomedSearch = React.createClass ({

    propTypes: {
      width : React.PropTypes.string,
      infoWidth : React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            snomedCode : "",
            isRequired: false,
            isValid: true,
            isLoading: false,
            isDisabled: false
          };
    },
    getInitialState : function(){
        return {
            snomedCode: this.props.snomedCode,
            isRequired: this.props.isRequired,
            searchType: _snomedSearchTypes.SNOMEDDESC,
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


        if(this.state.snomedCode)
				{

            var self = this;
            _xrxSnomed_SqlController.xrxSnomedSearch_GetById(this.state.snomedCode, function (err, record) {
                if(err)
								{
                    alert("Error loading information.");
                }
                else
								{
                    if(record && record.length > 0)
										{
                      self.setState({snomedCode: record[0].SNOMEDCODE, selectedInfo: record[0].SNOMEDDESC, isValid: true});
                    }
                    else
										{
                      self.setState({snomedCode: self.state.snomedCode, selectedInfo: "", isValid: false});
                    }
                }
            });

            var $inputBox = $(this.refs.xrxSnomedSrch_SearchInput);
            $inputBox.val(this.state.snomedCode);
        }
				else
				{
					this.setState({snomedCode: "", selectedInfo: "", isValid: true});

					var $inputBox = $(this.refs.xrxSnomedSrch_SearchInput);
					$inputBox.val("");
				}


		},
	  _setSearchType: function(type) {
        var $inputBox = $(this.refs.xrxSnomedSrch_SearchInput);
        $inputBox.val("");
        $inputBox.focus();
        this.props.onSelect("", this.state.isValid);
		    this.setState({snomedCode: "", searchType: type, selectedInfo: ""});
    },
    _onKeyDown: function(event){
      var key = event.which;
      if(key == '13' || key == '9' || key == '113') {

          this._search();

      }
    },
    _search: function(){

    	var $inputBox = $(this.refs.xrxSnomedSrch_SearchInput);
    	var searchText = $inputBox.val();

			//console.log("Search Text : " + searchText);

    	if(searchText && searchText.length >= 3)
			{
				var self = this;
    		self._changeLoadingSign(true);
    		_xrxSnomed_SqlController.xrxSnomedSearch_GetById(searchText, function (err, singleRecord) {

    				if(!err && singleRecord && singleRecord.length > 0){

								//console.log(singleRecord[0]);
								self._setSelectedRecord(singleRecord[0]);


    				}
    				else{
    					_xrxSnomed_SqlController.xrxSnomedSearch_GetList(searchText, self.state.searchType, function (err, record) {
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
          bootbox.confirm("Please type at least 3 characters", function (result) {});
      }
    },
    _changeLoadingSign: function(show){
    	if(show)
    		this.setState({selectedInfo: "Loading..."});
    	else
    		this.setState({selectedInfo: ""});
    },
    _onTextChange: function(){

			var $inputBox = $(this.refs.xrxSnomedSrch_SearchInput);
	    var searchText = $inputBox.val();

			this.setState({snomedCode: searchText, selectedInfo : "", isValid: false});

			if(!searchText)
			{
				this.props.onSelect("", true);
			}

    },
    _showResultModal: function(recordList){
    	var $mdSearchResult = $(this.refs.mdSearchList);
    	$mdSearchResult.modal('show');
    	this.setState({results: recordList});
    },
    _setSelectedRecord: function(record) {

			//console.log(record);

      var $mdSearchResult = $(this.refs.mdSearchList);
    	if($mdSearchResult.hasClass('in'))
      {
        $mdSearchResult.modal('hide');
        var $xrxSnomedSrch_SearchInput = $(this.refs.xrxSnomedSrch_SearchInput);
        $xrxSnomedSrch_SearchInput.focus();
      }

      this.refs.xrxSnomedSrch_SearchInput.value = record.SNOMEDCODE;
    	this.props.onSelect(record.SNOMEDCODE, true);

    	var selectedInfo = record.SNOMEDDESC;
    	this.setState({snomedCode: record.SNOMEDCODE, selectedInfo: selectedInfo, isValid: true, results:[]});
    },
    componentWillReceiveProps: function(nextProps) {

				 console.log("*** Check Component Will ReceiveProps");


        if(this.props.snomedCode !== nextProps.snomedCode){

						this.state.snomedCode = nextProps.snomedCode;
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
      if((!this.state.isValid) || (this.state.isRequired && !this.state.snomedCode)) {
           borderColor = '#a94442';
      }

      return (

          <div style={{display: 'inline-block'}}>
	     			  <div>
	                <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid', borderColor : borderColor}}>
                      <input type="text" id="xrxSnomedSrch_SearchInput" ref="xrxSnomedSrch_SearchInput"
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
                            <li><a onClick={this._setSearchType.bind(this, _snomedSearchTypes.SNOMEDCODE)}>Snomed Code</a></li>
                            <li><a onClick={this._setSearchType.bind(this, _snomedSearchTypes.SNOMEDDESC)}>Snomed Desc</a></li>
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
                        				<SnomedSearchTable results={this.state.results} onSelect={this._setSelectedRecord}></SnomedSearchTable>
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

var SnomedSearchTable = React.createClass ({
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
				    width={580}
				    height={300}
				    headerHeight={50} >
              <Column columnKey="RECNO" header={<Cell></Cell>} cell={<SearchSelectButton onSelect={this._clickSelect} />} fixed={true} width={80}/>
              <Column columnKey="SNOMEDCODE" header={<Cell>Code</Cell>} cell={this._renderSearchText} width={200} flex={1}/>
              <Column columnKey="SNOMEDDESC" header={<Cell>Desc</Cell>} cell={this._renderSearchText} width={300} flex={1}/>

			  	</Table>
    		);
    }

});
