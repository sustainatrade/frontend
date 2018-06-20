import React, { Component } from 'react'
import { Label, Header, Input, Icon } from 'semantic-ui-react'
import { PropObjects } from 'react-props-editor'
export default class Widget extends Component {
    
    static propObjects = {
        price: PropObjects.number.render(({
                onChange,
                propValues
            })=>{
                return <div>Amount:<Input 
                    placeholder='Enter amount' fluid
                    onChange={(_,data)=>onChange(data.value)}
                    /></div>
        }),
        currency: PropObjects.string.render(({
                onChange,
                propValues
            })=>{
                return <div>Currency:<Input 
                    placeholder='Enter amount' fluid
                    onChange={(_,data)=>onChange(data.value)}
                    /></div>
        }),
        decimalCount: PropObjects.string.render(({
                onChange,
                propValues
            })=>{
                return <div>Decimals:<Input 
                    placeholder='Enter amount' fluid
                    onChange={(_,data)=>onChange(data.value)}
                    /></div>
        }),
        
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