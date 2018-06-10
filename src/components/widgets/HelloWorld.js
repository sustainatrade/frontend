import React, { Component } from 'react'
import { WidgetPropTypes } from './lib';


export default class Widget extends Component {
    static propTypes = {
        name: WidgetPropTypes.string,
        yes: WidgetPropTypes.bool
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