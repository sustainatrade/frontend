import React, { Component } from "react";
import {
  Segment,
  Header,
  Input,
  Button,
  Image,
  Loader,
  Grid,
  List,
  Divider
} from "semantic-ui-react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import get from "lodash/get";
import UserContext from "./../../contexts/UserContext";
import { Router, Link } from "@reach/router";
import Profile from "./Profile";

const USER_LIST = gql`
  query {
    UserList(input: { skip: 0, limit: 10 }) {
      status
      list {
        id
        displayName
        socialIds {
          providerId
          uid
        }
      }
    }
  }
`;

const UserList = () => (
  <UserContext.Consumer>
    {({ socialServices }) => {
      const fbAccessToken = get(socialServices, "FACEBOOK.0.accessToken");
      return (
        <React.Fragment>
          <Segment basic>
            <Grid columns="equal">
              <Grid.Column>
                <Header as="h1" content="Traders" />
              </Grid.Column>
              <Grid.Column mobile="8" computer="3">
                <Input fluid placeholder="Search..." icon="search" />
              </Grid.Column>
            </Grid>
          </Segment>
          <Divider />
          <Query query={USER_LIST}>
            {({ loading, error, data }) => {
              const users = get(data, "UserList.list", []);
              if (loading) return <Loader inline="centered" />;
              return (
                <List divided verticalAlign="middle">
                  {users.map(user => {
                    let photoUrl = "";

                    if (fbAccessToken && user.socialIds) {
                      const fbId = user.socialIds.find(
                        sid => sid.providerId === "facebook.com"
                      );
                      if (fbId) {
                        photoUrl =
                          "https://graph.facebook.com/v3.1/" +
                          fbId.uid +
                          "/picture?access_token=" +
                          fbAccessToken.token;
                      }
                    }
                    return (
                      <List.Item key={user.id}>
                        <List.Content floated="right">
                          <Button>Block</Button>
                        </List.Content>
                        <Image avatar src={photoUrl} />
                        <List.Content as={Link} to={`/u/${user.id}`}>
                          {user.displayName}
                        </List.Content>
                      </List.Item>
                    );
                  })}
                </List>
              );
            }}
          </Query>
        </React.Fragment>
      );
    }}
  </UserContext.Consumer>
);

export default class UserRoute extends Component {
  state = {};

  render() {
    return (
      <Router primary={false}>
        <Profile path="/:userId" />
        <UserList path="*" />
      </Router>
    );
  }
}
