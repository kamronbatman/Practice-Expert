var remote = require('electron').remote;
var appPath = remote.getGlobal('appPath');
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;
//var sqlBllPrvSch = require(appPath + "/2/common/search_controls/BllPrvSearch/sqlBllPrvSearch.js");
var sqlBllPrvSch = require(appPath + "/dc/dcBllprv/sqlBllprv.js");

var BllPrvSearch = React.createClass({

  getDefaultProps: function() {
      return {

          bllprvData: {},
          isRequired: false,
          isValid: true,
          isLoading: false,
          showSelectedInfoBox: false,
          showError: true,
          error: '',
          bllprvSearchTypes: {ID: 'ID', NAME: 'NAME'},
          colName: ""
      };
  },
  getInitialState: function() {

      return {
          bllprvData: this.props.bllprvData,
          isRequired: this.props.isRequired,
          searchType: this.props.bllprvSearchTypes.ID,
          results: [],
          selectedInfo: "",
          isValid: this.props.isValid,
          isLoading: this.props.isLoading,
          showSelectedInfoBox: this.props.showSelectedInfoBox,
          showError: this.props.showError,
          error: this.props.error,
          colName: this.props.colName
      };
  },
  _loadData : function(){

        var searchText = this.state.bllprvData.id;
        if(searchText)
        {
            var self = this;

            sqlBllPrvSch.bllPrvExists(searchText, null, function(err, record) {

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
  _setSearchType: function(type){
      var $inputBox = $(this.refs.xrxBllprvSrch_SearchInput);
      $inputBox.val("");
      $inputBox.focus();
      this.props.onSelect({recno:'', id:'', name:''}, false);
      this.setState({bllprvData: {recno:'', id:'', name:''}, searchType: type, selectedInfo: ""});
  },
  _onKeyDown: function(event){
        var key = event.which;

        if(key == '13' || key == '9' || key == '113')
        {
            var $bllPrvSchBtn = $(this.refs.bllPrvSchBtn);
            $bllPrvSchBtn.focus();
            this._search();
        }
        else if(key == '118'){
            this._addNew();
        }
  },
  _search: function(event)
  {
      var $inputBox = $(this.refs.xrxBllprvSrch_SearchInput);
      var searchText = $inputBox.val().trim();

      var searchTypeColumn = "BLLPRVID";
      if(this.state.searchType === this.props.bllprvSearchTypes.NAME)
        searchTypeColumn = "NM103_BP_NAME";

      this.state.results = [];
      var self = this;

      if(searchText)
      {

          sqlBllPrvSch.bllPrvExists(searchText, null, function(err, record) {

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
              sqlBllPrvSch.bllPrvSearch(searchText, searchTypeColumn, function(err, record){

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
                    //add new code
                    var r = confirm("Record does not exsists with this id/name. Please add new.");
                    if (r == true)
                    {
                        // add new code.
                    }
                    else
                    {
                        // nothing
                    }
                  }

                }


              });
            }

         });

      }
  },
  _onTextChange: function(){
      var $inputBox = $(this.refs.xrxBllprvSrch_SearchInput);
      var searchText = $inputBox.val().trim();
      if(!searchText)
      {
          this.props.onSelect({recno:'', id:'', name:''}, true);
          this.setState({bllprvData: {recno:'', id:'', name:''}, selectedInfo: "", isValid: true, showError: false});
      }
      else if(this.state.bllprvData.id !== searchText){
          this.props.onSelect(this.state.bllprvData, false);
          this.setState({isValid: false, showError: true});
      }
      else
      {
        this.props.onSelect(this.state.bllprvData, true);
        this.setState({isValid: true, showError: false});
      }
  },
  _showResultModal: function(recordList){
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
        var $xrxBllprvSrch_SearchInput = $(this.refs.xrxBllprvSrch_SearchInput);
        $xrxBllprvSrch_SearchInput.focus();
      }

      var selectedBllprvData = {};
      selectedBllprvData.recno = record.RECNO.value;
      selectedBllprvData.id = record.BLLPRVID.value;
      selectedBllprvData.name = record.NM103_BP_NAME.value;

      this.refs.xrxBllprvSrch_SearchInput.value = record.BLLPRVID.value;
      this.props.onSelect(selectedBllprvData, true);

      var selectedInfo = record.NM103_BP_NAME.value;
      this.setState({bllprvData: selectedBllprvData, selectedInfo: selectedInfo, isValid: true});
  },
  _addNew: function() {

    //****** Uncomment it once bllprv datadictionary project done

    // var self = this;
    // var $mdSearchResult = $(this.refs.mdSearchList);
    // $mdSearchResult.modal('hide');
    //
    // var $inputBox = $(this.refs.xrxBllprvSrch_SearchInput);
    // var searchText = $inputBox.val();
    //
    // var data = {};
    //
    // data.searchText = searchText;
    // data.searchType = this.state.searchType;
    // data.isComponent = true;
    //
    // const ipcRenderer = require('electron').ipcRenderer;
    // const BrowserWindow = require('electron').remote.BrowserWindow;
    //
    // const loadURL = appPath + "/2/dc/dcBllprv/edit.html";
    // console.log(loadURL);
    //
    // const windowID = BrowserWindow.getFocusedWindow().id;
    // let win = new BrowserWindow({ width: 900, height: 750, center: true, parent : BrowserWindow.getFocusedWindow(), modal : true, show: false });
    //
    // win.loadURL(loadURL);
    //
    // win.webContents.on('did-finish-load', function () {
    //   win.webContents.send('get-data', windowID, data, self.state.colName);
    // });
    // win.on('closed', function () {
    //   win = null
    //   $inputBox.focus();
    // });
    //
    // win.show();
  },
  _modalHide: function() {
      var $mdSearchResult = $(this.refs.mdSearchList);
      $mdSearchResult.modal('hide');
      var $inputBox = $(this.refs.xrxBllprvSrch_SearchInput);
      $inputBox.focus();
  },
  componentWillReceiveProps: function(nextProps) {
    if(nextProps.bllprvData && (this.props.bllprvData.id !== nextProps.bllprvData.id)){
        //this.props.zipData.zipcode = nextProps.zipData.zipcode;
        this.state.bllprvData.id = nextProps.bllprvData.id;
        this._loadData();
    }
  },
  render: function(){

      var borderColor = '#A9A9A9';
      if(this.state.showError && ((!this.state.isValid) || (this.state.isRequired && !this.state.bllprvData.id)) ){
        borderColor = '#a94442';
      }

      if(this.state.showSelectedInfoBox) {

            return (
            <div style={{display: 'inline-block'}}>
                <div className="text-danger small">{this.props.error}</div>
                <div>
                  <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid', borderColor : borderColor}}>
                      <input type="text" ref="xrxBllprvSrch_SearchInput" name="xrxBllprvSrch_SearchInput" id="xrxBllprvSrch_SearchInput" onChange={this._onTextChange} onKeyDown={this._onKeyDown}  onDoubleClick={this._addNew}
                       placeholder={this.state.searchType} style={{borderRadius: '2px 2px 2px 2px', borderStyle: 'none', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.width}}  autoComplete="off" />
                      <button type='button' onClick={this._search} style={{borderStyle: 'none', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}>&nbsp;<i className="fa fa-search"></i></button>
                      <div style={{display:'inline-block'}}>
                        <div className="dropdown">
                            <button type='button' tabIndex="-1" className="dropdown-toggle" data-toggle="dropdown" style={{borderStyle: 'none', borderLeft: '1px solid #A9A9A9', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}><i className="fa fa-cog"></i>&nbsp;<i className="caret"></i></button>
                            <ul className="dropdown-menu"  tabIndex="-1">
                                <li><a>Search by:</a></li>
                                <li><a className="divider"></a></li>
                                <li><a onClick={this._setSearchType.bind(this, this.props.bllprvSearchTypes.ID)}>Id</a></li>
                                <li><a onClick={this._setSearchType.bind(this, this.props.bllprvSearchTypes.NAME)}>Name</a></li>
                            </ul>
                        </div>
                      </div>
                  </div>
                  <div style={{display: 'inline-block'}}>
                      <label className="text-muted small"  style={{marginLeft: '5px'}}>{this.state.selectedInfo}</label>
                  </div>
               </div>
               <div className="modal" id="mdSearchList" ref="mdSearchList">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this._modalHide}>×</button>
                                <h4 className="modal-title">Search results:</h4>
                            </div>
                            <div id="mdSearchListBody" className="modal-body">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <BllPrvSearchTable results={this.state.results} onSelect={this._setSelectedRecord}></BllPrvSearchTable>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this._addNew}><span className="fa fa-plus"></span> Add New</button>
                                <button type="button" className="btn btn-default" onClick={this._modalHide}>Close</button>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
            )
      }
      else {

          return (

            <div style={{display: 'inline-block'}}>
                  <div className="text-danger small">{this.props.error}</div>
                  <div>
                    <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid', borderColor : borderColor}}>
                        <input type="text" ref="xrxBllprvSrch_SearchInput" name="xrxBllprvSrch_SearchInput" id="xrxBllprvSrch_SearchInput" onChange={this._onTextChange} onKeyDown={this._onKeyDown}  onDoubleClick={this._addNew}
                         placeholder={this.state.searchType} style={{borderRadius: '2px 2px 2px 2px', borderStyle: 'none', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.width}}  autoComplete="off" />
                        <button type='button' onClick={this._search} style={{borderStyle: 'none', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}>&nbsp;<i className="fa fa-search"></i></button>
                        <div style={{display:'inline-block'}}>
                          <div className="dropdown">
                              <button type='button' tabIndex="-1" className="dropdown-toggle" data-toggle="dropdown" style={{borderStyle: 'none', borderLeft: '1px solid #A9A9A9', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}>
                                <i className="fa fa-cog"></i>&nbsp;<i className="caret"></i></button>
                              <ul className="dropdown-menu"  tabIndex="-1">
                                  <li><a>Search by:</a></li>
                                  <li><a className="divider"></a></li>
                                  <li><a onClick={this._setSearchType.bind(this, this.props.bllprvSearchTypes.ID)}>Id</a></li>
                                  <li><a onClick={this._setSearchType.bind(this, this.props.bllprvSearchTypes.NAME)}>Name</a></li>
                              </ul>
                          </div>
                        </div>
                    </div>
                  </div>

                  <div className="modal" id="mdSearchList" ref="mdSearchList">
                      <div className="modal-dialog modal-md">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <button type="button" className="close" onClick={this._modalHide}>×</button>
                                  <h4 className="modal-title">Search results:</h4>
                              </div>
                              <div id="mdSearchListBody" className="modal-body">
                                  <div className="row">
                                      <div className="col-xs-12">
                                          <BllPrvSearchTable results={this.state.results} onSelect={this._setSelectedRecord}></BllPrvSearchTable>
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
          )

        }
  },
  componentDidMount : function()
  {
    this._loadData();
  }


});

var BllPrvSearchTable = React.createClass ({

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
    _renderSearchSelectButton : function(props){
      return <Cell><button type="button" className="btn btn-success"  onClick={this._clickSelect.bind(this, props.rowIndex)}><span className="fa fa-check"></span></button></Cell>;
    },
    componentWillReceiveProps: function(nextProps) {
        this.state.results = nextProps.results;
    },
    render: function(){
        return  (
                    <Table
                        rowHeight={40}
                        rowsCount={this.state.results.length}
                        width={475}
                        height={250}
                        headerHeight={50}
                    >
                        <Column columnKey="RECNO" header={<Cell></Cell>} cell={this._renderSearchSelectButton} width={50} fixed={true}/>
                        <Column columnKey="BLLPRVID" header={<Cell>Id</Cell>} cell={this._renderSearchText} width={100} flex={1}/>
                        <Column columnKey="NM103_BP_NAME" header={<Cell>Name</Cell>} cell={this._renderSearchText} width={325} flex={1}/>
                    </Table>
                );
    }

});
