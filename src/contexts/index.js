import React from 'react'
// import {Prov} from './CreatePost'
import UserContext from './UserContext'
import CreatePostContext from './CreatePost'
import ResponsiveContext from './Responsive'
import UploaderContext from './Uploader'
import PostFeedContext from './PostFeedContext'
import PostViewContext from './PostViewContext'
import CategoryContext from './CategoryContext'

function compose(elArr = []) {
    let currEl = elArr.shift();
    while (elArr.length > 0) {
      currEl = React.createElement(elArr.shift(), {}, currEl)
    }
    return currEl;
  }

export default ({children}) => (compose([
    children,
    CreatePostContext.Provider,
    PostFeedContext.Provider,
    PostViewContext.Provider,
    CategoryContext.Provider,
    UserContext.Provider,
    UploaderContext.Provider,
    ResponsiveContext.Provider,
]))