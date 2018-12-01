import React from 'react';
// import PropTypes from 'prop-types';
import { Dropdown, Button, Icon, Modal, Image, Header } from 'semantic-ui-react';
// import _ from 'lodash'
import { app, facebookProvider, googleProvider } from './firebase';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
// import Cookie from 'tough-cookie'
import LoginContext from './LoginContext';
import { emitter } from './../ms-graphql-client/MsGraphqlClient';
import { TYPES } from './../../errors';
import { imageUrlToUri } from './../../lib/image';
// import { GetUserInfo } from "./../../gql-schemas/GetUserInfo";
import get from 'lodash/get';
// import debounce from "lodash/debounce";
import WelcomeModal, { PHOTO_DATA_URI_KEY } from './WelcomeModal';
import SettingsContext from '../../contexts/SettingsContext';
import { GET_ME } from '../../gql-schemas';

const LOGOUT = gql`
  mutation {
    UserAuthLogout {
      status
    }
  }
`;

function cookieToStr(str) {
  if (!str) return '';
  let cookieList = [];
  let cookieObj = JSON.parse(str);
  for (const key in cookieObj) {
    cookieList.push(`${key}=${cookieObj[key]}`);
  }
  return cookieList.join('; ');
}

function getPhoto(provider, authDetail) {
  if (provider === 'facebook.com') {
    const {
      additionalUserInfo: { profile }
    } = authDetail;
    const photoUrl = profile.picture.data.url;
    return photoUrl;
  } else if (provider === 'google.com') {
    const {
      additionalUserInfo: { profile }
    } = authDetail;
    const photoUrl = profile.picture;
    return photoUrl;
  }
}

function Logged({ data, refetch }) {
  const { open } = React.useContext(SettingsContext.Context);
  return (
    <LoginContext.Consumer>
      {({ doLogout, compact }) => {
        const user = data.Me.user;
        const photoDataUri = localStorage.getItem(PHOTO_DATA_URI_KEY);
        function dropDownOptions(logoutClicked) {
          const list = [];

          list.push({ key: 0, text: user.displayName, disabled: true });
          list.push({
            key: 1,
            text: 'Setting',
            value: 1,
            onClick() {
              open(true);
            }
          });
          list.push({
            key: 2,
            text: 'Log Out',
            value: 2,
            onClick: logoutClicked
          });

          return list;
        }
        const trigger = (
          <span>
            <Image avatar style={{ width: 23, height: 23 }} src={get(user, 'photoUrl') || photoDataUri} />{' '}
            {!compact &&
              (user.displayName.length > 10 ? `${user.displayName.substring(0, 9)}...` : user.displayName)}
          </span>
        );
        return (
          <Mutation
            mutation={LOGOUT}
            onCompleted={data => {
              doLogout(data);
              refetch();
            }}
          >
            {(logout, { loading, error, data }) => {
              return (
                <Dropdown
                  trigger={trigger}
                  options={dropDownOptions(logout)}
                  simple
                  item
                  style={{ padding: 10 }}
                />
              );
            }}
          </Mutation>
        );
      }}
    </LoginContext.Consumer>
  );
}

/**
 * General component description in JSDoc format. Markdown is *supported*.
 */
export default class UserAuth extends React.Component {
  state = {
    doLogin: data => {
      const { UserAuthLogin } = data;
      const { cookie } = UserAuthLogin;
      let cookieStr = cookieToStr(cookie);

      localStorage.setItem('_c', cookieStr);

      // for (const key in cookieObj) {
      //     Cookies.set(key,cookieObj[key])
      // }
      this.setState({ authDetail: undefined });
    },
    doLogout: data => {
      const userAuthLogout = data.UserAuthLogout || {};
      if (userAuthLogout.status === 'SUCCESS') {
        localStorage.removeItem('_c');
        // for(let ckey in Cookies.get()){
        //     Cookies.remove(ckey)
        //     console.log(`'${ckey}' cookie removed`);
        // }
      }
    }
  };

  loginErrorListener = () => {
    this.setState({ openLogin: true });
  };
  componentWillMount() {
    emitter.addOnce(TYPES.NOT_LOGGED_IN.eventName, this.loginErrorListener);
  }
  componentWillUnmount() {
    emitter.removeListener(TYPES.NOT_LOGGED_IN.eventName, this.loginErrorListener);
  }

  async authWithFacebook() {
    const authDetail = await app.auth().signInWithPopup(facebookProvider);

    const { credential } = authDetail;
    //EAAHRvEehTqMBAM319sqNr6k9EUHEZA1TlyGiSdZAVQrKUfzxENWyCL9ZA173GOu3Cjxf66Nd6rjdA1KAWUjgMVLwsuB8pHZBJDHEG9MqC6z3AljDcMC9203qgX7CeCVIg7cEs05LL57Dx9OTZBF7S0TmkwZCeBb6IZD
    const photoUrl = getPhoto(credential.providerId, authDetail);
    const dataUri = await imageUrlToUri(photoUrl);
    localStorage.setItem(PHOTO_DATA_URI_KEY, dataUri);
    console.log('authDetail'); //TRACE
    console.log(authDetail); //TRACE
    this.setState({ authDetail });
  }
  async authWithGoogle() {
    const result = await app.auth().signInWithPopup(googleProvider);

    console.log('authed with google');
    this.setState({ authDetail: result });
  }

  renderLogin(data, refetch) {
    return (
      <LoginContext.Consumer>
        {({ authDetail, doLogout, compact }) => {
          if (authDetail) return;
          const logButtonProps = compact ? {} : { icon: true, labelPosition: 'left' };
          return (
            <React.Fragment>
              <Button {...logButtonProps} color="green" onClick={() => this.setState({ openLogin: true })}>
                <Icon name="user" />
                {!compact && 'LOGIN'}
              </Button>
              <Modal
                open={this.state.openLogin}
                basic
                size="small"
                onClose={() => this.setState({ openLogin: false })}
              >
                <Header as="h3" icon>
                  <Icon name="user" color="green" />
                  LOG IN
                </Header>
                <Modal.Content>
                  <center>
                    <div style={{ maxWidth: 300 }}>
                      <p>Start selling your item now. User your social accounts to login</p>
                      <Button
                        color="facebook"
                        fluid
                        onClick={async () => {
                          await this.authWithFacebook();
                        }}
                      >
                        <Icon name="facebook" /> Log In with Facebook
                      </Button>
                      {/* <Divider/>
                              <Button color='google plus'
                                  fluid
                                  onClick={async ()=>{
                                      await this.authWithGoogle()
                                  }}
                              >
                              <Icon name='google' /> Log In with Google
                              </Button> */}
                    </div>
                  </center>
                </Modal.Content>
              </Modal>
            </React.Fragment>
          );
        }}
      </LoginContext.Consumer>
    );
  }

  render() {
    const self = this;
    const { compact } = this.props;
    // const { authDetail } = this.state;
    return (
      <div>
        <LoginContext.Provider value={{ ...this.state, compact }}>
          <Query query={GET_ME.query} fetchPolicy="network-only">
            {({ loading, error, data, refetch }) => {
              if (error) return <div />;
              const isLogged = data && data.Me && data.Me.user;
              return (
                <div style={{ minWidth: 65 }}>
                  {loading ? (
                    ''
                  ) : (
                    <React.Fragment>
                      {isLogged ? <Logged data={data} refetch={refetch} /> : this.renderLogin(data, refetch)}
                      <WelcomeModal data={data} refetch={refetch} />
                    </React.Fragment>
                  )}
                </div>
              );
            }}
          </Query>
        </LoginContext.Provider>
      </div>
    );
  }
}
