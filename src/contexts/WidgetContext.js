import React from 'react'
import gql from 'graphql-tag'
import apolloClient from './../lib/apollo'

const Context = React.createContext();
const { Consumer } = Context;


const UPDATE_POST_WIDGETS = gql`
      mutation(
        $hash: String
        $widgets: [WidgetUpdateInput]!
      ) {
        UpdatePostWidgets(input:{
          _hash: $hash
          widgets:$widgets
        }){
          status
          widgets{
            id
            displayName
            types
            values
            _refNo
          }
        }
      }
    `;
    
class Provider extends React.Component {
    state = {
      creating: false,
      submitting: false,
      setCreatingFn : (creating) => {
        this.setState({creating})
      },
      // postWidgets: [],
      // addPostWidgets: async (widgetRefNo)=>{
      //   const { postWidgets } = this.state;
      //   this.setState({postWidgets:[ ...postWidgets, widgetRefNo]});
      // },
      submitNewFn: async (widgetData)=>{

        this.setState({submitting:true})
        widgetData.type= 'CREATE'
        const widgetInput = Object.assign(
          {},
          widgetData,
          {
            types:JSON.stringify(widgetData.types),
            values:JSON.stringify(widgetData.values)
          }
        );
        const ret = await apolloClient.mutate({
          mutation: UPDATE_POST_WIDGETS,
          variables:{
            widgets:[
              widgetInput
            ]
          }
        })
        this.setState({submitting:false})
        return ret.data.UpdatePostWidgets.widgets[0]._refNo;
      }
    }

    //TESTING
    componentDidMount(){
    }

    render() {
        const { children } = this.props;
        return <Context.Provider value={this.state}>
                    { children }
                </Context.Provider>
      }
}

export default {
  Provider,
  Consumer
}