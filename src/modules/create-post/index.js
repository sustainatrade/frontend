import React, { Component, useContext } from "react";
import {
  Header,
  Icon,
  Loader,
  Button,
  Divider,
  Dimmer
} from "semantic-ui-react";
import { Query } from "react-apollo";
import { LAST_DRAFT } from "../../gql-schemas";
import get from "lodash/get";
import "./create-post.css";
import PostEditor from "./PostEditor";
import { Context } from "./../../contexts/CreatePost";
import { navigate } from "@reach/router";

function PublishPostModal() {
  const { publishedPost, reset } = useContext(Context);
  console.log("publishedPost"); //TRACE
  console.log(publishedPost); //TRACE
  return (
    <Dimmer inverted active={!!publishedPost} page>
      <Header as="h2" icon style={{ color: "black" }}>
        <Icon name="check circle outline" color="green" />
        Post Published!
        <Divider horizontal />
        <Header.Subheader>You will be notified for updates</Header.Subheader>
        <Divider horizontal />
        <Button
          content="View Post"
          primary
          onClick={() => {
            navigate(`p/${publishedPost.title}/${publishedPost._refNo}`);
          }}
        />
        <Button
          content="Create New"
          basic
          onClick={() => {
            navigate(`/create`);
            reset();
          }}
        />
      </Header>
    </Dimmer>
  );
}
export default function() {
  
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
            <PublishPostModal />
          </>
        );
      }}
    </Query>
  );
}
