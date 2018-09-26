import React, { Component } from "react";
// import { List } from 'semantic-ui-react'
import gql from "graphql-tag";
import { Query } from "react-apollo";
import get from "lodash/get";
import { Link } from "@reach/router";

const USER = gql`
  query($_refNo: String!) {
    User(input: { _refNo: $_refNo }) {
      status
      user {
        id
        displayName
      }
    }
  }
`;

export default class UserLabel extends Component {
  render() {
    const { refNo } = this.props;
    return (
      <Query query={USER} variables={{ _refNo: refNo }}>
        {({ loading, error, data = {} }) => {
          if (loading) return <span>-----</span>;
          const user = get(data, "User.user", {});
          return <Link to={`/u/${refNo}`}>{user.displayName}</Link>;
        }}
      </Query>
    );
  }
}
