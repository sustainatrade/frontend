import React, { Component, Suspense, useContext } from "react";
import {
  Item,
  Grid,
  Modal,
  Image,
  Button,
  Divider,
  Container,
  List,
  Header,
  Loader,
  Visibility
} from "semantic-ui-react";
import get from "lodash/get";
import { Query } from "react-apollo";
import UserLabel from "./../user-profile/UserLabel";
import nanoid from "nanoid";

import { GlobalConsumer } from "./../../contexts";
import { POST } from "./../../gql-schemas";
import moment from "moment";
import { contents, MODES } from "./../../components/widgets";
import Actions from "./Actions";
import { PostComments } from "./index.old";
import { useSetSubHeader } from "../../hooks/SetSubHeader";
import PostViewContext from "../../contexts/PostViewContext";
import LayoutContext from "../../contexts/LayoutContext";
import ResponsiveContext from "../../contexts/Responsive";
import ThemeContext from "../../contexts/ThemeContext";

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
  useSetSubHeader(post.title);
  const { isMobile } = useContext(ResponsiveContext.Context);
  const { contentPadding } = useContext(LayoutContext.Context);
  return (
    <div
      style={{
        padding: contentPadding,
        paddingBottom: 0,
        paddingTop: isMobile ? 0 : 30
      }}
    >
      <Header as="h1">{post.title}</Header>
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
class PostView extends Component {
  state = { showActions: false, width: null, height: null, visibilityKey: 1 };

  handleOnScreen = (e, { calculations }) =>
    this.setState({ width: calculations.width, height: calculations.height });

  componentDidMount = () =>
    setTimeout(() => this.setState({ visibilityKey: nanoid() }), 3000);

  render() {
    const {
      postRefNo,
      postViewContext: { editting },
      layoutContext: { windowSize, contentStyle },
      themeContext: { secondaryBgColor }
    } = this.props;
    const { visibilityKey, width, height } = this.state;
    console.log("height"); //TRACE
    console.log(height); //TRACE
    return (
      <Query query={POST.query} variables={{ _refNo: postRefNo }}>
        {({ data, loading }) => {
          const post = get(data, "Post.post");
          if (loading && !post) return <Loader active inline="centered" />;
          return (
            <>
              <Grid
                doubling
                columns={2}
                className="content-panel"
                style={{ margin: 0 }}
              >
                <Grid.Column
                  width={10}
                  style={{
                    padding: 0,
                    minHeight: windowSize.height - contentStyle.paddingTop,
                    borderRight: "#00000017 solid 1px"
                  }}
                >
                  <Visibility
                    key={visibilityKey}
                    fireOnMount
                    onUpdate={this.handleOnScreen}
                  >
                    {editting ? (
                      <Suspense fallback={<Loader active inline="centered" />}>
                        <PostEditorWrapper post={post} />
                      </Suspense>
                    ) : (
                      <>
                        <PostHeader post={post} />
                        <Divider />
                        <PostContents post={post} />
                      </>
                    )}

                    <Divider hidden />
                    <Divider hidden />
                    <Divider hidden />
                    <Actions post={post} size={{ width }} />
                  </Visibility>
                </Grid.Column>
                <Grid.Column
                  width={6}
                  style={{
                    padding: 5,
                    paddingTop: 0,
                    backgroundColor: secondaryBgColor
                  }}
                >
                  <PostComments post={post} />
                </Grid.Column>
              </Grid>
            </>
          );
        }}
      </Query>
    );
  }
}

export default props => {
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
};
