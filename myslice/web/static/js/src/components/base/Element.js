import React from 'react';

class Element extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    handleClick() {
        this.props.setCurrent(this.props.element);
    }

    render() {
        var className = 'elementBox';

        if (this.props.type) {
            className += ' ' + this.props.type;
        }

        if (this.props.setCurrent) {
            className += ' pointer';

            if (this.props.element == this.props.current) {
                className += ' selected';
            }

            return (
                <li className={className} onClick={this.handleClick}>
                    {this.props.children}
                </li>
            );
        } else {
            return (
                <li className={className}>
                    {this.props.children}
                </li>
            );
        }

    }
}

Element.propTypes = {
    element: React.PropTypes.object.isRequired,
    type: React.PropTypes.string,
    current: React.PropTypes.object,
    setCurrent: React.PropTypes.func
};

Element.defaultProps = {
    type: null,
    current: null,
    setCurrent: null
};

export default Element;