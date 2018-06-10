import React, { Component } from 'react'
import { manifests } from './../../components/widgets';
import {
    Dropdown,
    Segment,
    Message,
    Button,
    Divider
} from 'semantic-ui-react'
import PropsEditor from './PropsEditor'
import WidgetContext from '../../contexts/WidgetContext';
import PostViewContext from '../../contexts/PostViewContext';
import ResponsiveContext from '../../contexts/Responsive';

const WIDGET_OPTS = [];
Object.keys(manifests).forEach(wKey => {
    const widgetInfo = manifests[wKey]
    if(widgetInfo.disabled) return;
    WIDGET_OPTS.push({
        text: wKey,
        value: wKey,
        icon: widgetInfo.icon || 'plus'
    })
})

export default class WidgetCreator extends Component {
    state = {
    }

    render() {
        const { widgetName, widgetProps = {}, added } = this.state;
        const { postRefNo } = this.props;
        let WidgetPreview;
        if (widgetName) {
            WidgetPreview = manifests[widgetName].component;
        }
        return <WidgetContext.Consumer>
            {({ setCreatingFn, submitNewFn, submitting }) => {
                const resetComponent = async () => {
                    await setCreatingFn(false)
                    this.setState({
                        widgetName: undefined,
                        widgetProps: undefined,
                        added: undefined
                    })
                }
                if (added) {
                    return <Message
                        success
                    >
                        <Message.Header>
                            <Button floated='right' content='Close' onClick={() => {
                                resetComponent();
                            }} />
                            <div>Widget has been added</div>
                        </Message.Header>
                        Please scroll down to configure its position
                    </Message>
                }
                return (
                    <ResponsiveContext.Consumer>
                        {({ isMobile }) => (
                            <div>
                                Name: <Dropdown placeholder='Select Widget' fluid search
                                    selection options={WIDGET_OPTS}
                                    onChange={(_, data) => {
                                        this.setState({ widgetName: data.value })
                                    }}
                                />
                                {WidgetPreview && <React.Fragment>
                                    Fields: <Segment>
                                        <PropsEditor key={widgetName} propTypes={manifests[widgetName].propTypes}
                                            propTypeOptions={manifests[widgetName].propTypeOptions}
                                            onChange={(data) => {
                                                this.setState({ widgetProps: data })
                                            }} />
                                    </Segment>
                                    Preview: <div>
                                        <Segment>
                                            <WidgetPreview {...widgetProps.propValues} />
                                        </Segment>
                                    </div>
                                </React.Fragment>}
                                <Divider clearing hidden />
                                <PostViewContext.Consumer>
                                    {({ addWidgetFn }) => (
                                        <Button content='Submit' icon='check' floated='right'
                                            loading={submitting}
                                            color='green' disabled={!WidgetPreview}
                                            onClick={async () => {
                                                const ret = await submitNewFn({
                                                    name: widgetName,
                                                    types: widgetProps.propTypes,
                                                    values: widgetProps.propValues,
                                                    postRefNo
                                                })
                                                addWidgetFn(ret)
                                                this.setState({ added: true })
                                            }}
                                        />)}
                                </PostViewContext.Consumer>
                                <Button content='Cancel' icon='ban' floated='right'
                                    onClick={async () => {
                                        resetComponent();
                                    }}
                                />
                                <Divider clearing hidden />
                            </div>
                        )}
                    </ResponsiveContext.Consumer>)
            }}
        </WidgetContext.Consumer>
    }
}