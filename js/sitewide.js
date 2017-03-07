var FirstComponent = React.createClass({
	propTypes: {
		firstName: React.PropTypes.string.isRequired,
		middleName: React.PropTypes.string,
		lastName: React.PropTypes.string.isRequired,
		age: React.PropTypes.number,
	},

	getDefaultProps: function() {
		return {
			middleName: '',
			age: 5,
		};
	},

	render: function() {
		return React.DOM.span(null, 'Blah, bliggetty blah blah blah... says ' + 
			this.props.firstName + ' ' +
			this.props.middleName + ' ' +
			this.props.lastName + ' ' +
			this.props.age
		);
	}
});

var TextAreaCounter = React.createClass({
	propTypes: {
		text: React.PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			text: '',
		};
	},

	getInitialState: function() {
		return {
			text: this.props.text,
		};
	},

	_textChange: function(ev) {
		this.setState({
			text: ev.target.value,
		});
	},

	render: function() {
		return React.DOM.div(null,
			React.DOM.textarea({
				value: this.state.text,
				onChange: this._textChange,
			}),
			React.DOM.h3(null, this.state.text.length)
		);
	},
});

ReactDOM.render(
	/*React.DOM.h1(
		{ 
			id: 'heading',
			style: {
				color: 'red',
				fontFamily: 'Verdana, sans-serif', 
				textTransform: 'uppercase'
			} 
		},
		React.DOM.span(
			{ className: 'sub' },
			'Hello,'),
		' world!'
	),
	
	React.createElement(FirstComponent, {
		firstName: 'Justin',
		lastName: 'Bogan',
	}),*/

	React.createElement(TextAreaCounter, {
		text: "test",
	}),

	document.getElementById('app')
);

