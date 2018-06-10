import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Label, Header, Icon } from 'semantic-ui-react'

export default class Widget extends Component {
    static propTypes = {
        color: PropTypes.string
    };

    static propTypeOptions = {
        color: [
            'red',
            'orange',
            'yellow',
            'olive',
            'green',
            'teal',
            'blue',
            'violet',
            'purple',
            'pink',
            'brown',
            'grey',
            'black',
        ]
    };
    
    render() {
        const { color } = this.props;
        return <div>
            <center>
                <Header as='h4'>
                    <Icon name='paint brush' />
                    <Header.Content>Color</Header.Content>
                </Header>
                <Label as='a' color={color} size='large'>
                    {color || '<blank>'}
                </Label>
            </center>
        </div>
    }
}