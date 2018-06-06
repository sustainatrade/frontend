import React from 'react'
// import {Prov} from './CreatePost'
import UserContext from './UserContext'
import CreatePostContext from './CreatePost'
import ResponsiveContext from './Responsive'
import { createStore, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'

let reduxMounted = false;

function compose(elArr = []) {
    let currEl = elArr.shift();
    const reducers = {}
    while (elArr.length > 0) {
      const theEl = elArr.shift();
      const ctxName = theEl.ContextName || elArr.length
      reducers[ctxName] = theEl.Reducer || ((state={})=>state);
      currEl = React.createElement(theEl.Provider, {}, currEl)
    }
    if(reduxMounted)
      return currEl;
    else{
      const store = createStore(combineReducers(reducers),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      )
      reduxMounted = true;
      return (<Provider store={store}>
        {currEl}
      </Provider>);
    }
  }

export default ({children}) => (compose([
  children,
  CreatePostContext,
  UserContext,
  ResponsiveContext
]))

// export default class extends React.Component {
//     render() {
//         return (
//             <UserContext.Provider>
//                 {this.props.children}
//             </UserContext.Provider>
//         )
//     }
// }

