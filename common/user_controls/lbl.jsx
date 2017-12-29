var Lbl = React.createClass({

		propTypes: {

			labelFor: React.PropTypes.string,
		  width : React.PropTypes.string,
	    text: React.PropTypes.string,
			textVerticalAlign : React.PropTypes.string
		},
		getDefaultProps: function() {
		    return {
					textVerticalAlign : ''
				};
		},
		render: function() {

		  return (
        <label htmlFor={this.props.labelFor} style={{display: 'inline-block', textAlign : 'right', width: this.props.width, verticalAlign: this.props.textVerticalAlign}} className="small">{this.props.text}</label>
      );
		}
});

module.exports = Lbl;
