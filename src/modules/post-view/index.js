import React, { Component, Suspense, useContext, useEffect } from "react";
import {
  Item,
  Grid,
  Modal,
  Image,
  Button,
  Divider,
  Transition,
  List,
  Segment,
  Header,
  Loader,
  Visibility
} from "semantic-ui-react";
import get from "lodash/get";
import { Query } from "react-apollo";
import UserLabel from "./../user-profile/UserLabel";
import nanoid from "nanoid";

import { POST } from "./../../gql-schemas";
import moment from "moment";
import { contents, MODES } from "./../../components/widgets";
import UserActions from "./UserActions";
import PostActions from "./PostActions";
import { PostComments } from "./index.old";
import PostReply from "./PostReply";
import PostReplies from "./PostReplies";
import { useSetSubHeader } from "../../hooks/SetSubHeader";
import PostViewContext from "../../contexts/PostViewContext";
import LayoutContext from "../../contexts/LayoutContext";
import ResponsiveContext from "../../contexts/Responsive";
import ThemeContext from "../../contexts/ThemeContext";
import PostReplyContext from "../../contexts/PostReplyContext";
import PostItem from "../post-item";
import PostWidgetContext from "../../contexts/PostWidgetContext";

const PostEditor = React.lazy(() => import("./../create-post/PostEditor"));

function PostEditorWrapper(props) {
  const { setEditMode } = useContext(PostViewContext.Context);
  const PostHeader = (
    <Button
      content="Done"
      icon="check"
      color="green"
      basic
      onClick={() => setEditMode(false)}
    />
  );
  useSetSubHeader(PostHeader, { hideBackButton: true });
  return <PostEditor {...props} />;
}

const PostHeader = React.memo(({ post }) => {
  const { isMobile } = useContext(ResponsiveContext.Context);
  const { contentPadding } = useContext(LayoutContext.Context);
  const isReply = !!post.parentPostRefNo;
  useSetSubHeader(isReply ? "Post Reply" : post.title);
  console.log("post"); //TRACE
  console.log(post); //TRACE
  return (
    <div
      style={{
        backgroundColor: "snow",
        padding: contentPadding,
        paddingBottom: 5,
        paddingTop: isMobile ? 0 : 15
      }}
    >
      {isReply ? (
        <>
          {!!post.parentPost && (
            <>
              <Segment color="blue">
                <PostItem
                  isCompact
                  post={post.parentPost}
                  basic
                  withLabels={false}
                />
              </Segment>
              <Divider horizontal>Reply</Divider>
            </>
          )}
        </>
      ) : (
        <Header as="h1">{post.title}</Header>
      )}
      <List size="tiny" horizontal={isMobile}>
        <List.Item>
          <List.Icon name="user" />
          <List.Content>
            <UserLabel refNo={post.createdBy} />
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Icon name="clock" />
          <List.Content>
            {moment(parseInt(post.createdDate, 10)).fromNow()}
          </List.Content>
        </List.Item>
      </List>
    </div>
  );
});

const PostContents = React.memo(({ post }) => {
  // const { contentPadding } = useContext(LayoutContext.Context);
  return (
    <>
      {post.widgets.map(widget => {
        const ContentWidget = contents[widget.code].component;
        return (
          <div style={{ padding: "5px 10px" }} key={widget.id}>
            <ContentWidget
              key={widget.id}
              defaultValues={widget.values}
              mode={MODES.VIEW}
              basic
              fitted
            />
          </div>
        );
      })}
    </>
  );
});

function PostFooter({ post }) {
  const { parentPost } = useContext(PostReplyContext.Context);
  const replyParentPost = get(parentPost, "_refNo") === post._refNo;
  console.log("replyParentPost"); //TRACE
  console.log(replyParentPost); //TRACE
  return (
    <>
      {!replyParentPost ? (
        <>
          <PostActions post={post} />
          <PostReplies post={post} />
        </>
      ) : (
        <Transition
          visible={!!replyParentPost}
          animation="fade up"
          duration={500}
        >
          <PostReply />
        </Transition>
      )}
    </>
  );
}

class PostView extends Component {
  state = { showActions: false, width: null, height: null, visibilityKey: 1 };

  handleOnScreen = (e, { calculations }) => {
    const { height, width } = this.state;
    height !== calculations.height &&
      width !== calculations.width &&
      this.setState({ width: calculations.width, height: calculations.height });
  };

  componentDidMount = () =>
    setTimeout(() => this.setState({ visibilityKey: nanoid() }), 3000);

  render() {
    const {
      postRefNo,
      asReply,
      postRef,
      postViewContext: { editting, isEditting },
      layoutContext: { windowSize, contentStyle },
      themeContext: { secondaryBgColor }
    } = this.props;
    const { visibilityKey, width, height } = this.state;
    console.log("height"); //TRACE
    console.log(height); //TRACE
    let sizeWrapperProps = {},
      SizeWrapper = React.Fragment;
    if (!asReply) {
      SizeWrapper = Visibility;
      sizeWrapperProps = {
        key: visibilityKey,
        fireOnMount: true,
        onUpdate: this.handleOnScreen
      };
    }

    return (
      <Query
        query={POST.query}
        skip={!!postRef}
        variables={{ _refNo: postRefNo }}
      >
        {({ data, loading }) => {
          const post = get(data, "Post.post", postRef);
          console.log("postRef"); //TRACE
          console.log(postRef); //TRACE
          if (loading && !post) return <Loader active inline="centered" />;
          return (
            <>
              <ResetReply post={post} />
              <Grid
                className="content-panel"
                style={{ margin: "0 auto", maxWidth: 768 }}
              >
                <Grid.Column
                  style={{
                    padding: 0,
                    minHeight: windowSize.height - contentStyle.paddingTop
                  }}
                >
                  <SizeWrapper {...sizeWrapperProps}>
                    {isEditting(post._refNo) ? (
                      <Suspense fallback={<Loader active inline="centered" />}>
                        <PostEditorWrapper post={post} />
                      </Suspense>
                    ) : (
                      <>
                        <PostHeader post={post} />
                        <PostContents post={post} />
                        <PostFooter post={post} />
                      </>
                    )}

                    <Divider hidden />
                    <Divider hidden />
                    <Divider hidden />
                    {/* <UserActions post={post} size={{ width }} /> */}
                  </SizeWrapper>
                </Grid.Column>
                {/* <Grid.Column
                  width={6}
                  style={{
                    padding: 5,
                    paddingTop: 0,
                    backgroundColor: secondaryBgColor
                  }}
                >
                  <PostComments post={post} />
                </Grid.Column> */}
              </Grid>
            </>
          );
        }}
      </Query>
    );
  }
}
function ResetReply({ post }) {
  const { reset: resetPostReply } = useContext(PostReplyContext.Context);
  const { reset: resetPostWidget } = useContext(PostWidgetContext.Context);
  useEffect(
    () => {
      resetPostReply();
      resetPostWidget();
    },
    [post._refNo]
  );
  return null;
}
export default function PostViewWrapper(props) {
  const layoutContext = useContext(LayoutContext.Context);
  const postViewContext = useContext(PostViewContext.Context);
  const themeContext = useContext(ThemeContext.Context);
  return (
    <PostView
      {...props}
      postViewContext={postViewContext}
      layoutContext={layoutContext}
      themeContext={themeContext}
    />
  );
}
