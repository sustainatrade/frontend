import React, { Component } from 'react'
import { PropObjects } from 'react-props-editor'
import { Message, Header, Icon, Progress } from 'semantic-ui-react'
import _ from 'lodash'
import Slider from 'antd/lib/slider';

export default class Widget extends Component {
    static propObjects = {
        quality: PropObjects.number.render(({
                onChange,
                propValues
            })=>{
                return <div>Quality: (value = <strong>{propValues.quality || 1}</strong>)
                    <Slider min={1} max={10} onChange={(value)=>onChange(value)} 
                        value={propValues.quality} />
                    </div>
        })
    }

    static propTypeOptions = {
        quality: _.range(1,11)
    };
    
    render() {
        const { quality, description } = this.props;
        return <div>
            <center>
                <Header as='h4'>
                    <Icon name='shield alternate' />
                    <Header.Content>Quality</Header.Content>
                </Header>
            </center>
            <Progress value={quality||1} indicating total={Widget.propTypeOptions.quality.length} progress='ratio' />
            { description && <Message info floating><Icon name='info circle'/>{description}</Message>}
        </div>
    }
}