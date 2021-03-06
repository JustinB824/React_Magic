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

var headers =  ["Book", "Author", "Language", "Published", "Sales"];
var data = [
	["The Lord of the Rings", "JRR Tolkien", "English", "1954-1955", "150 Million"],
	["The Little Prince", "Antoine de Saint", "French", "1943", "140 Million"],
	["Harry Potter and the Sorcerer's Stone", "JK Rowling", "English", "1997", "107 Million"],
	["Dream of the Red Chamber", "Cao Xueqin", "Chinese", "1754-1791", "100 Million"],
];

var Excel = React.createClass({
	displayName: 'Excel',
	_presSearchData: null,

	getInitialState: function() {
		return {
			data: this.props.initialData,
			sortby: null,
			descending: false,
			edit: null,
			search: false,
		};
	},

	_sort: function(e) {
		var column = e.target.cellIndex;
		var data = this.state.data.slice();
		var descending = this.state.sortby === column && !this.state.descending;

		data.sort(function(a, b) {
			return descending
				? (a[column] < b[column] ? 1 : -1)
				: (a[column] > b[column] ? 1 : -1);
		});

		this.setState({
			data: data,
			sortby: column,
			descending: descending,
		});
	},

	_showEditor: function(e) {

		this.setState({
			edit: {
				row: parseInt(e.target.dataset.row, 10),
				cell: e.target.cellIndex,
			}
		});
	},

	_save: function(e) {
		e.preventDefault(); // prevent page reload on form submit
		var input = e.target.firstChild;
		var data = this.state.data.slice();

		data[this.state.edit.row][this.state.edit.cell] = input.value;

		this.setState({
			edit: null,
			data: data,
		});
	},

	_toggleSearch: function() {
		if (this.state.search) {
			this.setState({
				data: this._presSearchData,
				search: false,
			});
			this._presSearchData = null;
		} else {
			this._presSearchData = this.state.data;
			this.setState({
				search: true,
			});
		}
	},

	_renderSearch: function() {
		if (!this.state.search) {
			return null;
		}
		return (
			React.DOM.tr(
				{onChange: this._search},
				this.props.headers.map(function(_ignore, idx) {
					return React.DOM.td({key: idx},
						React.DOM.input({
							type: 'text',
							'data-idx': idx,
						})
					);
				})
			)
		);
	},

	_search: function(e) {
		var needle = e.target.value.toLowerCase();
		if (!needle) {
			this.setState({
				data: this._presSearchData
			});
			return;
		}
		var idx = e.target.dataset.idx;
		var searchData = this._presSearchData.filter(function(row) {
			return row[idx].toString().toLowerCase().indexOf(needle) > -1;
		});
		this.setState({
			data: searchData
		});
	},

	_download: function(format, ev) {
		var contents = format === 'json'
			? JSON.stringify(this.state.data)
			: this.state.data.reduce(function(result, row) {
				return result
				+ row.reduce(function(rowresult, cell, idx) {
					return rowresult
					+ '"'
					+ cell.replace(/"/g, '""')
					+ '"'
					+ (idx < row.length - 1 ? ',' : '');
				}, '')
				+ "\n";
			}, '');
		var URL = window.URL || window.webkitURL;
		var blob = new Blob([contents], {type: 'text/' + format});
		ev.target.href = URL.createObjectURL(blob);
		ev.target.download = 'data.' + format;
	},

	_renderToolbar: function() {
		return React.DOM.div({className: 'toolbar'},
			React.DOM.button({
				onClick: this._toggleSearch,
			},'Search'),
			React.DOM.a({
				onClick: this._download.bind(this, 'json'),
				href: 'data.json'
			}, 'Export JSON'),
			React.DOM.a({
				onClick: this._download.bind(this, 'csv'),
				href: 'data.csv'
			}, 'Export CSV')
		);
	},

	_renderTable: function() {
		return (
			React.DOM.table(null,
				React.DOM.thead({onClick: this._sort},
					React.DOM.tr(null,
						this.props.headers.map(function(title, idx) {
							if (this.state.sortby === idx) {
								title += this.state.descending ? ' \u2191' : ' \u2193'
							}
							return React.DOM.th({key: idx}, title);
						}, this)
					)
				),
				React.DOM.tbody({onDoubleClick: this._showEditor},
					this._renderSearch(),
					this.state.data.map(function(row, rowidx) {
						return (
							React.DOM.tr({key: rowidx},
								row.map(function(cell, idx) {
									var content = cell;
									var edit = this.state.edit;

									if (edit && edit.row === rowidx && edit.cell === idx) {
										content = React.DOM.form({onSubmit: this._save},
											React.DOM.input({
												type: 'text',
												defaultValue: content,
											})
										);
									}

									return React.DOM.td({
										key: idx,
										'data-row': rowidx
									}, content);
								}, this)
							)
						)
					}, this)
				)
			)
		);
	},

	render: function() {
		return (
			React.DOM.div(null,
				this._renderToolbar(),
				this._renderTable()
			)
		);
	}
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
	}),

	React.createElement(TextAreaCounter, {
		text: "test",
	}),*/

	React.createElement(Excel, {
		headers: headers,
		initialData: data,
	}),

	document.getElementById('app')
);

