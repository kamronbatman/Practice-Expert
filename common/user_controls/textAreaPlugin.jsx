var TextAreaPlugin = React.createClass({

  propTypes: {

			name: React.PropTypes.string.isRequired,
			onChange: React.PropTypes.func.isRequired,
			onBlur: React.PropTypes.func,
      value: React.PropTypes.string,
      width : React.PropTypes.string,
      rows: React.PropTypes.string,
			placeholder: React.PropTypes.string,
		  error: React.PropTypes.string

	},
  getDefaultProps: function() {
      return {
        rows: '5'
      };
  },
  render: function() {

    var borderColor = '#A9A9A9';
    if(this.props.error && this.props.error.length > 0){
      borderColor = '#a94442';
    }
    
    return (

          <div style={{display: 'inline-block'}}>
            <div className="text-danger small">{this.props.error}</div>
            <textarea name={this.props.name} ref={this.props.name} id={this.props.name} value={this.props.value} onChange={this.props.onChange} onBlur={this.props.onBlur} rows={this.props.rows} placeholder={this.props.placeholder}
              style={{borderRadius: '2px 2px 2px 2px', border: '1px solid #A9A9A9', backgroundColor: '#FCF5D8', width: this.props.width, padding: '2px 5px', borderColor : borderColor}} autoComplete="off" />
          </div>
    );

  }

});
