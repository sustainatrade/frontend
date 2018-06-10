import React, { Component } from 'react'
import { WidgetPropTypes } from './lib';
import { Label, Header, Icon } from 'semantic-ui-react'

export default class Widget extends Component {
    static propTypes = {
        price: WidgetPropTypes.number,
        currency: WidgetPropTypes.string,
        decimalCount: WidgetPropTypes.number
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