import React from "react";
import gql from "graphql-tag";
import apolloClient from "./../lib/apollo";
import { groupBy } from "lodash";

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
      socialServices{
        type
        accessToken{
          token
          expiration
        }
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
  state = {
    accessToken: null
  };
  updateUser(user, roles, socialServices) {
    let isAdmin = false;
    if (roles)
      roles.forEach(role => {
        if (role.isAdmin) {
          isAdmin = true;
        }
      });
    const mappedByServices = groupBy(socialServices, "type");
    this.setState({
      user,
      roles,
      isAdmin,
      socialServices: mappedByServices
    });
  }
  async componentWillMount() {
    const self = this;
    self.setState({ loading: true });
    const { data } = await apolloClient.query({
      query: GET_ME
    });
    if (!data.Me.user) {
      localStorage.removeItem("_c");
    }
    self.updateUser(data.Me.user, data.Me.roles, data.Me.socialServices);
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
          self.updateUser(
            data.MeLoggedIn.user,
            data.MeLoggedIn.roles,
            data.MeLoggedIn.socialServices
          );
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
