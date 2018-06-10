import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Label, Header, Icon } from 'semantic-ui-react'

export default class Widget extends Component {
    static propTypes = {
        price: PropTypes.number,
        currency: PropTypes.string,
        decimalCount: PropTypes.number
    };
    
    render() {
        const { price, currency, decimalCount = 2 } = this.props;
        return <div>
            <center>
                <Header as='h4'>
                    <Icon name='money bill alternate' />
                    <Header.Content>Price</Header.Content>
                </Header>
                <Label as='a' color='teal' size='large' tag>
                    {!price && `<blank>`}
                    {price && `${Number(price).toFixed(decimalCount)} ${currency||'Php'}`}
                </Label>
            </center>
        </div>
    }
}