import React from 'react'
import { Query, Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import apolloClient from './../lib/apollo'
import { connect } from 'react-redux'

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

    async init(){
        const { dispatch } = this.props;

        const { data } = await apolloClient.query({
            query: GET_ME
          });
        dispatch(userData(data.Me.user))

        apolloClient.subscribe({
          query: ME_LOGIN,
          variables: { device: 'desktop'}
        }).subscribe({
          next ({data}) {
            dispatch(userData(data.MeLoggedIn.user))
          }
        });
        
    }

    constructor(props){
        super(props);
        this.init();
    }

    render() {
        const { children, dispatch, ...rest } = this.props;
        return <Context.Provider value={rest}>
                    { children }
                </Context.Provider>
      }
}

const userData= (userData) => ({ type: 'USER_DATA', userData })

export default {
    ContextName: 'User',
    Provider: connect(
        state=>state['User']
      )(Provider),
    Consumer:Context.Consumer,
    Reducer(state = {}, {type, userData}){
        
        switch(type){
            case 'USER_DATA': 
                return {...state,...{user:userData}}
        }
        return state;
    }
} 