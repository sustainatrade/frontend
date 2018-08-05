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

const USER_LIST = gql`
  query {
    UserList(input: { skip: 0, limit: 1000 }) {
      status
      list {
        id
        displayName
        photoUrl
        createdBy
      }
    }
  }
`;

export default class UserList extends Component {
  state = {};
  render() {
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
                {users.map(user => (
                  <List.Item key={user.id}>
                    <List.Content floated="right">
                      <Button>Block</Button>
                    </List.Content>
                    <Image avatar src={user.photoUrl} />
                    <List.Content>{user.displayName}</List.Content>
                  </List.Item>
                ))}
              </List>
            );
          }}
        </Query>
        {/* // <List divided verticalAlign="middle">
        //   <List.Item>
        //     <List.Content floated="right">
        //       <Button>Add</Button>
        //     </List.Content>
        //     <Image avatar src="" />
        //     <List.Content>Lena</List.Content>
        //   </List.Item>
        //   <List.Item>
        //     <List.Content floated="right">
        //       <Button>Add</Button>
        //     </List.Content>
        //     <Image avatar src="" />
        //     <List.Content>Lindsay</List.Content>
        //   </List.Item>
        //   <List.Item>
        //     <List.Content floated="right">
        //       <Button>Add</Button>
        //     </List.Content>
        //     <Image avatar src="" />
        //     <List.Content>Mark</List.Content>
        //   </List.Item>
        //   <List.Item>
        //     <List.Content floated="right">
        //       <Button>Add</Button>
        //     </List.Content>
        //     <Image avatar src="" />
        //     <List.Content>Molly</List.Content>
        //   </List.Item>
        // </List> */}
      </React.Fragment>
    );
  }
}
