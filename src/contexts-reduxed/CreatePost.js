import React from 'react'
import { connect } from 'react-redux'

const Context =  React.createContext();


class Provider extends React.Component {
    
    render() {
        const { children, ...rest} = this.props;
        return (
            <Context.Provider value={rest}>
                {children}
            </Context.Provider>
        )
    }
}

const showModal= (show) => ({ type: 'SHOW_MODAL', modalOpened: show })

export default {
    ContextName: 'CreatePost',
    Provider: connect(
        state=>state['CreatePost'],
        dispatch=>({
            closeModal:()=>dispatch(showModal(false)),
            openModal:()=>dispatch(showModal(true))
        })
      )(Provider),
    Consumer:Context.Consumer,
    Reducer(state = {}, {type, modalOpened}){
        
        switch(type){
            case 'SHOW_MODAL': 
                return {...state,...{modalOpened}}
        }
        return state;
    }
} 