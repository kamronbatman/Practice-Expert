var remote = require('electron').remote;
var appPath = remote.getGlobal('appPath');

var sqlEhrIcd = require(appPath + "/ehr/ehrIcdEdit/sqlEhrIcd.js");

var Icd9To10Row = React.createClass ({

    handleClick: function(e) {

        this.props.onIcdSelect(this.props.rowData.ICD10.value, this.props.rowData.ICD10DESC.value);
    },

    render: function(){

        return (

            <tr>
                <td><button type="button" id="btnIcd" name="btnIcd" onClick={this.handleClick} className="btn btn-success btn-sm"><span className="glyphicon glyphicon-ok"></span></button></td>
                <td>{this.props.rowData.ICD10.value}</td>
                <td>{this.props.rowData.ICD10DESC.value}</td>
            </tr>
        )
    }
});

var Icd9To10Table = React.createClass ({

             render: function(){

                    var divIcd9To10TableStyle = {

                        maxHeight : '200px',
                        overflow: 'scroll',
                        marginTop:'3px',
                        boxShadow: '5px 5px 5px #888888',
                         border: '3px solid darkgrey'
                    }


                    var onIcdSelect = this.props.onIcdSelect;
                    var rows = this.props.icd9to10SearchContent.map(function (row, i) {
                        return (

                          <Icd9To10Row key={i} rowData={row}  onIcdSelect={onIcdSelect}/>
                        );
                    });

                    return (
                        <div className="well well-sm ">
                             <button type="button" className="btn btn-danger btn-sm" onClick={this.props.handleCloseClick}><span className="glyphicon glyphicon-remove"> </span> Close</button>
                            <div  style={divIcd9To10TableStyle}>
                                <table ref="icd9To10Table" id="icd9To10Table"  className="table table-bordered table-condensed table-hover">
                                    <tbody>
                                        {rows}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                     )
              }
});

var Icd10MainRow = React.createClass ({

            handleClick: function(e) {

               this.props.onIcdSelect(this.props.rowData.ICDNAME.value, this.props.rowData.ICDDESC.value);
            },

            render: function(){

                  var searchValue = this.props.searchValue;

                  var pOr = searchValue.indexOf(",");
                  var pAnd = searchValue.indexOf("&");
                  if ((pOr != -1) && (pAnd != -1)) {
                      searchValue = searchValue.replace("&", " ");
                      pAnd = -1;
                  }
                  var s1 = '';
                  var s2 = '';
                  if (pOr != -1) {
                      var s1 = searchValue.substr(0, pOr).trim();
                      var s2 = searchValue.slice(pOr + 1).trim();
                  }
                  else if (pAnd != -1) {
                      var s1 = searchValue.substr(0, pAnd).trim();
                      var s2 = searchValue.slice(pAnd + 1).trim();
                  }
                  else {
                    s1 = searchValue;
                  }

                   var highlightSearch = function(desc) {
                        var regex1 = new RegExp(s1, "gi");
                        var highlightedSearch = desc.replace(regex1, '<span style="background-color: #FFFF66;">$&</span>');
                        if (s2 != '') {
                          var regex2 = new RegExp(s2, "gi");
                          highlightedSearch = highlightedSearch.replace(regex2, '<span style="background-color: #FFFF66;">$&</span>');
                        }
                        return  highlightedSearch;
                    };

                    return (

                         <tr>
                            <td><button type="button" id="btnIcd" name="btnIcd" onClick={this.handleClick} className="btn btn-info btn-sm"><span className="glyphicon glyphicon-search"></span></button></td>
                            <td dangerouslySetInnerHTML={{__html: highlightSearch(this.props.rowData.ICDNAME.value)}}></td>
                            <td dangerouslySetInnerHTML={{__html: highlightSearch(this.props.rowData.ICDDESC.value)}} ></td>
                         </tr>
                    )
            }
});

var Icd10MainTable = React.createClass({

            render: function(){

                var divMainTableStyle = {

                        height : '260px',
                        overflow: 'scroll',
                        marginTop:'3px',
                        boxShadow: '5px 5px 5px #888888',
                         border: '3px solid darkgrey'
                };


                var onIcdSelect = this.props.onIcdSelect;
                var searchValue = this.props.searchValue;
                var rows = this.props.primarySearchContent.map(function (row, i) {
                return (

                      <Icd10MainRow key={i} rowData={row} onIcdSelect={onIcdSelect} searchValue={searchValue} />
                    );
                });

                return (
                        <div className="well well-sm ">
                          <button type="button" className="btn btn-danger btn-sm" onClick={this.props.handleCloseClick}><span className="glyphicon glyphicon-remove"> </span> Close</button>   <span><strong>{searchValue}</strong></span>
                            <div  style={divMainTableStyle} >

                                <table ref="icd10MainTable" id="icd10MainTable"  className="table table-bordered table-condensed table-hover">

                                    <tbody>
                                        {rows}
                                    </tbody>

                                </table>
                        </div>
                        </div>
                );
            }
});

var Icd10SubRow = React.createClass ({

                handleClick: function(e) {

                   this.props.onIcdSelect(this.props.rowData.ICDNAME.value, this.props.rowData.ICDDESC.value, this.props.rowData.CHRONIC.value, this.props.rowData.SNOMED.value);

                },
                render: function(){
                        var searchValue = this.props.searchValue;
                        var pOr = searchValue.indexOf(",");
                        var pAnd = searchValue.indexOf("&");
                        if ((pOr != -1) && (pAnd != -1)) {
                            searchValue = searchValue.replace("&", " ");
                            pAnd = -1;
                        }
                        var s1 = '';
                        var s2 = '';
                        if (pOr != -1) {
                            var s1 = searchValue.substr(0, pOr).trim();
                            var s2 = searchValue.slice(pOr + 1).trim();
                        }
                        else if (pAnd != -1) {
                            var s1 = searchValue.substr(0, pAnd).trim();
                            var s2 = searchValue.slice(pAnd + 1).trim();
                        }
                        else {
                          s1 = searchValue;
                        }
                         var highlightSearch = function(desc) {
                              var regex1 = new RegExp(s1, "gi");
                              var highlightedSearch = desc.replace(regex1, '<span style="background-color: #FFFF66;">$&</span>');
                              if (s2 != '') {
                                var regex2 = new RegExp(s2, "gi");
                                highlightedSearch = highlightedSearch.replace(regex2, '<span style="background-color: #FFFF66;">$&</span>');
                              }
                              return  highlightedSearch;
                          };
                         return (

                             <tr>
                                <td><button type="button" id="btnIcd" name="btnIcd" onClick={this.handleClick} className="btn btn-success btn-sm"><span className="glyphicon glyphicon-ok"></span></button></td>
                                <td dangerouslySetInnerHTML={{__html: highlightSearch(this.props.rowData.ICDNAME.value)}}></td>
                                <td dangerouslySetInnerHTML={{__html: highlightSearch(this.props.rowData.ICDDESC.value)}}></td>
                             </tr>
                    )
                }
});

var Icd10SubTable = React.createClass({

          render: function(){


                var divSubTableStyle = {

                        height : '260px',
                        overflow: 'scroll',
                        marginTop:'3px',
                        boxShadow: '5px 5px 5px #888888',
                        border: '3px solid darkgrey'
                }

                var onIcdSelect = this.props.onIcdSelect;
                var searchValue = this.props.searchValue;
                var rows = this.props.secondarySearchContent.map(function (row, i) {
                return (

                      <Icd10SubRow key={i} rowData={row} onIcdSelect={onIcdSelect} searchValue={searchValue} />
                    );
                });


                 return (

                  <div className="well well-sm ">
                    <button type="button" className="btn btn-warning btn-sm"  onClick={this.props.handleBackClick}><span className="glyphicon glyphicon-circle-arrow-left"> </span> Back</button>   <span><strong>{this.props.icdMain}: {this.props.icdMainDesc}</strong></span>
                    <div  style={divSubTableStyle}>
                        <table ref="icd10SubTable" id="icdSub10Table"  className="table table-bordered table-condensed table-hover">
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                  </div>
                )
          }
});

var IcdSearch = React.createClass({

            getInitialState: function() {

                return {

                    chgCode: "",
                    chgName: "",
                    searchType: "",
                    primarySearchContent: [],
                    secondarySearchContent: [],
                    icd9to10SearchContent: [],
                    icdMain: "",
                    icdMainDesc: "",
                    isValidIcd: false
                };
            },

            getDefaultProps : function(){

                return {

                  textBoxStyle : {
                        backgroundColor: '#FCF5D8',
                        fontSize: '12px',
                        textTransform: 'uppercase'
                    }
                };
            },

            setStateOfProperties : function(chgCode, chgName, searchType, primarySearchContent, secondarySearchContent, icd9to10SearchContent, icdMain, icdMainDesc, isValidIcd)
            {

                this.setState({chgCode: chgCode, chgName: chgName, searchType: searchType, primarySearchContent: primarySearchContent, secondarySearchContent: secondarySearchContent, icd9to10SearchContent: icd9to10SearchContent, icdMain: icdMain, icdMainDesc: icdMainDesc, isValidIcd: isValidIcd});
            },

            handleChgCodeChange: function(event) {

                 var $mdPrimary = $(this.refs.mdIcdMainList);
                 var $mdSecondary = $(this.refs.mdIcdDirList);
                 var $mdIcd9to10 = $(this.refs.mdIcdMapList);


                 $mdPrimary.modal('hide');
                 $mdSecondary.modal('hide');
                 $mdIcd9to10.modal('hide');

                  this.setState({chgCode: event.target.value, chgName: "", searchType: "", primarySearchContent: [], secondarySearchContent: [], icd9to10SearchContent: [],
                    icdMain: "",
                    icdMainDesc: "",  isValidIcd: false});

                    //Change state of parent component using function as a proeprty.
                    if(this.props.onIcdChange)
                    {
                      this.props.onIcdChange(event.target.value, "",  false, "");
                    }
            },

            handleChgCodeKeyDown : function(event) {

                   var key = event.which;
                   if(key == '13' || key == '9' || key == '113')
                   {

                      var setStateOfProperties = this.setStateOfProperties;
                      var chgCode = this.state.chgCode;
                      var chgName = this.state.chgName;

                      var search = this.checkSqlEscapeCharater(chgCode);
                      var searchType = ReactDOM.findDOMNode(this.refs.chgCode).placeholder;

                      var $mdPrimary = $(this.refs.mdIcdMainList);
                      var $mdIcd9to10 = $(this.refs.mdIcdMapList);

                      if (searchType == "Search...")
                      {
                            var len = chgCode.length;
                            var firstCharIcdDesc = chgCode.charAt(0);
                            var numericPartIcdDesc = chgCode.substring(1, len - 1);
                            if (/^[a-zA-Z()]+$/.test(firstCharIcdDesc) && ($.isNumeric(numericPartIcdDesc))) {
                                searchType = "CODE";
                            }
                            else {
                                searchType = "DESCRIPTION";
                            }
                      }

                     this.state.searchType = searchType;

                     var self = this;

                     if(search)
                     {

                            sqlEhrIcd.icdGetDesc(search, function (err_message, record) {

                                if (err_message) {
                                    alert(err_message);
                                }
                                else if((record) && (record.length > 0))
                                {

                                   setStateOfProperties(record[0].ICDNAME.value, record[0].ICDDESC.value, "", [], [], [], "", "", true);

                                    //Change state of parent component using function as a proeprty.
                                    if(self.props.onIcdChange)
                                    {
                                       self.props.onIcdChange(record[0].ICDNAME.value, record[0].ICDDESC.value,  true, record[0].CHRONIC.value, record[0].SNOMED.value);
                                    }

                                }
                                else
                                {

                                         if(searchType == "ICD9")
                                         {

                                            sqlEhrIcd.searchICD10Map(search,  function (err_message, record) {

                                                    if (err_message != null) {
                                                        alert(err_message);
                                                    }
                                                    else {

                                                         setStateOfProperties(chgCode, chgName, searchType, [], [], record, "", "", false);
                                                         $mdIcd9to10.modal('show');

                                                    }
                                            });
                                        }
                                        else
                                        {

                                                sqlEhrIcd.searchPrimary(search, searchType, function (err_message, record) {

                                                if (err_message != null)
                                                {
                                                    alert(err_message);
                                                }
                                                else {

                                                    setStateOfProperties(chgCode, chgName, searchType, record, [], [], "", "", false);
                                                    $mdPrimary.modal('show');
                                                }
                                            });
                                      }

                                }
                            });
                     }
                   }
            },
            handleIcdPrimaryClick: function(icdMain, icdMainDesc){

                var chgCode = this.state.chgCode;
                var chgName = this.state.chgName;

                var searchType = this.state.searchType;

                var primarySearchContent = this.state.primarySearchContent;

                var setStateOfProperties = this.setStateOfProperties;

                var $mdSecondary = $(this.refs.mdIcdDirList);

                sqlEhrIcd.searchSecondary(icdMain, searchType, function (err_message, record) {

                        if (err_message != null) {
                            alert(err_message);
                        }
                        else {

                           setStateOfProperties(chgCode, chgName, searchType, primarySearchContent, record, [],  icdMain, icdMainDesc, false);
                           $mdSecondary.modal('show');

                        }
                });
            },

            handleIcdSecondaryClick: function(icd, icdDesc, chronic, SNOMED){

              var $mdSecondary = $(this.refs.mdIcdDirList);
              $mdSecondary.modal('hide');

              var $mdPrimary = $(this.refs.mdIcdMainList);
              $mdPrimary.modal('hide');

              this.setState({chgCode: icd, chgName: icdDesc, SNOMED: SNOMED, searchType: "", primarySearchContent: [],  secondarySearchContent: [], icd9to10SearchContent: [], icdMain: "", icdMainDesc: "", isValidIcd: true});

               //Change state of parent component using function as a proeprty.
                if(this.props.onIcdChange)
                {
                    this.props.onIcdChange(icd, icdDesc,  true, chronic, SNOMED);
                }



              var $chgCode = $(this.refs.chgCode);
              $chgCode.focus();
            },

            handleIcd9To10Click: function(icd, icdDesc){

              var $mdIcd9to10 = $(this.refs.mdIcdMapList);
              $mdIcd9to10.modal('hide');

              this.setState({chgCode: icd, chgName: icdDesc, searchType: "", primarySearchContent: [],  secondarySearchContent: [], icd9to10SearchContent: [], icdMain: "", icdMainDesc: "", isValidIcd: true});

               //Change state of parent component using function as a proeprty.
              if(this.props.onIcdChange)
              {
                  this.props.onIcdChange(icd, icdDesc,  true, false, "");
              }


              var $chgCode = $(this.refs.chgCode);
              $chgCode.focus();
            },

            componentDidMount: function() {

                var self = this;
                var setStateOfProperties = this.setStateOfProperties;

                if(this.props.initChgCode)
                {
                    var chgCode = this.props.initChgCode;
                    sqlEhrIcd.icdGetDesc(chgCode, function (err_message, record) {

                        if (err_message) {
                            alert(err_message);
                        }
                        else if((record) && (record.length > 0))
                        {
                           setStateOfProperties(record[0].ICDNAME.value, record[0].ICDDESC.value, "", [], [], [], "", "", true);

                            //Change state of parent component using function as a proeprty.
                            if(self.props.onIcdChange)
                            {
                              self.props.onIcdChange(record[0].ICDNAME.value, record[0].ICDDESC.value,  true, record[0].CHRONIC.value, record[0].SNOMED.value);
                            }
                        }

                  });
                }
            },
            componentWillReceiveProps: function(nextProps) {

                var self = this;
                var setStateOfProperties = this.setStateOfProperties;


                if((self.props.initChgCode != nextProps.initChgCode))
                {

                    var chgCode = nextProps.initChgCode;
                    sqlEhrIcd.icdGetDesc(chgCode, function (err_message, record) {

                        if (err_message) {
                            alert(err_message);
                        }
                        else if((record) && (record.length > 0))
                        {

                            setStateOfProperties(record[0].ICDNAME.value, record[0].ICDDESC.value, "", [], [], [], "", "", true);
                            //Change state of parent component using function as a proeprty.
                            if(self.props.onIcdChange)
                            {
                              self.props.onIcdChange(record[0].ICDNAME.value, record[0].ICDDESC.value,  true, record[0].CHRONIC.value, record[0].SNOMED.value);
                            }

                        }
                        else
                        {
                           setStateOfProperties(chgCode, "", "", [], [], [], "", "", true);
                        }

                  });
                }
            },
            setSearchType: function(type) {

                    this.setState({chgCode: "", chgName: "", searchType: "", primarySearchContent: [], secondarySearchContent: [], icd9to10SearchContent: [], icdMain: "", icdMainDesc: "", isValidIcd: false});

                    //Change state of parent component using function as a proeprty.
                    if(this.props.onIcdChange)
                    {
                       this.props.onIcdChange("", "",  false);
                    }


                    ReactDOM.findDOMNode(this.refs.chgCode).placeholder = type;
                    this.state.searchType = type;
                    var $chgCode = $(this.refs.chgCode);
                    $chgCode.focus();
            },
            handlePrimaryCloseClick: function(){

                var $mdPrimary = $(this.refs.mdIcdMainList);
                $mdPrimary.modal('hide');

                this.setState({chgCode: "", chgName: "", searchType: "", primarySearchContent: [], secondarySearchContent: [], icd9to10SearchContent: [], icdMain: "", icdMainDesc: "",  isValidIcd: false});

                 //Change state of parent component using function as a proeprty.
                  if(this.props.onIcdChange)
                  {
                      this.props.onIcdChange("", "",  false);
                  }

                var $chgCode = $(this.refs.chgCode);
                $chgCode.focus();
            },
            handleIcd9T010CloseClick: function(){

                var $mdIcd9to10 = $(this.refs.mdIcdMapList);
                $mdIcd9to10.modal('hide');

                this.setState({chgCode: "", chgName: "", searchType: "", primarySearchContent: [], secondarySearchContent: [], icd9to10SearchContent: [], icdMain: "", icdMainDesc: "", isValidIcd: false});

                 //Change state of parent component using function as a proeprty.
                  if(this.props.onIcdChange)
                  {
                      this.props.onIcdChange("", "",  false);
                  }


                var $chgCode = $(this.refs.chgCode);
                $chgCode.focus();
            },
            handleBackClick: function(){

                var $mdSecondary = $(this.refs.mdIcdDirList);
                $mdSecondary.modal('hide');

               var divPrimaryStyle = {
                         paddingLeft: '25px',
                         paddingRight: '30px',
                         display: 'block'
                };
                var divSecondaryStyle = {
                        display: 'none'
                };

                var divicd9to10Style = {
                        display: 'none'
                };


                this.setState({secondarySearchContent: [], icd9to10SearchContent: [], divPrimaryStyle: divPrimaryStyle, divSecondaryStyle: divSecondaryStyle, divicd9to10Style: divicd9to10Style, icdMain: "", icdMainDesc: "", isValidIcd: false});
            },
            checkSqlEscapeCharater: function(sqlValue) {
                var escapeSqlValue = "";
                if (sqlValue) {
                    escapeSqlValue = sqlValue.replace(new RegExp("'", 'g'), "''");
                }
                return escapeSqlValue;
            },

            render: function(){

              var borderColor = '#A9A9A9';
              if(this.props.error){
                borderColor = '#a94442';
              }

              return (

                      <div style={{display: 'inline-block'}}>

                          <div style={{display: 'inline-block'}}>
                            <div className="text-danger small">{this.props.error}</div>
                            <div>
                              <input type="hidden" ref="hdnChgCode" id="hdnChgCode" name="hdnChgCode" value={((this.state.isValidIcd) ? this.state.chgCode : '')}  />
                              <div style={{display: 'inline-block', borderRadius: '2px 2px 2px 2px', border: '1px solid #A9A9A9', borderColor : borderColor}}>
                                <input type="text" ref="chgCode" id="chgCode" name="chgCode" value={this.state.chgCode}   maxLength="25" placeholder="Search..." onChange={this.handleChgCodeChange} onKeyDown={this.handleChgCodeKeyDown}
                                style={{borderRadius: '2px 2px 2px 2px', borderStyle: 'none', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.width}} autoComplete="off" />
                                <div style={{display:'inline-block'}}>
                                    <div className="dropdown">
                                        <button type="button" className="dropdown-toggle" data-toggle="dropdown"
                                          style={{borderStyle: 'none', borderLeft: '1px solid #A9A9A9', borderRadius: '2px 2px 2px 2px', padding: '2px 5px'}} >
                                            <span className="glyphicon glyphicon-cog"> </span> <span className="caret"> </span>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a href="#" onClick={this.setSearchType.bind(this,"CODE")}>Search by ICD Code</a></li>
                                            <li><a href="#" onClick={this.setSearchType.bind(this,"DESCRIPTION")}>Search by ICD Description</a></li>
                                            <li><a href="#" onClick={this.setSearchType.bind(this,"ICD9")}>Search by ICD9</a></li>
                                        </ul>
                                    </div>
                                </div>
                              </div>
                              <div style={{display: 'inline-block'}}>
                                <input type="text" ref="chgName" id="chgName" name="chgName" value={this.state.chgName} maxLength="100"
                                style={{borderRadius: '2px 2px 2px 2px', border: '1px solid #A9A9A9', backgroundColor: '#FCF5D8', padding: '2px 5px', width: this.props.descWidth}}
                                disabled />
                              </div>
                            </div>
                          </div>


                          <div className="row" style={this.props.searchDivStyle}>
                              <div className="row">
                                  <div className="modal" id="mdIcdMainList" ref="mdIcdMainList">
                                      <div className="modal-dialog modal-lg">
                                          <div className="modal-content">
                                              <div id="mdIcdMainListBody" className="modal-body">
                                                  <Icd10MainTable searchValue={this.state.chgCode}  primarySearchContent={this.state.primarySearchContent} onIcdSelect={this.handleIcdPrimaryClick}  handleCloseClick={this.handlePrimaryCloseClick} />
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="row">
                                  <div className="modal" id="mdIcdDirList" ref="mdIcdDirList">
                                              <div className="modal-dialog modal-lg">
                                                  <div className="modal-content">
                                                      <div id="mdIcdDirListBody" className="modal-body">
                                                          <Icd10SubTable searchValue={this.state.chgCode} secondarySearchContent={this.state.secondarySearchContent} onIcdSelect={this.handleIcdSecondaryClick} icdMain={this.state.icdMain} icdMainDesc={this.state.icdMainDesc} handleBackClick={this.handleBackClick} />
                                                        </div>
                                                  </div>
                                              </div>
                                  </div>
                              </div>
                              <div className="row">
                                   <div className="modal" id="mdIcdMapList" ref="mdIcdMapList">
                                      <div className="modal-dialog modal-lg">
                                          <div className="modal-content">
                                              <div id="mdIcdMapListBody" className="modal-body">
                                                    <Icd9To10Table    icd9to10SearchContent={this.state.icd9to10SearchContent} onIcdSelect={this.handleIcd9To10Click}  handleCloseClick={this.handleIcd9T010CloseClick} />
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>


                      </div>

                   )
            }
});
