import React from "react";
import gql from "graphql-tag";
import apolloClient from "./../lib/apollo";
import { Query } from "react-apollo";
import { groupBy } from "lodash";
import USER_DETAIL_FRAGMENT from "./../gql-schemas/UserDetailFragment";
// import get from "lodash/get";

const Context = React.createContext();
const { Consumer } = Context;

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
    // this.setState({
    //   user,
    //   roles,
    //   isAdmin,
    //   socialServices: mappedByServices
    // });
    return {
      user,
      roles,
      isAdmin,
      socialServices: mappedByServices
    };
  }
  async componentWillMount() {
    const self = this;

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
    return (
      <Query query={GET_ME}>
        {({ data, loading }) => {
          const contextState = { ...this.state };
          contextState.loading = loading;
          if (data.Me) {
            if (!data.Me.user) {
              localStorage.removeItem("_c");
            }
            const userData = this.updateUser(
              data.Me.user,
              data.Me.roles,
              data.Me.socialServices
            );
            Object.assign(contextState, userData);
          }
          return (
            <Context.Provider value={contextState}>{children}</Context.Provider>
          );
        }}
      </Query>
    );
  }
}

export default {
  Provider,
  Consumer
};
