import React, { Component } from 'react'
import PropTypes from 'prop-types';


export default class Widget extends Component {
    static propTypes = {
        name: PropTypes.string,
        yes: PropTypes.bool
    };
    
    render() {
        const { name, yes } = this.props;
        return <div>
            Hello World!
            Name: { name }
            Yes: { (yes && yes.toString()) }
        </div>
    }
}