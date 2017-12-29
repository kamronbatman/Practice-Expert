"use strict"

var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var React = require(nodeModulesPath + 'react');

var CheckboxInput = React.createClass({

  propTypes: {
		name: React.PropTypes.string.isRequired,
    width: React.PropTypes.string,
		onChange: React.PropTypes.func.isRequired,
    labelName : React.PropTypes.string,
		checked: React.PropTypes.bool,
    error: React.PropTypes.string
	},
  getDefaultProps: function() {

    return {};

  },
  render: function() {

    return (
      <div style = {{display: 'inline-block'}}>
        <div className="text-danger small">{this.props.error}</div>
        <div className="checkbox" style={{marginTop : '0px', marginBottom : '0px', width : this.props.width}}>
            <label><input type="checkbox" name={this.props.name} ref={this.props.name} id={this.props.name} checked={this.props.checked} onChange={this.props.onChange} />{this.props.labelName}</label>
        </div>
      </div>
    );

  }
});
