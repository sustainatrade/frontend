import React, { Component } from "react";
import { GlobalConsumer } from "./../../contexts";
// import { Mutation } from "react-apollo";
// import { FOLLOW_POST } from "./../../gql-schemas";
import { List, Icon, Loader } from "semantic-ui-react";
import { getShareUrl } from "./PostItem";
import { Share } from "react-facebook";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class MoreProps extends Component {
  state = {};
  async componentWillMount() {
    const { isAdmin = false, post, isRemoved } = this.props;
    const options = [];
    this.setState({
      options: [
        <List.Item as="a" onClick={() => {}} key="opts-loader">
          <Loader active size="small" inline="centered" />
        </List.Item>
      ]
    });
    if (isAdmin) {
      if (!isRemoved) {
        const [HidePostModal] = await Promise.all([
          import("./../../admin/components/hide-post-modal/HidePostModal")
        ]);
        options.push(
          <List.Item key="hide-post">
            <List.Content>
              <HidePostModal.default post={post} />
            </List.Content>
          </List.Item>
        );
      }
    }
    this.setState({ options });
  }
  render() {
    const { post, isMobile } = this.props;
    return (
      <GlobalConsumer>
        {({
          createPost: { openModal },
          user: { user },
          postView: { reportPostFn }
        }) => {
          const isMyPost = user && post.createdBy === user.id;
          return (
            <List divided>
              {isMyPost && (
                <List.Item
                  as="a"
                  onClick={() => {
                    openModal(post._refNo);
                  }}
                >
                  <List.Icon name="edit" size="large" verticalAlign="middle" />
                  <List.Content>Edit Post</List.Content>
                </List.Item>
              )}
              {isMobile && (
                <List.Item>
                  <Share href={getShareUrl(post)}>
                    <div>
                      <Icon name="facebook f" size="large" />
                      {"     "}
                      Share
                    </div>
                  </Share>
                </List.Item>
              )}
              <List.Item
                as="a"
                onClick={() => {
                  reportPostFn(post._refNo);
                }}
              >
                <List.Icon name="flag" size="large" verticalAlign="middle" />
                <List.Content>Report</List.Content>
              </List.Item>
              {this.state.options}
            </List>
          );
        }}
      </GlobalConsumer>
    );
  }
}
