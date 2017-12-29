var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var React = require(nodeModulesPath + 'react');

var DropdownPlugin = React.createClass({

	propTypes: {
		name: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired,
		dropdownOptions: React.PropTypes.array.isRequired,
		value: React.PropTypes.string,
		error: React.PropTypes.string
	},
	getDefaultProps: function() {
		    return {
		      textBoxClass: 'col-sm-10',
		      inputFieldstyle: {
		      	backgroundColor: '#FCF5D8',
		      	textTransform: 'uppercase'
		      },
		      errMessageStyle:{
		        fontSize: 'x-small'
		      }
		    };
		},
	render: function() {
		var borderColor = '#A9A9A9';

		if(this.props.error && this.props.error.length > 0){
			borderColor = '#a94442';
		}

		var self = this;
		var options = this.props.dropdownOptions.map(function(dropdownProps, index){
            return <option key={self.props.name+index} value={dropdownProps.value}>{dropdownProps.text}</option>
        });

		return (
			<div style={{display: 'inline-block'}}>
				 <div className="text-danger small" style={this.props.errMessageStyle}>{this.props.error}</div>
				 <select name={this.props.name} ref={this.props.name} id={this.props.name}
				 value={this.props.value} onChange={this.props.onChange} style={{borderRadius: '2px 2px 2px 2px', border: '1px solid #A9A9A9', backgroundColor: '#FCF5D8', width: this.props.width, padding: '2px 5px', borderColor : borderColor}}>
				 {options}
				 </select>
			</div>
		);
	}
});

module.exports = DropdownPlugin;
