import React from "react";
import gql from "graphql-tag";
import apolloClient from "./../lib/apollo";

const Context = React.createContext();
const { Consumer } = Context;
const USER_DETAIL_FRAGMENT = `
  fragment UserDetail on MeOutput {
    status
      user {
        id
        displayName
        roles
      }
      roles {
        code
        name
        isAdmin
      }
  }
`;
const GET_ME = gql`
  ${USER_DETAIL_FRAGMENT}
  query {
    Me {
      ...UserDetail
    }
  }
`;

const ME_LOGIN = gql`
  ${USER_DETAIL_FRAGMENT}
  subscription($device: String) {
    MeLoggedIn(device: $device) {
      ...UserDetail
    }
  }
`;

class Provider extends React.Component {
  state = {};
  updateUser(user, roles) {
    let isAdmin = false;
    if (roles)
      roles.forEach(role => {
        if (role.isAdmin) {
          isAdmin = true;
        }
      });
    this.setState({
      user,
      roles,
      isAdmin
    });
  }
  async componentWillMount() {
    const self = this;
    self.setState({ loading: true });
    const { data } = await apolloClient.query({
      query: GET_ME
    });
    self.updateUser(data.Me.user, data.Me.roles);
    self.setState({
      loading: undefined
    });

    apolloClient
      .subscribe({
        query: ME_LOGIN,
        variables: { device: "desktop" }
      })
      .subscribe({
        next({ data }) {
          console.log("seting state: ME_LOGIN ");
          console.log(data); //TRACE
          if (!data) return;
          console.log(data.MeLoggedIn.user);
          self.updateUser(data.MeLoggedIn.user, data.MeLoggedIn.roles);
        }
      });
  }

  render() {
    const { children } = this.props;
    return <Context.Provider value={this.state}>{children}</Context.Provider>;
  }
}

export default {
  Provider,
  Consumer
};
