import React from 'react'
import gql from 'graphql-tag'
import apolloClient from './../lib/apollo'

const Context = React.createContext();
const { Consumer } = Context;


const POST = gql`
    query ( $_refNo: String! ) {
      Post(input: {
        _refNo: $_refNo
      }){
        status
        widgets
        post{
          id
          _refNo
          createdBy
          createdDate
          title
          section
          category
          description
          photos
          tags
        }
      }
    }
    `;
    
class Provider extends React.Component {
    state = {
      closeFn: () => {
        this.setState({post:undefined});
      },
      addWidgetFn: (widgetRefNo) => {
        const { widgets=[] } = this.state;
        this.setState({widgets:[...widgets,widgetRefNo]});
      },
      viewPostFn: async (_refNo) =>{
        const self = this;
        if(this.state.loading) return;
        self.setState({loading:true})
        
        const ret = await apolloClient.query({
          query: POST,
          variables: { _refNo },
          options: {
            fetchPolicy: 'network-only'
          }
        })
        console.log('ret')//TRACE
        console.log(ret)//TRACE
        if(ret.data.Post.status === 'SUCCESS'){
          self.setState({
            post:ret.data.Post.post,
            widgets:ret.data.Post.widgets,
            loading:undefined});
        }
        else{
          self.setState({loading:undefined});
        }
      }
    }

    //TESTING
    componentDidMount(){
      // this.state.viewPostFn('POST-0000016')
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