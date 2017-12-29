//React
var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');
var React = require(nodeModulesPath + 'react');
var ReactDOM = require(nodeModulesPath + "react-dom");
//FixedDataTable
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;
//Other
var _ = require(nodeModulesPath + 'lodash');
var moment = require(nodeModulesPath + 'moment');
var SortTypes = require(appPath + '/common/global/sortTypes');
var DataListStore = require(appPath + '/common/global/dataListStore');
var cmGlb = remote.getGlobal('cmGlb');
var sqlInv = require(appPath + "/dc/xrxInventory/controllers/inventoryController.js");

var DictionaryTable = React.createClass({
getDefaultProps: function() {
    return {
        sortColumnName: "PARTNUMBER",
        sortDirection: SortTypes.ASC,
        searchText: "",
        searchType: "PARTNUMBER",
        tableWidth: 400,
        tableHeight:500,
        hideDeleted: false
    }
},
getInitialState: function() {
  return {
      size : 0,
      columnNameWidth : 100,
      sortBy: this.props.sortColumnName,
      sortType: this.props.sortDirection,
      searchText: this.props.searchText,
      searchType: this.props.searchType,
      dataList: new DataListStore(0),
      tableWidth: this.props.tableWidth,
      tableHeight: this.props.tableHeight,
      hideDeleted: this.props.hideDeleted
  }
},
componentWillMount: function(){

  this._getRowCount();
},
componentDidMount: function(){
    var self = this;
    setInterval(this._tableRefreshTimer, 3000);

    var win = window;
    if (win.addEventListener){
       win.addEventListener('resize', _.throttle(this._update, 250), false);
    }
    else if (win.attachEvent){
      win.attachEvent('onresize', _.throttle(this._update, 250));
    }
    else{
      win.onresize = this._update;
    }
    this._update();

    const ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.on('get-edit-data', function (event, data) {
      if(data && data.RECNO && data.RECNO.value){
        sqlRldx.rldxRowRecNo(data.RECNO.value, function(err, record){
          if(err){
              console.log(err);
          }
          else{
            if(record){
              self.state.dataList.setObject(record);
            }
          }
        });
      }
    });

    ipcRenderer.on('refresh-data', function (event) {
      location.reload();
    });
},
_tableRefreshTimer: function(){
      if(this.isMounted()){
        this.setState({sortType: this.state.sortType});
      }
},
_update: function(){
    if (this.isMounted()) {
      //var node = this.getDOMNode();//deprecated
      var node = ReactDOM.findDOMNode(this);
      this.setState({
        tableWidth  : node.clientWidth,
        tableHeight : this.props.tableHeight
      });
    }
},
componentWillReceiveProps: function(props){

    this._update();
},
componentWillUnmount: function(){
    var win = window;
    if(win.removeEventListener){
      win.removeEventListener('resize', _.throttle(this._update, 250), false);
    }
    else if(win.removeEvent){
        win.removeEvent('onresize', _.throttle(this._update, 250), false);
    }
    else{
        win.onresize = null;
    }
},
_getWhereClause: function(){
    var whereClause = " WHERE 1=1 ";
    if(this.state.searchText){
      if(this.state.searchType === "PARTNUMBER")
        whereClause += " AND PARTNUMBER LIKE '%" + this.state.searchText + "%'";
      else if(this.state.searchType === "DESCRIPTION")
        whereClause += " AND DESCRIPTION LIKE '%" + this.state.searchText + "%'";
      else if(this.state.searchType === "SERIALNUMBER")
        whereClause += " AND SERIALNUMBER LIKE '%" + this.state.searchText + "%'";
      else if(this.state.searchType === "DCTID")
        whereClause += " AND DCTID LIKE '%" + this.state.searchText + "%'";
      else if(this.state.searchType === "STATUS")
        whereClause += " AND STATUS LIKE '%" + this.state.searchText + "%'";
    }
    else if(!this.state.hideDeleted){
      whereClause += " AND DELETEDDATE IS NULL ";
    }
    return whereClause;
},
_getRowCount: function() {
    var self = this;
    sqlInv.xrxInventoryGetCount(this._getWhereClause() , function(err, count){
      if(err){
        console.log(err);
        self._setRowCount(0);
      }
      else{
        self._setRowCount(count);
      }
    });
},
_setRowCount: function(count) {
    console.log("**************************************************************************************count: "+count);
    this.setState({	size: count, dataList: new DataListStore(count, this._getWhereClause(), this.state.sortBy, this.state.sortType,  10, sqlInv.xrxInventoryGetList)});
    return;
},
_setSearchState: function(event)
{
    var field = event.target.name;
    var value = event.target.value;
    if(event.target.type === "checkbox"){
      value = event.target.checked;
      this.state.hideDeleted = value;
      this.setState({hideDeleted: this.state.hideDeleted});
      this._getRowCount();
    }
    else{
      this.state.searchText = value;
      return this.setState({searchText: this.state.searchText});
    }
},
_setSearchTypeState: function(type) {
    //var type = "";
    //type = event.target.value;
    this.state.searchType = type;
    return this.setState({searchText: '', searchType: this.state.searchType});
},
_search: function(event){
  if((event.type === "keyup" && event.which === 13) || (event.type === "click")){
    this._getRowCount();
  }
},
_onSortChange: function(columnKey, sortDir) {

  this.state.sortBy = columnKey;
  this.state.sortType = sortDir;
  this.setState({	sortBy: this.state.sortBy, sortType: this.state.sortType,
                 dataList: new DataListStore(this.state.size, this._getWhereClause(), this.state.sortBy, this.state.sortType,  10, sqlInv.xrxInventoryGetList)});
},
_buttonCell: function(props){
    var rowData = this.state.dataList.getObjectAt(props.rowIndex, true);//true to make the api call
    if(rowData){
      if(rowData.DELETEDDATE.value){
          return <Cell></Cell>;
      }
      else{
          return  <Cell><button className="btn btn-warning btn-sm" onClick={this._openEditWindow.bind(this, rowData[props.columnKey].value)}><span className="fa fa-pencil-square-o"></span></button></Cell>;
      }
    }
    else{
      return <Cell></Cell>;
    }
},
_dataCell: function(props){
    var rowData = this.state.dataList.getObjectAt(props.rowIndex, false);//false to avoid the api call
    if(rowData){
      return <Cell className="small">{rowData[props.columnKey].value}</Cell>;
    }
    else{
      return <Cell className="text-muted"><i className="fa fa-spinner fa-spin fa-1x fa-fw"></i></Cell>;
    }
},
_amortizeCell: function(props){
    var rowData = this.state.dataList.getObjectAt(props.rowIndex, false);//false to avoid the api call
    if(rowData){
      if(rowData[props.columnKey].value === '' || rowData[props.columnKey].value === undefined || rowData[props.columnKey].value === null){
        return <Cell className="small"><span className='glyphicon glyphicon-remove'></span></Cell>;
      }
      else if(rowData[props.columnKey].value){
        return <Cell className="small"><span className='glyphicon glyphicon-ok'></span></Cell>;
      }
      else{
        return <Cell className="small"><span className='glyphicon glyphicon-remove'></span></Cell>;
      }
    }
    else{
      return <Cell className="text-muted"><i className="fa fa-spinner fa-spin fa-1x fa-fw"></i></Cell>;
    }
},
_dateCell: function(props){
    var rowData = this.state.dataList.getObjectAt(props.rowIndex, false);//false to avoid the api call
    if(rowData){
      if(rowData[props.columnKey].value){
        var dateVal = moment(rowData[props.columnKey].value);
        dateVal.utc();
        var displayVal = dateVal.format('L');
        return <Cell className="small">{displayVal}</Cell>;
      }
      else{
        return <Cell className="text-muted"></Cell>;
      }

    }
    else{
      return <Cell className="text-muted"><i className="fa fa-spinner fa-spin fa-1x fa-fw"></i></Cell>;
    }
},
_openEditWindow: function(recNo){

  const BrowserWindow = require('electron').remote.BrowserWindow;
  const ipcRenderer = require('electron').ipcRenderer;

  const path = require('path');
  console.log(__dirname);
  const loadURL = path.join('file://', __dirname, 'edit.html');

  const windowID = BrowserWindow.getFocusedWindow().id;

  let win = new BrowserWindow({ width: 700, height: 700, center: true, parent : BrowserWindow.getFocusedWindow(), modal : true, show: false });

  win.loadURL(loadURL);

  var data = {recNo : recNo}

  win.webContents.on('did-finish-load', function () {
    win.webContents.send('get-data', windowID, data);
  });
  win.on('closed', function () {
    win = null
  });

  win.show();
},
render: function(){

            return (

          <div>
              <div className="row">
                <div className="row">
                  <div className="col-xs-3">
                    <button onClick={this._openEditWindow.bind(this, null)} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i>  Add New</button>
                  </div>
                  <div className="col-xs-6">
                    <SearchInput name="searchText" value={this.state.searchText} onChange={this._setSearchState} setSearchType={this._setSearchTypeState} onKeyUp={this._search} onClick={this._search} placeholder={this.state.searchType}
                      searchByList={[{name:"Search by Part Number", value:"PARTNUMBER"}, {name:"Search by Description", value:"DESCRIPTION"}, {name:"Search by Serial Number", value:"SERIALNUMBER"},
                      {name:"Search by Dct Id", value:"DCTID"}, {name:"Search by Status", value:"STATUS"}]}/>
                  </div>
                  <div className="col-xs-3 checkbox">
                    <label className="text-danger"><input type="checkbox" name="deletedCheckbox" ref="deletedCheckbox" onChange={this._setSearchState}></input>Show deleted</label>
                  </div>
                </div>
              </div>
              <div className="row">
                    <Table
                      rowHeight={40}
                      headerHeight={40}
                      rowsCount={this.state.size}
                      width={this.state.tableWidth}
                      height={this.state.tableHeight}>

                  <Column columnKey="RECNO" header={<Cell></Cell>} cell={this._buttonCell} width={40} fixed={true}/>

                  <Column columnKey="PARTNUMBER"
                   header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'PARTNUMBER' ? this.state.sortType : '')}>Part No.</SortHeaderCell>}
                   cell={this._dataCell} width={50} flexGrow={1}/>

                  <Column columnKey="DESCRIPTION"
                    header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'DESCRIPTION' ? this.state.sortType : '')}>Description</SortHeaderCell>}
                    cell={this._dataCell} width={150} flexGrow={1}/>

                    <Column columnKey="CPTCODE"
                     header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'CPTCODE' ? this.state.sortType : '')}>Cpt Code</SortHeaderCell>}
                     cell={this._dataCell} width={50} flexGrow={1}/>

                    <Column columnKey="SERIALNUMBER"
                     header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'SERIALNUMBER' ? this.state.sortType : '')}>Serial No.</SortHeaderCell>}
                     cell={this._dataCell} width={80} flexGrow={1}/>

                    <Column columnKey="STATUS"
                      header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'STATUS' ? this.state.sortType : '')}>Status</SortHeaderCell>}
                      cell={this._dataCell} width={50} flexGrow={1}/>

                    <Column columnKey="ORIGSERVICEDATE"
                       header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'ORIGSERVICEDATE' ? this.state.sortType : '')}>Orig. Serv. Date</SortHeaderCell>}
                       cell={this._dateCell} width={50} flexGrow={1}/>

                   <Column columnKey="COST"
                      header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'COST' ? this.state.sortType : '')}>Cost</SortHeaderCell>}
                      cell={this._dataCell} width={50} flexGrow={1}/>

                  <Column columnKey="RMA"
                     header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'RMA' ? this.state.sortType : '')}>RMA</SortHeaderCell>}
                     cell={this._dataCell} width={50} flexGrow={1}/>

                 <Column columnKey="DCTID"
                    header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'DCTID' ? this.state.sortType : '')}>Dct Id</SortHeaderCell>}
                    cell={this._dataCell} width={50} flexGrow={1}/>

                <Column columnKey="AMORTIZE"
                   header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'AMORTIZE' ? this.state.sortType : '')}>Amortize</SortHeaderCell>}
                   cell={this._amortizeCell} width={50} flexGrow={1}/>

                 <Column columnKey="DELETEDDATE"
                  header={<SortHeaderCell onSortChange={this._onSortChange} sortDir={(this.state.sortBy === 'DELETEDDATE' ? this.state.sortType : '')}>Delete Date</SortHeaderCell>}
                  cell={this._dateCell} width={50} flexGrow={1}/>
                </Table>
              </div>
          </div>
            );
        }
});

var initializeFixedDataTable  = function(){

	ReactDOM.render(<DictionaryTable ></DictionaryTable>, document.getElementById('divTable'));
};

initializeFixedDataTable();
