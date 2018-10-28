import React, { Component } from "react";
import { Header, Loader, Divider } from "semantic-ui-react";
import { Query } from "react-apollo";
import { LAST_DRAFT } from "../../gql-schemas";
import get from "lodash/get";
import "./create-post.css";
import PostEditor from "./PostEditor";
export default class CreatePost extends Component {
  render() {
    return (
      <Query query={LAST_DRAFT.query}>
        {({ loading, data }) => {
          console.log("data"); //TRACE
          console.log(data); //TRACE
          const post = get(data, "LastDraft.post");
          console.log("post"); //TRACE
          console.log(post); //TRACE
          // activeIdx === undefined ? newContents.length - 1 : activeIdx;
          if (!post) return <Loader inline="centered" active />;
          return (
            <>
              <Divider hidden />
              <Header as="h1" dividing style={{ marginLeft: 5 }}>
                Create Post
              </Header>
              <PostEditor post={post} />
            </>
          );
        }}
      </Query>
    );
  }
}
