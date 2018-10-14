import React, { Component } from "react";
import Post from "./../post-view";
import { Router } from "@reach/router";
import { createPageRoute } from "./../Content";
// import FeedContent from "./FeedContent";

const PostView = props => <Post {...props} />;

const FeedContent = createPageRoute("./post-feed/FeedContent");

export default class PostFeed extends Component {
  render() {
    return (
      <div>
        <React.Fragment>
          <Router primary={false}>
            <PostView path="/:postTitle/:postRefNo" />
            <FeedContent default />
          </Router>
        </React.Fragment>
      </div>
    );
  }
}
