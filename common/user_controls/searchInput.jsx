
"use strict"

var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var React = require(nodeModulesPath + 'react');

var SearchInput = React.createClass({

	propTypes: {
		name: React.PropTypes.string.isRequired,
		value: React.PropTypes.string,
		placeholder: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
		onClick: React.PropTypes.func.isRequired,
		onKeyUp: React.PropTypes.func.isRequired,
		setSearchType: React.PropTypes.func.isRequired,
		searchByList: React.PropTypes.array,
		onBlur: React.PropTypes.func,
		maxLength: React.PropTypes.string
	},

	render: function() {

			var self = this;
			var listItems = this.props.searchByList.map(function (listItem, i) {
				return (
                    <li key={i}><a href="#" onClick={self.props.setSearchType.bind(null, listItem.value)}>{listItem.name}</a></li>
                );
            });

			return (
				<div className="input-group">
	               <input type="text" name={this.props.name} ref={this.props.name} placeholder={this.props.placeholder} onChange={this.props.onChange}
	               onBlur={this.props.onBlur} value={this.props.value} onKeyUp={this.props.onKeyUp} className="form-control" />

	               <div className="input-group-btn">
		               <a name="btnSearchInput" ref="btnSearchInput" className="btn btn-primary" onClick={this.props.onClick}>
		                   &nbsp;<span className="fa fa-search"></span>
		               </a>
		               <a className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
		                   <span className="fa fa-cog"></span> <span className="caret"></span>
		               </a>
		            	<ul className="dropdown-menu">
		                	{listItems}
		            	</ul>
	            	</div>
	            </div>
	        );
	}

});

module.exports = SearchInput;
