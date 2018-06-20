import React, { Component } from "react";
import {
    Segment,
    Icon,
    Label,
    Button,
    Dimmer
} from 'semantic-ui-react'
import { parseGraphData } from './../../components/widgets/lib';
import { manifests } from './../../components/widgets';
import gql from 'graphql-tag';
import apolloClient from './../../lib/apollo'

const POST_WIDGET = gql`
  query($refNo: String!){
    PostWidget(input:{
        _refNo: $refNo
      }){
        status
        postWidget{
            name
            types
            values
            _refNo
            postRefNo
        }
      }
  }
`;

export default class PostWidget extends Component {
    state = {
        showControls: false
    };
    async componentWillMount(){
        const { fromRefNo, fromData } = this.props;
        if(fromRefNo){
            const { data } = await apolloClient.query({
                query: POST_WIDGET,
                variables: {
                    refNo: fromRefNo
                }
            });
            this.setState(parseGraphData(data.PostWidget.postWidget))
        }
        else if(fromData){
            console.log('fromData')//TRACE
            console.log(fromData)//TRACE
            // self.setState({user:data.Me.user,loading:undefined})
            // const {name,types,values,postRefNo} = fromData
            this.setState({
                types: fromData.propTypes,
                values: fromData.propValues,
                ...fromData
            });
        }
    }
    render(){
        const { fluid, editable } = this.props;
        const { name, propTypes, values, showControls } = this.state;
        
        if(!name) return <div>loading...</div>

        const Widget = manifests[name].component;
        return <Dimmer.Dimmable  as={Segment} piled compact
            textAlign='center' dimmed={showControls}
            >
            { editable && <Label as='a' size='tiny' floating onClick={()=>this.setState({showControls:!showControls})} >
                <Icon name={showControls?'ban':'pencil alternate'} style={{margin:0}} />
            </Label>}
            <Widget {...values}/>
            <Dimmer active={showControls}>
            <Button.Group>
                <Button type='button' icon title='Move' onClick={()=>alert('Soon')}>
                    <Icon name='move' />
                </Button>
                <Button type='button' icon title='Edit' onClick={()=>alert('Soon')}>
                    <Icon name='edit' />
                </Button>
                <Button type='button' icon title='Duplicate' onClick={()=>alert('Soon')}>
                    <Icon name='copy outline' />
                </Button>
                <Button type='button' icon title='Cancel' onClick={()=>this.setState({showControls:false})}>
                    <Icon name='ban'/>
                </Button>
            </Button.Group>
            </Dimmer>
       </Dimmer.Dimmable>
    }
}