import React from 'react'
import gql from 'graphql-tag'
import apolloClient from './../lib/apollo'

const Context = React.createContext();
const { Consumer } = Context;

const GET_ME = gql`
  query{
    Me {
        status
        user {
          id
          displayName
        }
      }
  }
`;

const ME_LOGIN = gql`
     subscription ($device: String){
       MeLoggedIn(
         device: $device
       ) {
         status
         user {
           id
           displayName
         }
       }
     }
    `;

class Provider extends React.Component {
    state = {}
    async componentWillMount(){
        const self = this;
        self.setState({loading:true})
        const { data } = await apolloClient.query({
            query: GET_ME
          });
        self.setState({user:data.Me.user,loading:undefined})

        apolloClient.subscribe({
          query: ME_LOGIN,
          variables: { device: 'desktop'}
        }).subscribe({
          next ({data}) {
            console.log('seting state: ');
            console.log(data.MeLoggedIn.user);
            self.setState({user:data.MeLoggedIn.user})
          }
        });
        
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