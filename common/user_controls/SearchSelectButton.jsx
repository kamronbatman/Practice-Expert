var remote = require('electron').remote;
var nodeModulesPath = remote.getGlobal('nodeModulesPath');
var React = require(nodeModulesPath + 'react');
var FixedDataTable = require(nodeModulesPath + 'fixed-data-table');
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var Cell = FixedDataTable.Cell;

var SearchSelectButton = React.createClass({
    propTypes: {
        onSelect: React.PropTypes.func.isRequired
    },
    getDefaultProps: function() {
        return {
            btnClassName: "btn btn-success btn-sm",
            spanClassName: "fa fa-check"
        };
    },
    getInitialState : function(){
        return {
            btnClassName: this.props.btnClassName,
            spanClassName: this.props.spanClassName
        };
    },
    _onSelect: function(event){
        event.preventDefault();
        if(this.props.onSelect){
            this.props.onSelect(this.props.rowIndex);
        }
    },
    render: function(){
        return (

            <Cell>
                <button className={this.state.btnClassName} onClick={this._onSelect}>
                    <span className={this.state.spanClassName}></span>
                </button>
            </Cell>
        );
    }
});

module.exports = SearchSelectButton;
