import React, { Component } from 'react'
import {
    Responsive
} from 'semantic-ui-react'
import { connect } from 'react-redux'

const Context =  React.createContext({});

class Provider extends React.Component {
    
    render() {
        return (
            <Context.Provider value={this.props}>
                <Responsive
                    fireOnMount
                    onUpdate={(e, {width})=>{
                        const { dispatch } = this.props;                        
                        dispatch(setWidth(width));
                    }}
                >
                    {this.props.children}   
                </Responsive>
                
            </Context.Provider>
        )
    }
}

const setWidth = (width) => ({ type: 'SET_WIDTH', width })

export default {
    ContextName: 'Responsive',
    Provider: connect(
        state=>(state['Responsive'])
      )(Provider),
    Consumer:Context.Consumer,
    Reducer(state = {}, action){
        switch(action.type){
            case 'SET_WIDTH': 
                return {...state,...{width:action.width}}
        }
        return state;
    }
} 