"use strict"

var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var React = require(nodeModulesPath + 'react');

var DateInput = React.createClass({

			propTypes: {
				name: React.PropTypes.string.isRequired,
				onChange: React.PropTypes.func.isRequired,
				onBlur: React.PropTypes.func,
				placeholder: React.PropTypes.string,
				maxLength: React.PropTypes.string,
				tabIndex : React.PropTypes.string,
				value: React.PropTypes.string,
				error: React.PropTypes.string
			},
			getDefaultProps: function() {
				    return {};
  		},
			render: function() {

				var borderColor = '#A9A9A9';
				if(this.props.error && this.props.error.length > 0){
					borderColor = '#a94442';
				}

				return (

					<div style={{display: 'inline-block'}}>
							<div className="text-danger small">{this.props.error}</div>
				    	<input type="date" ref={this.props.name} name={this.props.name} id={this.props.name}  value={this.props.value} onChange={this.props.onChange} tabIndex={this.props.tabIndex} placeholder={this.props.placeholder}  onBlur={this.props.onBlur} autoComplete="off"
								style={{borderRadius: '2px 2px 2px 2px', border: '1px solid #A9A9A9', backgroundColor: '#FCF5D8', width: this.props.width, padding: '2px 5px', borderColor : borderColor}} />
					</div>

				);

			}
});

module.exports = DateInput;
