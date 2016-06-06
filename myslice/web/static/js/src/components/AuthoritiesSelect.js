/*
 * Authority Select component
 * requires: authorities actions and store
 */
var React = require('react');
var Select = require('react-select');
var store = require('../stores/AuthoritiesStore');
var actions = require('../actions/AuthoritiesActions');

module.exports = React.createClass({
    getInitialState () {
        return store.getState();
    },

    componentDidMount: function() {
        // store
        store.listen(this.onChange);

        // action fetch authorities
        actions.fetchAuthorities();

    },

    componentWillUnmount() {
        store.unlisten(this.onChange);
    },

    onChange(state) {
        this.setState(state);
    },

    setValue (value) {
		this.setState({ value });
		console.log('Support level selected:', value.label);
	},

    getOptions: function() {
        return this.state.authorities.map(function(authority) { return { value: authority.id, label: authority.name } });
    },

    renderLink: function() {
		return <a style={{ marginLeft: 5 }} href="/upgrade" target="_blank">C Upgrade here!</a>;
	},
	renderOption: function(option) {
		return <span style={{ color: option.color }}>A{option.label} {option.link}</span>;
	},
	renderValue: function(option) {
		return <strong style={{ color: option.color }}>B{option.label}</strong>;
	},

    render: function () {
        let options = this.getOptions();

        return <Select
            name="form-field-name"
            placeholder="Select your Authority"
            value={this.state.value}
            optionRenderer={this.renderOption}
            options={options}
            valueRenderer={this.renderValue}
            onChange={this.setValue}
        />
    }
});