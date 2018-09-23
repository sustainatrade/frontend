import React, { Component } from "react";
import {
  Segment,
  Header,
  Message,
  Label,
  Image,
  Item,
  Loader,
  Grid,
  Divider
} from "semantic-ui-react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import get from "lodash/get";
import UserContext from "./../../contexts/UserContext";
import moment from "moment";
import PostItem from "./../post-feed/PostItem";
import { GlobalConsumer } from "./../../contexts";
import { POST_LIST } from "./../../gql-schemas";

const USER_QUERY = gql`
  query($userId: String!) {
    User(input: { _refNo: $userId }) {
      user {
        id
        createdDate
        displayName
        socialIds {
          providerId
          uid
        }
      }
    }
  }
`;

const UserPosts = ({ userId }) => (
  <GlobalConsumer>
    {({ category: { loading, categories } }) => {
      return (
        <Query
          query={POST_LIST}
          variables={{
            input: {
              skip: 0,
              limit: 10,
              search: JSON.stringify({ createdBy: userId })
            }
          }}
        >
          {({ loading, error, data = {} }) => {
            const list = get(data, "PostList.list", []);
            console.log("list"); //TRACE
            console.log(list); //TRACE
            return (
              <Item.Group divided unstackable>
                {list.map(post => {
                  let postObj = post;
                  if (post.isRemoved) {
                    postObj = post.post;
                  }
                  return (
                    <PostItem
                      isCompact
                      key={post._refNo}
                      post={postObj}
                      categories={categories}
                      basic
                      isRemoved={post.isRemoved}
                    />
                  );
                })}
              </Item.Group>
            );
          }}
        </Query>
      );
    }}
  </GlobalConsumer>
);

export default class Profile extends Component {
  state = {};

  render() {
    const { userId } = this.props;
    return (
      <Query query={USER_QUERY} variables={{ userId }}>
        {({ loading, error, data }) => (
          <UserContext.Consumer>
            {({ socialServices }) => {
              if (loading) return <Loader active inline="centered" />;
              const fbAccessToken = get(
                socialServices,
                "FACEBOOK.0.accessToken"
              );
              let photoUrl = "";
              const user = get(data, "User.user");
              if (!user)
                return <Message header="Invalid" content="User not found" />;
              if (fbAccessToken && user.socialIds) {
                const fbId = user.socialIds.find(
                  sid => sid.providerId === "facebook.com"
                );
                if (fbId) {
                  photoUrl =
                    "https://graph.facebook.com/v3.1/" +
                    fbId.uid +
                    "/picture?height=200&width=200&access_token=" +
                    fbAccessToken.token;
                }
              }
              console.log("userId"); //TRACE
              console.log(userId); //
              return (
                <React.Fragment>
                  <Segment basic>
                    <Header as="h2">
                      <Image alt={user.displayName} rounded src={photoUrl} />
                      {user.displayName}
                      <div style={{ float: "right" }}>
                        <Label image>
                          Date Joined
                          <Label.Detail>
                            {moment(parseInt(user.createdDate, 10)).fromNow()}
                          </Label.Detail>
                        </Label>
                      </div>
                      <Divider clearing />
                    </Header>
                  </Segment>
                  <Grid>
                    <Grid.Column mobile={16} tablet={10} computer={10}>
                      <Segment basic>
                        <Header as="h3" dividing>
                          Posts
                        </Header>
                        <Segment basic>
                          <UserPosts userId={userId} />
                        </Segment>
                      </Segment>
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={6} computer={6}>
                      <Segment basic>
                        <Header as="h3" dividing>
                          Recent Activity
                        </Header>
                        <Segment basic>Empty.</Segment>
                      </Segment>
                    </Grid.Column>
                  </Grid>
                </React.Fragment>
              );
            }}
          </UserContext.Consumer>
        )}
      </Query>
    );
  }
}
