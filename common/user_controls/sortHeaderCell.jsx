"use strict"
var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var appPath = remote.getGlobal('appPath');

var React = require(nodeModulesPath + 'react');
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Cell = FixedDataTable.Cell;
var SortTypes = require(appPath + '/common/global/sortTypes');

var SortHeaderCell = React.createClass({
	propTypes: {
		sortDir: React.PropTypes.string,
		onSortChange: React.PropTypes.func.isRequired
	},
	_onSortChange: function(event){
		event.preventDefault();
		if (this.props.onSortChange) {
			this.props.onSortChange(this.props.columnKey, this.props.sortDir ?  this._reverseSortDirection(this.props.sortDir) : SortTypes.DESC);
	    }
	},
	_reverseSortDirection: function(sortDir) {
  		return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
	},
	render: function(){
		return(	<Cell>
							<a onClick={this._onSortChange} href="#">
	          			{this.props.children} {this.props.sortDir ? (this.props.sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
	        		</a>
        		</Cell>);
	}
});

module.exports = SortHeaderCell;
