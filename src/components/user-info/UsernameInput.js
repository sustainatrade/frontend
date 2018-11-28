import React from 'react';
// import PropTypes from 'prop-types';
import { Button, Input, Label, Message } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
// import Cookie from 'tough-cookie'
import { cleanError } from 'lib/apollo';

import get from 'lodash/get';
import debounce from 'lodash/debounce';

const CHECK_USER = gql`
  query GetUserInfo(
    $_refNo: String
    $username: String
    $email: String
    $accessToken: String
    $providerId: String
  ) {
    UserInfo(
      input: {
        _refNo: $_refNo
        accessToken: $accessToken
        providerId: $providerId
        username: $username
        email: $email
      }
    ) {
      status
      user {
        id
      }
    }
  }
`;

export default class UsernameInput extends React.Component {
  state = { newUsername: null, hideInfoPopup: false };

  popupHandler = ({ errorMessage }) => {
    const { hideInfoPopup } = this.state;
    if (!!errorMessage) {
      this.setState({ hideInfoPopup: !hideInfoPopup });
      return;
    }
  };

  render() {
    const { credentials, user, onValidated } = this.props;
    const { newUsername, hideInfoPopup } = this.state;
    const username = newUsername || get(user, 'username');
    const variables = {
      username
    };
    if (credentials) {
      variables.accessToken = credentials.accessToken;
      variables.providerId = credentials.providerId;
    }

    return (
      <Query query={CHECK_USER} variables={variables} skip={!user} key={username}>
        {({ data, loading, error }) => {
          console.log('username data'); //TRACE
          console.log(data); //TRACE
          console.log('error'); //TRACE
          const errorMessage = get(cleanError(error), 'message');
          console.log(errorMessage); //TRACE
          const openPopup = !!errorMessage && !hideInfoPopup;
          console.log('openPopup'); //TRACE
          console.log(openPopup); //TRACE
          return (
            <React.Fragment>
              <Input
                size="small"
                fluid
                error={!!errorMessage}
                defaultValue={username}
                labelPosition="right"
                type="text"
                // onClick={() => {
                //   this.popupHandler({ errorMessage });
                // }}
                onChange={debounce((e, data) => {
                  console.log('data.value'); //TRACE
                  console.log(data.value); //TRACE
                  console.log('set!'); //TRACE
                  this.setState({ newUsername: data.value });
                }, 1000)}
                placeholder="------ --------"
                onValidated={() => {
                  onValidated && onValidated(true);
                }}
              >
                <Label basic color={!!errorMessage && 'red'}>
                  Username
                </Label>
                <input />
                <Button
                  disabled={!username}
                  color={!!errorMessage && 'red'}
                  loading={loading}
                  icon={!!errorMessage ? 'warning circle' : 'save'}
                />
              </Input>
              {!hideInfoPopup && !!errorMessage && (
                <Message size="small" error header="Invalid username" content={errorMessage} />
              )}
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}
