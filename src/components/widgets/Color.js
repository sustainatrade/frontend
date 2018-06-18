import React, { Component } from 'react'
import { Label, Header, Icon, Dropdown } from 'semantic-ui-react'
import { PropObjects } from 'react-props-editor'

const colors =  [
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

export default class Widget extends Component {
    static propObjects = {
        color: PropObjects.string.render(({
            onChange,
            propValues
        })=>{
            return <div>Color:<Dropdown 
                placeholder='Select Color' fluid 
                search selection 
                onChange={(_,data)=>onChange(data.value)}
                options={colors.map(color=>({
                    key: color,
                    value: color,
                    text: color,
                    label: { color, empty: true, circular: true }
                }))} /></div>
        })
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