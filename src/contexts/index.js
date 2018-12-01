import React from 'react';
import { adopt } from 'react-adopt';

// Put contexts here

import UserContext from './UserContext';
import CreatePostContext from './CreatePost';
import ResponsiveContext from './Responsive';
import UploaderContext from './Uploader';
import PostFeedContext from './PostFeedContext';
import PostViewContext from './PostViewContext';
import CategoryContext from './CategoryContext';
import PostWidgetContext from './PostWidgetContext';
import PostReplyContext from './PostReplyContext';
import PostStackContext from './PostStackContext';
import ErrorContext from './ErrorContext';
import LayoutContext from './LayoutContext';
import ThemeContext from './ThemeContext';
import SettingsContext from './SettingsContext';

const contexts = {
  createPost: CreatePostContext,
  postFeed: PostFeedContext,
  postWidget: PostWidgetContext,
  postReply: PostReplyContext,
  postView: PostViewContext,
  postStack: PostStackContext,
  category: CategoryContext,
  settings: SettingsContext,
  user: UserContext,
  layout: LayoutContext,
  uploader: UploaderContext,
  responsive: ResponsiveContext,
  theme: ThemeContext,
  error: ErrorContext
};

//////

function compose(elArr = []) {
  let currEl = elArr.shift();
  while (elArr.length > 0) {
    const nextEl = elArr.shift();
    const { key } = nextEl;
    currEl = React.createElement(nextEl, { key }, currEl);
  }
  return currEl;
}

const consumerMapping = {};
const providerList = [];

Object.keys(contexts).forEach(key => {
  const { Consumer, Provider } = contexts[key];
  consumerMapping[key] = <Consumer />;
  Provider.key = key;
  providerList.push(Provider);
});

const GlobalConsumer = adopt(consumerMapping);

export default ({ children }) => compose([children, ...providerList]);

export { GlobalConsumer };
