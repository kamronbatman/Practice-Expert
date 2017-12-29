var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

var sqlIns = require(appPath + "/dc/dcIns/sqlIns.js");

var InsSearch = React.createClass({

  getDefaultProps: function() {
      return {
          insSearchData: {},
          isRequired: false,
          isValid: true,
          isLoading: false,
          showSelectedInfoBox: true,
          showError: true,
          error: '',
          insSearchTypes : { NAME:    'NAME', SHORTCODE :      'SHORTCODE'},
          colName: ""

      };
  },
  getInitialState: function() {

      return {
          insSearchData: this.props.insSearchData,
          isRequired: this.props.isRequired,
          searchType: this.props.insSearchTypes.NAME,
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

        var searchText = this.state.insSearchData.NAME;
        if(searchText)
        {
            var self = this;

            sqlIns.insExists(searchText, null, function(err, record) {

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
  _setSearchType: function(type)
  {
      var $inputBox = $(this.refs.insSearchInput);
      $inputBox.val("");
      $inputBox.focus();
      this.props.onSelect({recno : '', name: '', shortCode: ''}, false);
      this.setState({insSearchData : {recno: '', name:'', shortCode: ''}, searchType: type, selectedInfo: ""});
  },
  _onKeyDown: function(event){
        var key = event.which;
        if(key == '13' || key == '9' || key == '113')
        {
            var $insSearchhInput = $(this.refs.insSearchhInput);
            $insSearchhInput.focus();
            this._search();
        }
        else if(key == '118')
        {
            this._addNew();
        }
  },
  _search: function(event)
  {
      var $inputBox = $(this.refs.insSearchInput);
      var searchText = $inputBox.val().trim();

      var searchTypeColumn = "INSNAME";
      if(this.state.searchType === this.props.insSearchTypes.SHORTCODE)
        searchTypeColumn = "SHORTCODE";

      this.state.results = [];
      var self = this;

      if(searchText)
      {

          sqlIns.insExists(searchText, null, function(err, record) {

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
              sqlIns.insSearch(searchText, searchTypeColumn, function(err, record){

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
                    var r = confirm("Record does not exsists with this name/short code. Please add new.");
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
      var $inputBox = $(this.refs.insSearchInput);
      var searchText = $inputBox.val().trim();

      if(!searchText)
      {
          this.props.onSelect({recno:'', name:'', shortCode:''}, true);
          this.setState({insSearchData: {recno:'', name:'', shortCode:''}, selectedInfo: "", isValid: true, showError: false});
      }
      else if(this.state.insSearchData.name !== searchText)
      {
          this.props.onSelect(this.state.insSearchData, false);
          this.setState({isValid: false, showError: true});
      }
      else
      {
        this.props.onSelect(this.state.insSearchData, true);
        this.setState({isValid: true, showError: false});
      }
  },
  _showResultModal: function(recordList)
   {
     var $mdSearchResult = $(this.refs.mdSearchList);
     $mdSearchResult.modal('show');
     this.setState({results: recordList});
   },
  _setSelectedRecord: function(record){
    var $mdSearchResult = $(this.refs.mdSearchList);
    if($mdSearchResult.hasClass('in'))
    {
      $mdSearchResult.modal('hide');
      var $insSearchInput = $(this.refs.insSearchInput);
      $insSearchInput.focus();
    }


    var selectedInsData = {};
    selectedInsData.recno = record.RECNO.value;
    selectedInsData.name = record.INSNAME.value;
    selectedInsData.shortCode = record.SHORTCODE.value;

    this.refs.insSearchInput.value = record.INSNAME.value;
    this.props.onSelect(selectedInsData, true);

    var selectedInfo = "";
    this.setState({insSearchData: selectedInsData, selectedInfo: selectedInfo, isValid: true});
  },
  _addNew: function() {},
  _modalHide: function() {
      var $mdSearchResult = $(this.refs.mdSearchList);
      $mdSearchResult.modal('hide');
      var $inputBox = $(this.refs.insSearchInput);
      $inputBox.focus();
  },
  componentWillReceiveProps: function(nextProps) {
    if(nextProps.insSearchData && (this.props.insSearchData.name !== nextProps.insSearchData.name)){
        //this.props.zipData.zipcode = nextProps.zipData.zipcode;
        this.state.insSearchData.name = nextProps.insSearchData.name;
        this._loadData();
    }
  },
  render: function(){


    var borderColor = '#A9A9A9';
    if(this.state.showError && ((!this.state.isValid) || (this.state.isRequired && !this.state.insSearchData.name)) ){
           borderColor = '#a94442';
    }

    return (

        <div style={{display: 'inline-block'}}>
            <div className="text-danger small">{this.props.error}</div>
            <div>
                <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid', borderColor : borderColor}}>
                    <input ref="insSearchInput" name="insSearchhInput" id="insSearchInput"   onChange={this._onTextChange} onKeyDown={this._onKeyDown} onDoubleClick={this._addNew}
                     placeholder={this.state.searchType} tabIndex = {this.props.tabIndex} style={{borderRadius: '2px 2px 2px 2px', borderStyle: 'none', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.width}} autoComplete="off" />
                    <button type='button' onClick={this._search} style={{borderStyle: 'none', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}>&nbsp;<i className="fa fa-search"></i></button>
                    <div style={{display:'inline-block'}}>
                       <div className="dropdown">
                           <button type='button' tabIndex="-1" className="dropdown-toggle" data-toggle="dropdown" style={{borderStyle: 'none', borderLeft: '1px solid #A9A9A9', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}><i className="fa fa-cog"></i>&nbsp;<i className="caret"></i></button>
                           <ul className="dropdown-menu" tabIndex="-1">
                               <li><a>Search by:</a></li>
                               <li><a className="divider"></a></li>
                               <li><a onClick={this._setSearchType.bind(this, this.props.insSearchTypes.NAME)}>Name</a></li>
                               <li><a onClick={this._setSearchType.bind(this, this.props.insSearchTypes.SHORTCODE)}>Short Code</a></li>
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
                                    <InsSearchTable results={this.state.results} onSelect={this._setSelectedRecord}></InsSearchTable>
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
  },
  componentDidMount : function()
  {
    this._loadData();
  }


});

var InsSearchTable = React.createClass ({

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
      return <Cell><button type="button" className="btn btn-success" onClick={this._clickSelect.bind(this, props.rowIndex)}><span className="fa fa-check"></span></button></Cell>;
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
                        <Column columnKey="INSNAME" header={<Cell>Name</Cell>} cell={this._renderSearchText} width={300} flex={1}/>
                        <Column columnKey="SHORTCODE" header={<Cell>Short Code</Cell>} cell={this._renderSearchText} width={125} flex={1}/>
                    </Table>
                );
    }
});
