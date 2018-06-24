import React from 'react';
// import PropTypes from 'prop-types';
import { Dropdown,
        Button,
        Icon,
        Modal,
        // Label,
        Image,
        Header, 
        Divider} from 'semantic-ui-react'
// import _ from 'lodash'
import { app, facebookProvider, googleProvider } from './firebase'
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
// import Cookie from 'tough-cookie'
import LoginContext from './LoginContext'

const GET_ME = gql`
  query{
    Me {
        status
        user {
          id
          displayName
        }
      }
  }
`;
const LOGIN = gql`
  mutation ($creds:UserAuthLoginInput){
    UserAuthLogin(input:$creds){
      status
      cookie
    }
  }
`;
const LOGOUT = gql`
  mutation {
    UserAuthLogout {
      status
    }
  }
`;

function cookieToStr(str){
    if(!str) return '';
    let cookieList = [];
    let cookieObj = JSON.parse(str)
    for (const key in cookieObj) {
        cookieList.push(`${key}=${cookieObj[key]}`)
    }
    return cookieList.join('; ')
}


/**
 * General component description in JSDoc format. Markdown is *supported*.
 */
export default class UserAuth extends React.Component {

    state = {
        doLogin: (data)=>{
            const { UserAuthLogin } = data;
            const { cookie } = UserAuthLogin
            let cookieStr = cookieToStr(cookie);
            
            localStorage.setItem('_c', cookieStr);
        
            // for (const key in cookieObj) {
            //     Cookies.set(key,cookieObj[key])
            // }
            this.setState({authDetail:undefined})
        },
        doLogout: (data)=>{
            const userAuthLogout = data.UserAuthLogout || {};
            if(userAuthLogout.status === 'SUCCESS'){
                localStorage.removeItem('_c');
                // for(let ckey in Cookies.get()){
                //     Cookies.remove(ckey)
                //     console.log(`'${ckey}' cookie removed`);
                // }
            }
        }
    };

    async authWithFacebook() {
        const result = await app.auth().signInWithPopup(facebookProvider);
        
        console.log('authed with facebook');
        this.setState({authDetail:result})
    }
    async authWithGoogle() {
        const result = await app.auth().signInWithPopup(googleProvider);
        
        console.log('authed with google');
        this.setState({authDetail:result})
    }
    renderWelcomeModal = (data, refetch) => (
        <LoginContext.Consumer>
            {({ authDetail, doLogin }) => { 
                if(!authDetail)
                    return;
                function getPhoto(provider){
                    if(provider==='facebook.com'){
                        const { additionalUserInfo: { profile } } = authDetail;
                        const photoUrl = profile.picture.data.url;
                        return photoUrl;
                    }
                    else if(provider==='google.com'){
                        const { additionalUserInfo: { profile } } = authDetail;
                        const photoUrl = profile.picture;
                        return photoUrl;
                    }
                }
                const { user, credential } = authDetail;
                const photoUrl = getPhoto(credential.providerId)
                localStorage.setItem('photoUrl', photoUrl);
                return (
                <Modal open={true} size='mini'>
                    <Header as='h3' image>
                        <center>
                            <Image src={photoUrl} size='tiny' circular/>
                            {user.displayName}
                        </center>
                    </Header>
                    <Modal.Content>
                        <center>
                            <p>Hello! Have a good time!!</p>
                            
                                    <Mutation mutation={LOGIN} 
                                        variables={{ creds: {
                                            accessToken: credential.accessToken,
                                            provider: credential.providerId
                                        }}}
                                        onCompleted={data=>{
                                            doLogin(data);
                                            refetch();
                                        }}
                                    >
                                        {(auth, { loading, error, data }) => {
                                            if(data){
                                                return <div>Done!</div>
                                            }
                                            return (
                                                <Button loading={loading} color='green'
                                                    onClick={auth}>
                                                    Continue 
                                                </Button>
                                            )}
                                        }
                                    </Mutation>
                            
                        </center>
                    </Modal.Content>
                </Modal>
            )}}
        </LoginContext.Consumer>
    )
    

        
    renderLogout = (data, refetch) =>  (<LoginContext.Consumer>
              {({ doLogout }) => {
                    function dropDownOptions(logoutClicked){
                        return [
                          { key: 1, text: 'Setting', value: 1 },
                          { key: 2, text: 'Log Out', value: 2, onClick: logoutClicked}
                      ]
                    }
                    
                    const user = data.Me.user;
                    const photoUrl = localStorage.getItem('photoUrl')
                    const trigger = (
                      <span>
                        <Image avatar style={{width:23,height:23}} src={photoUrl} /> { user.displayName }
                      </span>
                    )
                return (
                    <Mutation mutation={LOGOUT} 
                        onCompleted={data=>{
                            doLogout(data);
                            refetch();
                        }}
                    >
                        {(logout, { loading, error, data }) => (
                            <Dropdown trigger={trigger} options={dropDownOptions(logout)} simple item style={{padding:10}}/>
                        )}
                    </Mutation>
              )}}
        </LoginContext.Consumer>
    )
                        // <Button 
                        //     content='Log Out'
                        //     loading={ loading }
                        //     onClick={ logout }
                        // />
    renderLogin = (data, refetch) => (
            <LoginContext.Consumer>
              {({ authDetail, doLogout }) => {
                if(authDetail) return;
                return (
                <Modal trigger={<Button icon labelPosition='left' color='green'>
                    <Icon name='user' />
                    LOGIN
                </Button>} basic size='small'>
                    <Header as='h3' icon>
                        <Icon name='user' color='green'/>
                        LOG IN
                    </Header>
                    <Modal.Content>
                        <center>
                            <div  style={{maxWidth:300}}>
                                <p>Start selling your item now. User your social accounts to login</p>
                                <Button color='facebook'
                                    fluid
                                    onClick={async ()=>{
                                        await this.authWithFacebook()
                                    }}
                                >
                                <Icon name='facebook' /> Log In with Facebook
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
                </Modal>)}}
        </LoginContext.Consumer>
    )
        
    render() {
        const self = this;
        // const { authDetail } = this.state;
        return (
            <div>
                <LoginContext.Provider value={ this.state }>
                    <Query query={GET_ME} fetchPolicy='network-only'>
                        {({ loading, error, data, refetch }) => {
                            if(loading) return <div/>;
                            if(error) return <div/>;
                            console.log('data')//TRACE
                            console.log(data)//TRACE
                            let buttonDisplay;
                            if(data && data.Me && data.Me.user){
                                // const { user } = data.Me;
                                buttonDisplay = self.renderLogout;
                            }
                            else{
                                buttonDisplay = self.renderLogin;
                            }
                            return <div>
                                {buttonDisplay(data, refetch)}
                                {this.renderWelcomeModal(data, refetch)}
                            </div>
                        }}
                    </Query>
                    
                </LoginContext.Provider>
            </div>
        )
    }
}