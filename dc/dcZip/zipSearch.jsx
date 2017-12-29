var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

var zipSql = require(appPath + "/dc/dcZip/zipSql.js");


var ZipSearch = React.createClass ({

  getDefaultProps: function() {
    return {
        zipData: {},
        isRequired: false,
        isValid: true,
        isLoading: false,
        showSelectedInfoBox: false,
        error: '',
        zipSearchTypes: {
                ZIPCODE:      'ZIPCODE',
                CITY:         'CITY',
                STATE:        'STATE',
                SHORTCODE:    'SHORTCODE'
        },
        colName: ""
    };
  },
  getInitialState : function(){

      return {

        zipData: this.props.zipData,
        isRequired: this.props.isRequired,
        searchType: this.props.zipSearchTypes.ZIPCODE,
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
  _loadData: function() {

    var searchText = this.state.zipData.zipCode;
    if(searchText)
    {
        var self = this;
        zipSql.zipExists(searchText, null, function(err, record) {

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

      var $inputBox = $(this.refs.xrxZipSrch_SearchInput);
      $inputBox.val("");
      $inputBox.focus();
      this.props.onSelect({recNo:'', zipCode:'', city:'', state:'', shortCode:''}, true);
      this.setState({zipData: {recNo:'', zipCode:'', city:'', state:'', shortCode:''}, searchType: type, selectedInfo: ""});
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

    var $inputBox = $(this.refs.xrxZipSrch_SearchInput);
    var searchText = $inputBox.val();
    if(searchText)
    {
        this._changeLoadingSign(true);
        var self = this;
        zipSql.zipExists(searchText, null, function(err, record) {

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
              zipSql.zipSearch(searchText, self.state.searchType, function(err, record){

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


        var $inputBox = $(this.refs.xrxZipSrch_SearchInput);
        var searchText = $inputBox.val();

        var self = this;


        if(searchText)
        {
            zipSql.zipSearch(searchText, self.state.searchType, function(err, record){

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
    var $inputBox = $(this.refs.xrxZipSrch_SearchInput);
    var searchText = $inputBox.val();
    if(!searchText)
    {
      this.props.onSelect({recNo:'', zipCode:'', city:'', state:'', shortCode:''}, true);
      this.setState({zipData: {recNo:'', zipCode:'', city:'', state:'', shortCode:''}, selectedInfo: "", isValid: true});
    }
    else if(this.state.zipData.zipCode !== searchText){

      this.props.onSelect(this.state.zipData, false);
      this.setState({isValid: false});
    }
    else
    {
      this.props.onSelect(this.state.zipData, true);
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
      var $xrxZipSrch_SearchInput = $(this.refs.xrxZipSrch_SearchInput);
      $xrxZipSrch_SearchInput.focus();
    }

    var selectedZipData = {};
    selectedZipData.recNo = record.RECNO.value;
    selectedZipData.zipCode = record.ZIPCODE.value;
    selectedZipData.city = record.CITY.value;
    selectedZipData.state = record.STATE.value;
    selectedZipData.shortCode = record.SHORTCODE.value;

    this.refs.xrxZipSrch_SearchInput.value = record.ZIPCODE.value;

    this.props.onSelect(selectedZipData, true);

    var selectedInfo = "City:"+record.CITY.value + " (" + record.STATE.value + ")";

    this.setState({zipData: selectedZipData, selectedInfo: selectedInfo, isValid: true});
  },
  _addNew: function()
  {
      var self = this;
      var $mdSearchResult = $(this.refs.mdSearchList);
      $mdSearchResult.modal('hide');

      var $inputBox = $(this.refs.xrxZipSrch_SearchInput);
      var searchText = $inputBox.val();

      var data = {};

      data.searchText = searchText;
      data.searchType = this.state.searchType;
      data.isComponent = true;

      const ipcRenderer = require('electron').ipcRenderer;
      const BrowserWindow = require('electron').remote.BrowserWindow;

      const loadURL = appPath + "/dc/dcZip/zipEdit.html";
      console.log(loadURL);

      const windowID = BrowserWindow.getFocusedWindow().id;
      let win = new BrowserWindow({ width: 400, height: 300, center: true, parent : BrowserWindow.getFocusedWindow(), modal : true, show: false, resizable: false });

      win.loadURL(loadURL);

      win.webContents.on('did-finish-load', function () {
        win.webContents.send('get-data', windowID, data, self.state.colName);
      });
      win.on('closed', function () {
        win = null;
        $inputBox.focus();
      });

      win.show();
  },
  _modalHide: function(){

    this._changeLoadingSign(false);
    var $mdSearchResult = $(this.refs.mdSearchList);
    $mdSearchResult.modal('hide');
    var $inputBox = $(this.refs.xrxZipSrch_SearchInput);
    $inputBox.focus();

  },
  componentWillReceiveProps: function(nextProps) {
    if(nextProps.zipData && (this.props.zipData.zipCode !== nextProps.zipData.zipCode)){
        this.state.zipData.zipCode = nextProps.zipData.zipCode;
        this._loadData();
    }
  },
  render: function() {

   var borderColor = '#A9A9A9';
   if(((!this.state.isValid) || (this.state.isRequired && !this.state.zipData.zipCode)) ){
       borderColor = '#a94442';
   }

   if(this.state.showSelectedInfoBox)
   {
     return (

           <div style={{display: 'inline-block'}}>
               <div className="text-danger small">{this.props.error}</div>

               <div>
                 <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid', borderColor : borderColor}}>
                     <input type="text" ref="xrxZipSrch_SearchInput" name="xrxZipSrch_SearchInput" id="xrxZipSrch_SearchInput"  onChange={this._onTextChange} onKeyDown={this._onKeyDown} onDoubleClick={this._addNew}
                     placeholder={this.state.searchType}   style={{borderRadius: '2px 2px 2px 2px', borderStyle: 'none', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.width}} autoComplete="off" />
                     <button type='button' onClick={this._searchClick} style={{borderStyle: 'none', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}><i className="fa fa-search"></i></button>
                     <div style={{display:'inline-block'}}>
                         <div className="dropdown">
                             <button type='button' tabIndex="-1" className="dropdown-toggle" data-toggle="dropdown" style={{borderStyle: 'none', borderLeft: '1px solid #A9A9A9', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}><i className="fa fa-cog"></i>&nbsp;<i className="caret"></i></button>
                             <ul className="dropdown-menu"  tabIndex="-1">
                                 <li><a>Search by:</a></li>
                                 <li><a className="divider"></a></li>
                                 <li><a onClick={this._setSearchType.bind(this, this.props.zipSearchTypes.ZIPCODE)}>Zip Code</a></li>
                                 <li><a onClick={this._setSearchType.bind(this, this.props.zipSearchTypes.CITY)}>City</a></li>
                                 <li><a onClick={this._setSearchType.bind(this, this.props.zipSearchTypes.STATE)}>State</a></li>
                                 <li><a onClick={this._setSearchType.bind(this, this.props.zipSearchTypes.SHORTCODE)}>Short Code</a></li>
                             </ul>
                         </div>
                     </div>
                 </div>
                 <div style={{display: 'inline-block'}}>
                     <label className="text-muted small"  style={{marginLeft: '5px'}}>{this.state.selectedInfo}</label>
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
                                          <ZipSearchTable results={this.state.results} onSelect={this._setSelectedRecord}></ZipSearchTable>
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
   else
   {
        return (

          <div style={{display: 'inline-block'}}>

              <div className="text-danger small">{this.props.error}</div>
              <div>
                  <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid', borderColor : borderColor}}>
                      <input type="text" ref="xrxZipSrch_SearchInput" name="xrxZipSrch_SearchInput" id="xrxZipSrch_SearchInput"  onChange={this._onTextChange} onKeyDown={this._onKeyDown} onDoubleClick={this._addNew}
                      placeholder={this.state.searchType}   style={{borderRadius: '2px 2px 2px 2px', borderStyle: 'none', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.width}} autoComplete="off" />
                      <button type='button' onClick={this._searchClick} style={{borderStyle: 'none', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}><i className="fa fa-search"></i></button>
                      <div style={{display:'inline-block'}}>
                          <div className="dropdown">
                              <button type='button' tabIndex="-1" className="dropdown-toggle" data-toggle="dropdown" style={{borderStyle: 'none', borderLeft: '1px solid #A9A9A9', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}><i className="fa fa-cog"></i>&nbsp;<i className="caret"></i></button>
                              <ul className="dropdown-menu" tabIndex="-1">
                                  <li><a>Search by:</a></li>
                                  <li><a className="divider"></a></li>
                                  <li><a onClick={this._setSearchType.bind(this, this.props.zipSearchTypes.ZIPCODE)}>Zip Code</a></li>
                                  <li><a onClick={this._setSearchType.bind(this, this.props.zipSearchTypes.CITY)}>City</a></li>
                                  <li><a onClick={this._setSearchType.bind(this, this.props.zipSearchTypes.STATE)}>State</a></li>
                                  <li><a onClick={this._setSearchType.bind(this, this.props.zipSearchTypes.SHORTCODE)}>Shortcode</a></li>
                              </ul>
                          </div>
                      </div>
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
                                      <ZipSearchTable results={this.state.results} onSelect={this._setSelectedRecord}></ZipSearchTable>
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
  }

});

var ZipSearchTable = React.createClass ({
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
    render: function(){
        return  (
                    <Table
                        rowHeight={40}
                        rowsCount={this.state.results.length}
                        width={550}
                        height={300}
                        headerHeight={50}
                    >
                        <Column columnKey="RECNO" header={<Cell></Cell>} cell={<SearchSelectButton onSelect={this._clickSelect} />} width={50} fixed={true}/>
                        <Column columnKey="ZIPCODE" header={<Cell>Zip Code</Cell>} cell={this._renderSearchText} width={100} flex={1}/>
                        <Column columnKey="CITY" header={<Cell>City</Cell>} cell={this._renderSearchText} width={250} flex={1}/>
                        <Column columnKey="STATE" header={<Cell>State</Cell>} cell={this._renderSearchText} width={50} flex={1}/>
                        <Column columnKey="SHORTCODE" header={<Cell>Shortcode</Cell>} cell={this._renderSearchText} width={100} flex={1}/>
                    </Table>
                );
    }
});
