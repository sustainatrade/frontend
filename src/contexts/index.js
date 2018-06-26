import React from "react";
import { adopt } from "react-adopt";

// Put contexts here

import UserContext from "./UserContext";
import CreatePostContext from "./CreatePost";
import ResponsiveContext from "./Responsive";
import UploaderContext from "./Uploader";
import PostFeedContext from "./PostFeedContext";
import PostViewContext from "./PostViewContext";
import CategoryContext from "./CategoryContext";
import WidgetContext from "./WidgetContext";

const contexts = {
  createPost: CreatePostContext,
  postFeed: PostFeedContext,
  widget: WidgetContext,
  postView: PostViewContext,
  category: CategoryContext,
  user: UserContext,
  uploader: UploaderContext,
  responsive: ResponsiveContext
};

//////

function compose(elArr = []) {
  let currEl = elArr.shift();
  while (elArr.length > 0) {
    currEl = React.createElement(elArr.shift(), {}, currEl);
  }
  return currEl;
}

const consumerMapping = {};
const providerList = [];

Object.keys(contexts).forEach(key => {
  const { Consumer } = contexts[key];
  consumerMapping[key] = <Consumer />;
  providerList.push(contexts[key].Provider);
});

const GlobalConsumer = adopt(consumerMapping);

export default ({ children }) => compose([children, ...providerList]);

export { GlobalConsumer };
