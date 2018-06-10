import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Message, Header, Icon, Progress } from 'semantic-ui-react'
import _ from 'lodash'

export default class Widget extends Component {
    static propTypes = {
        quality: PropTypes.number,
        description: PropTypes.string
    };

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