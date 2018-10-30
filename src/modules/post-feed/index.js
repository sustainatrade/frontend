import React, { Component } from "react";
import Post from "./../post-view";
import { Router } from "@reach/router";
import { createPageRoute } from "./../Content";
import PostFeedContext from "./../../contexts/PostFeedContext";
// import FeedContent from "./FeedContent";

const PostView = props => <Post {...props} />;

const FeedContent = createPageRoute("./post-feed/FeedContent");

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
                <FeedContent
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
