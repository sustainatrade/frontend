import React, { Component } from "react";
import {
    Segment,
    Icon,
    Label,
    Button,
    Dimmer
} from 'semantic-ui-react'
import { manifests, parseGraphData } from './../../components/widgets';
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
        const { refNo } = this.props;
        const { data } = await apolloClient.query({
            query: POST_WIDGET,
            variables: {
                refNo
            }
          });
        // self.setState({user:data.Me.user,loading:undefined})
        // const {name,types,values,postRefNo} = data.PostWidget.postWidget;
        // this.setState({
        //     name,
        //     types:JSON.parse(types),
        //     values:JSON.parse(values),
        //     postRefNo
        // });
        this.setState(parseGraphData(data.PostWidget.postWidget))
    }
    render(){
        const { fluid, editable } = this.props;
        const { name, types, values, showControls } = this.state;
        
        if(!name) return <div>loading...</div>

        const Widget = manifests[name].component;
        return <Dimmer.Dimmable  as={Segment} raised compact={!fluid} 
            textAlign='center' dimmed={showControls}
            >
            { editable && <Label as='a' size='tiny' floating onClick={()=>this.setState({showControls:!showControls})} >
                <Icon name={showControls?'ban':'pencil alternate'} style={{margin:0}} />
            </Label>}
            <Widget {...values}/>
            <Dimmer active={showControls}>
            <Button.Group>
                <Button icon title='Move' onClick={()=>alert('Soon')}>
                    <Icon name='move' />
                </Button>
                <Button icon title='Edit' onClick={()=>alert('Soon')}>
                    <Icon name='edit' />
                </Button>
                <Button icon title='Duplicate' onClick={()=>alert('Soon')}>
                    <Icon name='copy outline' />
                </Button>
                <Button icon title='Cancel' onClick={()=>this.setState({showControls:false})}>
                    <Icon name='ban'/>
                </Button>
            </Button.Group>
            </Dimmer>
       </Dimmer.Dimmable>
    }
}