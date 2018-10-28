import React, { Component } from "react";
import {
  Header,
  Container,
  Segment,
  Label,
  Loader,
  Divider,
  Popup,
  Button,
  Input
} from "semantic-ui-react";
import { Query } from "react-apollo";
import { contents, MODES } from "./../../components/widgets";
import Icon from "antd/lib/icon";
import { LAST_DRAFT, PUBLISH_POST } from "../../gql-schemas";
import CreatePostContext from "../../contexts/CreatePost";
import ErrorContext from "../../contexts/ErrorContext";
import Responsive from "../../contexts/Responsive";
import PostWidgetContext from "../../contexts/WidgetContext";
import { GlobalConsumer } from "../../contexts";
import get from "lodash/get";
import debounce from "lodash/debounce";
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
