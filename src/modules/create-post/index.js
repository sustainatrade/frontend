import React, { useContext, useEffect } from "react";
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
import { Context as LayoutContext } from "./../../contexts/LayoutContext";
import { navigate } from "@reach/router";
import { useSetSubHeader } from "../../hooks/SetSubHeader";

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
function SubHeader({ post }) {
  const { publishPost } = useContext(Context);
  useSetSubHeader(
    <span>
      <span
        style={{
          fontWeight: "bold",
          fontSize: "large",
          marginLeft: "10px"
        }}
      >
        Create Post
      </span>
      <Button
        content="Publish"
        size="large"
        floated="right"
        primary
        icon="send"
        onClick={() => {
          publishPost({ refNo: post._refNo });
        }}
        style={{
          marginTop: -2,
          marginRight: -3
        }}
      />
    </span>
  );

  return null;
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
            <SubHeader post={post} />
            <PostEditor post={post} />
            <PublishPostModal />
          </>
        );
      }}
    </Query>
  );
}
