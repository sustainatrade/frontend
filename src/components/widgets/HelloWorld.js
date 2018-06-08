import React, { Component } from 'react'
import PropTypes from 'prop-types';

export default class Widget extends Component {
    static propTypes = {
        name: PropTypes.string
    }
    
    state = {}
    render() {
        return <div>Hello World!</div>
    }
}