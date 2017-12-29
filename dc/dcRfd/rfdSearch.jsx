var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

var rfdSql = require(appPath + "/dc/dcRfd/rfdSql.js");

var RfdSearch = React.createClass ({

    getDefaultProps: function() {

        return {
            rfdData: {},
            isRequired: false,
            isValid: true,
            isLoading: false,
            showSelectedInfoBox: false,
            error: '',
            rfdSearchTypes: {
                RFDID : 'RFDID',
                NAME : 'NAME'
            },
            colName: ""
        };
    },
    getInitialState : function() {
      return {

              rfdData: this.props.rfdData,
              isRequired: this.props.isRequired,
              searchType: this.props.rfdSearchTypes.NAME,
              results: [],
              selectedInfo: "",
              isValid: this.props.isValid,
              isLoading: this.props.isLoading,
              showSelectedInfoBox: this.props.showSelectedInfoBox,
              error: this.props.error,
              colName: this.props.colName
          }
    },
    componentDidMount: function(){
      this._loadData();
    },
    _loadData: function() {

      var searchText = this.state.rfdData.rfdId;
      if(searchText)
      {
          var self = this;
          rfdSql.rfdExists(searchText, null, function(err, record) {

              if(err)
              {
                console.log(err);
              }
              else if(record && record.length > 0)
              {
                self._setSelectedRecord(record[0]);
              }
          });
        }
    },
    _setSearchType: function(type) {

        var $inputBox = $(this.refs.xrxRfdSrch_SearchInput);
        $inputBox.val("");
        $inputBox.focus();
        this.props.onSelect({recNo:'', rfdId : '', fax : ''}, true);
        this.setState({rfdData: {recNo:'', rfdId : '', fax : ''}, searchType: type, selectedInfo: ""});
    },
    _onKeyDown: function(event){

      var key = event.which;

      if(key == '13' || key == '9'){

        if(!this.state.isValid)
        {
          this._search();
        }
      }
      else if( key == '113'){
        this._searchClick();
      }
      else if(key == '118'){
          this._addNew();
      }
    },
    _search: function()
    {
      var $inputBox = $(this.refs.xrxRfdSrch_SearchInput);
      var searchText = $inputBox.val();
      if(searchText)
      {
          this._changeLoadingSign(true);
          var self = this;
          rfdSql.rfdExists(searchText, null, function(err, record) {

            if(err)
            {
                console.log(err);
            }
            else if(record && record.length > 0)
            {
              self._setSelectedRecord(record[0]);
            }
            else
            {
                rfdSql.rfdSearch(searchText, self.state.searchType, function(err, record){

                    if(err)
                    {
                      console.log(err);
                    }
                    else
                    {
                      self._showResultModal(record);
                    }
                });
            }

         });
       }
    },
    _searchClick: function() {


          var $inputBox = $(this.refs.xrxRfdSrch_SearchInput);
          var searchText = $inputBox.val();

          var self = this;

          if(searchText)
          {
              rfdSql.rfdSearch(searchText, self.state.searchType, function(err, record) {

                  if(err)
                  {
                    console.log(err);
                  }
                  else
                  {
                    if(record && record.length > 0)
                    {
                      self._showResultModal(record);
                    }
                    else
                    {
                        bootbox.confirm("There are no results for this search criteria. Would you like to add a new record?", function (result) {

                            if(result)
                            {
                                console.log(result);
                                self._addNew();
                            }
                        });
                      }
                    }
              });
          }
          else {
              bootbox.confirm("Please type one or more character", function (result) {});
          }
    },
    _changeLoadingSign: function(show)
    {
      if(show)
          this.setState({selectedInfo: "Loading..."});
      else
          this.setState({selectedInfo: ""});
    },
    _onTextChange: function()
    {
      var $inputBox = $(this.refs.xrxRfdSrch_SearchInput);
      var searchText = $inputBox.val();
      if(!searchText)
      {
        this.props.onSelect({recNo:'', rfdId : '', fax : ''}, true);
        this.setState({rfdData:{recNo:'', rfdId : '', fax : ''}, selectedInfo: "", isValid: true});
      }
      else if(this.state.rfdData.rfdId !== searchText){

        this.props.onSelect(this.state.rfdData, false);
        this.setState({isValid: false});
      }
      else
      {
        this.props.onSelect(this.state.rfdData, true);
        this.setState({isValid: true});
      }

    },
    _showResultModal: function(recordList)
    {
      var $mdSearchResult = $(this.refs.mdSearchList);
      $mdSearchResult.modal('show');
      this.setState({results: recordList});
    },
    _setSelectedRecord: function(record)
    {
      var $mdSearchResult = $(this.refs.mdSearchList);

      if($mdSearchResult.hasClass('in'))
      {
        $mdSearchResult.modal('hide');
        var $xrxRfdSrch_SearchInput = $(this.refs.xrxRfdSrch_SearchInput);
        $xrxRfdSrch_SearchInput.focus();
      }

      var selectedRfdData = {};
      selectedRfdData.recNo = record.RECNO.value;
      selectedRfdData.rfdId = record.RFDID.value;
      selectedRfdData.fax = record.FAX.value;


      this.refs.xrxRfdSrch_SearchInput.value = record.RFDID.value;

      this.props.onSelect(selectedRfdData, true);

      var selectedInfo = "";

      this.setState({rfdData: selectedRfdData, selectedInfo: selectedInfo, isValid: true});
    },
    _addNew: function()
    {
    },
    _modalHide: function()
    {
        this._changeLoadingSign(false);
        var $mdSearchResult = $(this.refs.mdSearchList);
        $mdSearchResult.modal('hide');
        var $inputBox = $(this.refs.xrxRfdSrch_SearchInput);
        $inputBox.focus();
    },
    componentWillReceiveProps: function(nextProps) {
      if(nextProps.rfdData && (this.props.rfdData.rfdId !== nextProps.rfdData.rfdId)){
          this.state.rfdData.rfdId = nextProps.rfdData.rfdId;
          this._loadData();
      }
    },
    render: function() {

      var borderColor = '#A9A9A9';
      if(((!this.state.isValid) || (this.state.isRequired && !this.state.rfdData.rfdId)) ){
          borderColor = '#a94442';
      }

      var info = null;
      if(this.state.showSelectedInfoBox)
      {
        info = <div style={{display: 'inline-block'}}>
                  <label className="text-muted small"  style={{marginLeft: '5px'}}>{this.state.selectedInfo}</label>
              </div>
      }

       return (


         <div style={{display: 'inline-block'}}>

             <div className="text-danger small">{this.props.error}</div>
             <div>
               <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid', borderColor : borderColor}}>
                   <input type="text" ref="xrxRfdSrch_SearchInput" name="xrxRfdSrch_SearchInput" id="xrxRfdSrch_SearchInput"  onChange={this._onTextChange} onKeyDown={this._onKeyDown} onDoubleClick={this._addNew}
                   placeholder={this.state.searchType}   style={{borderRadius: '2px 2px 2px 2px', borderStyle: 'none', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.width}} autoComplete="off" />
                   <button type='button' onClick={this._searchClick} style={{borderStyle: 'none', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}><i className="fa fa-search"></i></button>
                   <div style={{display:'inline-block'}}>
                       <div className="dropdown">
                           <button type='button' tabIndex="-1" className="dropdown-toggle" data-toggle="dropdown" style={{borderStyle: 'none', borderLeft: '1px solid #A9A9A9', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}><i className="fa fa-cog"></i>&nbsp;<i className="caret"></i></button>
                           <ul className="dropdown-menu"  tabIndex="-1">
                               <li><a>Search by:</a></li>
                               <li><a className="divider"></a></li>
                               <li><a onClick={this._setSearchType.bind(this, this.props.rfdSearchTypes.RFDID)}>Id</a></li>
                               <li><a onClick={this._setSearchType.bind(this, this.props.rfdSearchTypes.NAME)}>Name</a></li>
                            </ul>
                       </div>
                   </div>
               </div>
               {info}
             </div>

             <div className="modal" id="mdSearchList" ref="mdSearchList">
                  <div className="modal-dialog">
                      <div className="modal-content">
                          <div className="modal-header">
                              <button type="button" className="close" onClick={this._modalHide}>×</button>
                              <h4 className="modal-title">Search results:</h4>
                          </div>
                          <div id="mdSearchListBody" className="modal-body">
                              <div className="row">
                                  <div className="col-xs-24">
                                      <RfdSearchTable results={this.state.results} onSelect={this._setSelectedRecord} />
                                  </div>
                              </div>
                          </div>
                          <div className="modal-footer">
                              <button type="button" className="btn btn-primary" onClick={this._addNew}><span className="fa fa-plus"></span> Add New</button>
                              <button type="button" className="btn btn-default" onClick={this._modalHide}> Close</button>
                          </div>
                      </div>
                  </div>
             </div>

          </div>
      );



    }

});

var RfdSearchTable = React.createClass ({

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
      return <Cell>{this.state.results[props.rowIndex][props.columnKey].value}</Cell>;
  },
  componentWillReceiveProps: function(nextProps) {
      this.state.results = nextProps.results;
  },
  render: function() {

    return  (
                <Table
                    rowHeight={40}
                    rowsCount={this.state.results.length}
                    width={580}
                    height={300}
                    headerHeight={50} >

                    <Column columnKey="RECNO" header={<Cell></Cell>} cell={<SearchSelectButton onSelect={this._clickSelect} />} width={50} fixed={true}/>
                    <Column columnKey="RFDID" header={<Cell>Rfd Id</Cell>} cell={this._renderSearchText} width={90} flex={1}/>
                    <Column columnKey="LASTNAME" header={<Cell>Last Name</Cell>} cell={this._renderSearchText} width={220} flex={1}/>
                    <Column columnKey="FIRSTNAME" header={<Cell>FirstName</Cell>} cell={this._renderSearchText} width={220} flex={1}/>

                </Table>
            );


  }

});
