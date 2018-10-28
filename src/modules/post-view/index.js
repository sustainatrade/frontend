import React, { Component, Suspense } from "react";
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
  Visibility,
  Responsive
} from "semantic-ui-react";
import get from "lodash/get";
import { Query } from "react-apollo";
import UserLabel from "./../user-profile/UserLabel";

import { GlobalConsumer } from "./../../contexts";
import { POST } from "./../../gql-schemas";
import moment from "moment";
import { contents, MODES } from "./../../components/widgets";
import Actions from "./Actions";
import { PostComments } from "./index.old";

const PostEditor = React.lazy(() => import("./../create-post/PostEditor"));

const PostHeader = React.memo(
  ({
    context: {
      responsive: { isMobile },
      postView: { editting }
    },
    post
  }) => (
    <>
      <Header as="h1" dividing>
        {post.title}
      </Header>
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
    </>
  )
);

const PostContents = React.memo(
  ({
    context: {
      responsive: { isMobile }
    },
    post
  }) => {
    return (
      <>
        <Divider horizontal />
        <Container>
          {post.widgets.map(widget => {
            const ContentWidget = contents[widget.code].component;
            return (
              <ContentWidget
                key={widget.id}
                defaultValues={widget.values}
                mode={MODES.VIEW}
                basic
                fitted
              />
            );
          })}
        </Container>
      </>
    );
  }
);
class PostView extends Component {
  state = { showActions: false, width: null };

  componentWillMount() {
    const {
      globalContext: {
        responsive: { setStretched }
      }
    } = this.props;
    setStretched(true);
  }

  handleWidthUpdate = (e, { width }) => this.setState({ width });
  handleOnScreen = (e, { calculations }) =>
    this.setState({ width: calculations.width });

  render() {
    const { postRefNo } = this.props;
    const { showActions } = this.state;
    console.log("postRefNo"); //TRACE
    console.log(postRefNo); //TRACE
    return (
      <GlobalConsumer>
        {context => {
          const {
            responsive: { isMobile },
            postView: { editting }
          } = context;
          const { width } = this.state;
          return (
            <Query query={POST.query} variables={{ _refNo: postRefNo }}>
              {({ data, loading }) => {
                console.log("data"); //TRACE
                console.log(data); //TRACE
                const post = get(data, "Post.post");
                if (loading && !post)
                  return <Loader active inline="centered" />;

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
                          padding: 5,
                          paddingBottom: 10,
                          paddingRight: isMobile ? 5 : 10,
                          borderRight: "#00000017 solid 1px"
                        }}
                      >
                        <Visibility
                          fireOnMount
                          onOnScreen={this.handleOnScreen}
                        >
                          {editting ? (
                            <Suspense
                              fallback={<Loader active inline="centered" />}
                            >
                              <PostEditor post={post} />
                            </Suspense>
                          ) : (
                            <>
                              <PostHeader context={context} post={post} />
                              <PostContents post={post} context={context} />
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
                          padding: 5
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
        }}
      </GlobalConsumer>
    );
  }
}

export default props => (
  <GlobalConsumer>
    {globalContext => <PostView {...props} globalContext={globalContext} />}
  </GlobalConsumer>
);
