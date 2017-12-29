var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;
var toastr = require(nodeModulesPath + 'toastr');
var sqlClsSearch = require(appPath + "/dc/dcCls/sqlClsSearch.js");

var ClsSearch = React.createClass ({

      getDefaultProps: function() {

          return {
            clsDesc: '',
            clsCat: '',
            isValid: true,
            isRequired: false,
            error: '',
            inputBoxStyle: {
                fontSize: "x-small",
                backgroundColor: '#FCF5D8',
                textTransform: 'uppercase'
            },
            errMessageStyle: {
                fontSize: 'x-small'
            }
          };
      },
      getInitialState : function() {
          return {
            clsDesc: this.props.clsDesc,
            clsCat: this.props.clsCat,
            isRequired: this.props.isRequired,
            isValid: this.props.isValid,
            results: [],
            error: this.props.error
        };
      },
      componentWillMount: function() {
      },
      componentDidMount: function() {
          this._loadData();
      },
      _loadData: function() {

        var searchText = this.state.clsDesc;
        if(searchText)
        {
            var self = this;

            sqlClsSearch.clsSearch(self.state.clsCat, searchText, function(err, record) {

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
      _onKeyDown: function(event) {
            var key = event.which;

            if(key == '13' || key == '9'){
                this._search();
            }
            else if ( key == '113') {
              this._clickSearch();
            }
            else if(key == '118'){
                this._addNew();
            }
      },
      _search: function() {

        var $inputBox = $(this.refs.xrxClsSrch_SearchInput);
        var searchText = $inputBox.val();

        this.setState({results: []});

        if(searchText)
        {
            //Call Function Search
            var self = this;

            sqlClsSearch.clsExists(self.state.clsCat, searchText, function(err, record) {


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

                sqlClsSearch.clsSearch(self.state.clsCat, searchText, function(err, record) {

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
      _clickSearch : function(){

        var $inputBox = $(this.refs.xrxClsSrch_SearchInput);
        var searchText = $inputBox.val();

        this.setState({results: []});
        //Call Function Search
        var self = this;
        sqlClsSearch.clsSearch(self.state.clsCat, searchText, function(err, record) {

            if(err)
            {
              console.log(err);
            }
            else
            {
              self._showResultModal(record);
            }
        });




      },
      _onTextChange: function() {

        var $inputBox = $(this.refs.xrxClsSrch_SearchInput);
        var searchText = $inputBox.val();

        if(!searchText) {
            this.props.onSelect("", false);
            this.setState({clsDesc: "", isValid: true});
        }
        else if(this.state.clsDesc !== searchText) {
            this.props.onSelect(searchText, false);
            this.setState({isValid: false});
        }
        else {
            this.props.onSelect(searchText, true);
            this.setState({isValid: true});
        }

      },
      _showResultModal: function(recordList) {
        var $mdSearchResult = $(this.refs.mdSearchList);
        $mdSearchResult.modal('show');
        this.setState({results: recordList});
      },
      _removeSelectedRecord: function(record)
      {
        var $mdSearchResult = $(this.refs.mdSearchList);
        $mdSearchResult.modal('hide');
        var self = this;
        sqlClsSearch.clsDelete(self.state.clsCat, record.CLSDESC.value, function(err, record)
        {
            if(err)
            {
              bootbox.alert("Error deleting data.", function () {});
            }
            else
            {
              toastr.warning('Data deleted.');
              self._search();
            }
        });
        this.setState({clsDesc: record.CLSDESC.value, isValid: true});
      },
      _setSelectedRecord: function(record)
      {
        var $mdSearchResult = $(this.refs.mdSearchList);
        if($mdSearchResult.hasClass('in'))
        {
          $mdSearchResult.modal('hide');
          var $xrxClsSrch_SearchInput = $(this.refs.xrxClsSrch_SearchInput);
          $xrxClsSrch_SearchInput.focus();
        }


        this.refs.xrxClsSrch_SearchInput.value = record.CLSDESC.value;
        this.props.onSelect(record.CLSDESC.value, true);

        this.setState({clsDesc: record.CLSDESC.value, isValid: true, results: []});
      },
      _addNew: function() {

        var $inputBox = $(this.refs.xrxClsSrch_SearchInput);
        var searchText = $inputBox.val().trim().toUpperCase();
        var self = this;

        if(searchText)
        {
          sqlClsSearch.clsSave(self.state.clsCat, searchText, function(err, record) {

              if(err)
              {
                bootbox.alert("Error saving data.", function () {});
              }
              else
              {
                toastr.success('Data saved.');
                self.props.onSelect(searchText, true);
                self.setState({clsDesc: searchText, isValid: true});
              }


          });
        }


      },
      componentWillReceiveProps: function(nextProps) {
          if(nextProps.clsDesc && (this.state.clsDesc !== nextProps.clsDesc)){
              this.state.clsDesc = nextProps.clsDesc;
              this._loadData();
          }
      },
      _modalHide: function(){


        var $mdSearchResult = $(this.refs.mdSearchList);
        $mdSearchResult.modal('hide');
        var $inputBox = $(this.refs.xrxClsSrch_SearchInput);
        $inputBox.focus();

      },
      render: function() {

        var borderColor = '#A9A9A9';
        if((!this.state.isValid) || (this.state.isRequired && !this.state.clsDesc)){
            borderColor = '#a94442';
        }

        return (

          <div style={{display: 'inline-block'}}>
              <div className="text-danger small">{this.props.error}</div>
              <div>
                <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid', borderColor : borderColor}}>
                  <input type="text" ref="xrxClsSrch_SearchInput" name="xrxClsSrch_SearchInput" id="xrxClsSrch_SearchInput" maxLength="20" onChange={this._onTextChange} onKeyDown={this._onKeyDown} onDoubleClick={this._search}
                  style={{borderRadius: '2px 2px 2px 2px', borderStyle: 'none', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.width}} autoComplete="off" />
                  <button type="button" onClick={this._clickSearch} style={{borderStyle: 'none', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}}><i className="fa fa-search"></i></button>
                </div>
              </div>
              <div className="modal" id="mdSearchList" ref="mdSearchList">
                    <div className="modal-dialog modal-sm">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={this._modalHide}>×</button>
                                <h4 className="modal-title">Search results:</h4>
                            </div>
                            <div id="mdSearchListBody" className="modal-body">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <ClsSearchTable results={this.state.results} onSelect={this._setSelectedRecord} onDelete={this._removeSelectedRecord}></ClsSearchTable>
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

var ClsSearchTable = React.createClass ({
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
            this.props.onSelect(this.state.results[rowIndex]);
        }
    },
    _clickDelete: function(rowIndex){
        if(this.state.results[rowIndex]){
        	var self = this;
            bootbox.confirm("This record will be permanently deleted and cannot be recovered. Are you sure?", function (result) {
            	if(result){
            		self.props.onDelete(self.state.results[rowIndex]);
            	}
            });
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
                        width={260}
                        height={300}
                        headerHeight={50}
                    >
                        <Column columnKey="CLSDESC" header={<Cell></Cell>} cell={<SearchSelectButton onSelect={this._clickSelect} />} width={50} fixed={true}/>
                        <Column columnKey="CLSDESC" header={<Cell></Cell>}
                        cell={<SearchSelectButton onSelect={this._clickDelete} btnClassName={"btn btn-danger btn-sm"} spanClassName={"fa fa-minus-circle"}/>}
                        width={50} fixed={true}/>
                        <Column columnKey="CLSDESC" header={<Cell>Description</Cell>} cell={this._renderSearchText} width={160} flex={1}/>
                    </Table>
                );
    }
});
