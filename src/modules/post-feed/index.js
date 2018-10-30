import React, { Component } from "react";
import Post from "./../post-view";
import { Router } from "@reach/router";
import { createPageRoute } from "./../Content";
import PostFeedContext from "./../../contexts/PostFeedContext";
import { useSetSubHeader } from "../../hooks/SetSubHeader";
// import FeedContent from "./FeedContent";

const PostView = props => <Post {...props} />;

const FeedContent = createPageRoute("./post-feed/FeedContent");

function PostFeedContent(props) {
  useSetSubHeader(null);
  return <FeedContent {...props} />;
}
export default class PostFeed extends Component {
  render() {
    return (
      <PostFeedContext.Consumer>
        {postFeedContext => {
          const resetSearch = {};
          Object.keys(postFeedContext.searches).forEach(sKey => {
            resetSearch[sKey] = undefined;
          });
          return (
            <React.Fragment>
              <Router primary={false} className="content-panel">
                <PostView
                  path="/:postTitle/:postRefNo"
                  postFeedContext={postFeedContext}
                />
                <PostFeedContent
                  default
                  postFeedContext={postFeedContext}
                  search={resetSearch}
                />
              </Router>
            </React.Fragment>
          );
        }}
      </PostFeedContext.Consumer>
    );
  }
}
